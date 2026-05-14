"""
Servicio de Pagos.
Maneja la creación de preferencias en MercadoPago, el procesamiento
de webhooks IPN con idempotencia, y la consulta de estado.
"""

import hashlib
import hmac
import uuid

import mercadopago
from fastapi import HTTPException, Request, status

from app.core.config import get_settings
from app.core.uow import UnitOfWork
from app.modules.pagos.model import Pago
from app.modules.pagos.schemas import PagoEstadoResponse, PagoResponse


class PagosService:
    @staticmethod
    def _get_sdk() -> mercadopago.SDK:
        settings = get_settings()
        return mercadopago.SDK(settings.MP_ACCESS_TOKEN)

    @staticmethod
    async def create_preference(pedido_id: int, usuario_id: int) -> PagoResponse:
        """
        Crea una preferencia de pago en MercadoPago y registra el Pago en BD.
        El external_reference actúa como idempotency_key para el webhook.
        """
        settings = get_settings()

        async with UnitOfWork() as uow:
            # Validar que el pedido existe y pertenece al usuario
            pedido = await uow.pedidos.get_by_id(pedido_id)
            if not pedido or pedido.usuario_id != usuario_id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Pedido no encontrado",
                )
            if pedido.estado_codigo != "PENDIENTE":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Solo se puede iniciar el pago de pedidos en estado PENDIENTE",
                )

            idempotency_key = str(uuid.uuid4())

            # Crear preferencia en MercadoPago
            sdk = PagosService._get_sdk()
            preference_data = {
                "items": [
                    {
                        "id": str(pedido.id),
                        "title": f"Pedido #{pedido.id} - Food Store",
                        "quantity": 1,
                        "unit_price": float(pedido.total),
                        "currency_id": "ARS",
                    }
                ],
                "external_reference": idempotency_key,
                "back_urls": {
                    "success": f"http://localhost:5173/pago/success?pedido_id={pedido.id}",
                    "failure": f"http://localhost:5173/pago/failure?pedido_id={pedido.id}",
                    "pending": f"http://localhost:5173/pago/pending?pedido_id={pedido.id}",
                },
                "auto_return": "approved",
                "notification_url": settings.MP_NOTIFICATION_URL or None,
            }

            pref_response = sdk.preference().create(preference_data)
            if pref_response["status"] not in (200, 201):
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Error al crear preferencia en MercadoPago",
                )

            preference = pref_response["response"]
            preference_id: str = preference["id"]
            init_point: str = preference.get("sandbox_init_point", preference["init_point"])

            # Registrar pago en BD
            pago = Pago(
                pedido_id=pedido.id,
                monto=float(pedido.total),
                mp_status="pending",
                external_reference=idempotency_key,
                idempotency_key=idempotency_key,
            )
            uow.session.add(pago)
            await uow.session.flush()

        return PagoResponse(
            id=pago.id,
            pedido_id=pago.pedido_id,
            monto=pago.monto,
            mp_payment_id=pago.mp_payment_id,
            mp_status=pago.mp_status,
            external_reference=pago.external_reference,
            preference_id=preference_id,
            init_point=init_point,
        )

    @staticmethod
    async def process_webhook(request: Request) -> dict:
        """
        Procesa el webhook IPN de MercadoPago.
        - Valida firma x-signature si MP_WEBHOOK_SECRET está configurado.
        - Aplica idempotencia por mp_payment_id.
        - Actualiza estado del Pago.
        """
        settings = get_settings()
        body = await request.body()
        payload = await request.json()

        # Validar firma si hay secret configurado
        if settings.MP_ACCESS_TOKEN:
            x_signature = request.headers.get("x-signature", "")
            x_request_id = request.headers.get("x-request-id", "")
            data_id = payload.get("data", {}).get("id", "")

            if x_signature and settings.MP_ACCESS_TOKEN:
                # MP firma: ts=...;v1=hmac_sha256(secret, "id:DATA_ID;request-id:X_REQUEST_ID;ts:TS;")
                parts = dict(p.split("=", 1) for p in x_signature.split(";") if "=" in p)
                ts = parts.get("ts", "")
                v1 = parts.get("v1", "")
                manifest = f"id:{data_id};request-id:{x_request_id};ts:{ts};"
                expected = hmac.new(
                    settings.MP_ACCESS_TOKEN.encode(),
                    manifest.encode(),
                    hashlib.sha256,
                ).hexdigest()
                if not hmac.compare_digest(expected, v1):
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Firma de webhook inválida",
                    )

        # Solo procesar notificaciones de pagos
        notification_type = payload.get("type", payload.get("topic", ""))
        if notification_type != "payment":
            return {"status": "ignored", "reason": "not_payment_type"}

        mp_payment_id = int(payload.get("data", {}).get("id", 0))
        if not mp_payment_id:
            return {"status": "ignored", "reason": "no_payment_id"}

        # Consultar estado real a MP API
        sdk = PagosService._get_sdk()
        mp_response = sdk.payment().get(mp_payment_id)
        if mp_response["status"] != 200:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Error al consultar MP")

        payment_data = mp_response["response"]
        mp_status: str = payment_data.get("status", "unknown")
        external_ref: str = payment_data.get("external_reference", "")

        async with UnitOfWork() as uow:
            # Idempotencia: buscar por mp_payment_id
            pago_existente = await uow.pagos.get_by_mp_payment_id(mp_payment_id)

            if pago_existente and pago_existente.mp_status == mp_status:
                # Ya procesado con mismo estado → skip
                return {"status": "skipped", "reason": "already_processed"}

            # Buscar el pago por external_reference si no lo encontramos por payment_id
            if not pago_existente:
                from sqlalchemy import select
                from app.modules.pagos.model import Pago as PagoModel
                result = await uow.session.execute(
                    select(PagoModel).where(PagoModel.external_reference == external_ref)
                )
                pago_existente = result.scalar_one_or_none()

            if not pago_existente:
                return {"status": "ignored", "reason": "pago_not_found"}

            # Actualizar estado
            await uow.pagos.update_estado(pago_existente, mp_status, mp_payment_id)

            # Si aprobado, el FSM backend (Change 11a) se encargará de la transición PENDIENTE→CONFIRMADO
            if mp_status == "approved":
                from app.modules.pedidos.fsm import OrderFSM
                await OrderFSM.transition_state(
                    uow=uow,
                    pedido_id=pago_existente.pedido_id,
                    nuevo_estado="CONFIRMADO",
                    motivo="Pago aprobado vía MercadoPago",
                )

        return {"status": "processed", "mp_status": mp_status}

    @staticmethod
    async def get_estado(pedido_id: int, usuario_id: int) -> PagoEstadoResponse:
        """Retorna el estado actual del pago y del pedido para polling frontend."""
        async with UnitOfWork() as uow:
            pedido = await uow.pedidos.get_by_id(pedido_id)
            if not pedido or pedido.usuario_id != usuario_id:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")

            pago = await uow.pagos.get_by_pedido_id(pedido_id)

            return PagoEstadoResponse(
                pedido_id=pedido.id,
                pago_id=pago.id if pago else None,
                pago_estado=pago.mp_status if pago else None,
                mp_payment_id=pago.mp_payment_id if pago else None,
                pedido_estado=pedido.estado_codigo,
            )

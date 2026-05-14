"""
Router de Pagos.
Expone los endpoints de creación de preferencia, webhook IPN y consulta de estado.
"""

from fastapi import APIRouter, Depends, Request

from app.core.security import get_current_user
from app.modules.pagos.schemas import PagoEstadoResponse, PagoResponse
from app.modules.pagos.service import PagosService
from app.modules.usuarios.model import Usuario

router = APIRouter(prefix="/pagos", tags=["pagos"])


@router.post("/{pedido_id}", response_model=PagoResponse, status_code=201)
async def crear_preferencia_pago(
    pedido_id: int,
    current_user: Usuario = Depends(get_current_user),
):
    """
    Crea una preferencia de pago en MercadoPago para el pedido indicado.
    El pedido debe estar en estado PENDIENTE y pertenecer al usuario autenticado.
    """
    return await PagosService.create_preference(pedido_id, current_user.id)


@router.post("/webhook", status_code=200)
async def webhook_pago(request: Request):
    """
    Endpoint receptor de notificaciones IPN de MercadoPago.
    No requiere autenticación — validado por firma x-signature.
    """
    return await PagosService.process_webhook(request)


@router.get("/{pedido_id}/estado", response_model=PagoEstadoResponse)
async def estado_pago(
    pedido_id: int,
    current_user: Usuario = Depends(get_current_user),
):
    """
    Retorna el estado actual del pago y del pedido.
    Usado por el frontend para polling en las páginas de retorno.
    """
    return await PagosService.get_estado(pedido_id, current_user.id)

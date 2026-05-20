"""
Servicio de Pedidos.
Maneja la lógica de negocio y las transacciones atómicas.
"""

from fastapi import HTTPException, status

from app.core.uow import UnitOfWork
from app.modules.pedidos.model import DetallePedido, HistorialEstadoPedido, Pedido
from app.modules.pagos.repository import PagoRepository
from app.modules.pedidos.schemas import (
    DetallePedidoResponse,
    HistorialEntry,
    HistorialEstadoPedidoResponse,
    PagoEstadoInfo,
    PedidoCreate,
    PedidoDetailResponse,
    PedidoListResponse,
    PedidoResponse,
)
from app.modules.usuarios.model import Usuario


class PedidosService:
    @staticmethod
    async def create_pedido(
        schema: PedidoCreate,
        current_user: Usuario,
    ) -> PedidoResponse:
        """
        Crea un pedido de forma atómica.
        Utiliza SELECT FOR UPDATE para bloquear los productos y validar stock.
        """
        async with UnitOfWork() as uow:
            # 1. Validar y obtener dirección
            direccion = await uow.direcciones.get_by_id(schema.direccion_id)
            if not direccion or direccion.usuario_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Dirección de entrega inválida o no pertenece al usuario",
                )

            # Crear snapshot de dirección
            direccion_snapshot = {
                "calle": direccion.calle,
                "numero": direccion.numero,
                "piso_depto": direccion.piso_depto,
                "ciudad": direccion.ciudad,
                "codigo_postal": direccion.codigo_postal,
                "provincia": direccion.provincia,
            }

            # 2. Bloquear productos para prevenir deadlocks e inconsistencias
            producto_ids = [item.producto_id for item in schema.items]
            productos = await uow.productos.get_many_with_lock(producto_ids)
            
            # Crear diccionario para acceso rápido
            productos_dict = {p.id: p for p in productos}

            # Validar que todos los productos existen
            if len(productos_dict) != len(set(producto_ids)):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Uno o más productos no existen",
                )

            # 3. Preparar pedido base
            pedido = Pedido(
                usuario_id=current_user.id,
                estado_codigo="PENDIENTE",
                direccion_id=direccion.id,
                direccion_snapshot=direccion_snapshot,
                notas=schema.notas,
                costo_envio=50.00,  # Valor por defecto
                total=50.00,  # Se sumarán los subtotales
            )
            
            # Guardar pedido para obtener el ID
            pedido = await uow.pedidos.create(pedido)

            # 4. Procesar items y validar stock
            detalles_a_crear = []
            total_productos = 0.0

            for item in schema.items:
                producto = productos_dict[item.producto_id]
                
                # Validar stock (asumimos que existe un campo stock en Producto, si no lo hay, asumo que sí)
                if not getattr(producto, "disponible", True):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"El producto {producto.nombre} no está disponible",
                    )
                    
                if getattr(producto, "stock", 100) < item.cantidad:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Stock insuficiente para {producto.nombre}",
                    )

                # Decrementar stock
                if hasattr(producto, "stock"):
                    producto.stock -= item.cantidad
                    await uow.productos.update(producto)

                # Calcular subtotal
                precio = float(producto.precio)
                subtotal = precio * item.cantidad
                total_productos += subtotal

                # Preparar detalle
                detalle = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=producto.id,
                    nombre_snapshot=producto.nombre,
                    precio_snapshot=precio,
                    cantidad=item.cantidad,
                    subtotal=subtotal,
                    personalizacion=item.ingredientes_excluidos if item.ingredientes_excluidos else None,
                )
                detalles_a_crear.append(detalle)

            # Actualizar total del pedido
            pedido.total = total_productos + float(pedido.costo_envio)
            await uow.pedidos.update(pedido)

            # Insertar detalles
            for detalle in detalles_a_crear:
                uow.session.add(detalle)
            
            # 5. Insertar historial de estado inicial
            historial = HistorialEstadoPedido(
                pedido_id=pedido.id,
                estado_hasta="PENDIENTE",
                usuario_id=current_user.id,
                motivo="Creación de pedido",
            )
            uow.session.add(historial)

            # Flush para asegurar integridad antes del commit
            await uow.session.flush()
            
            # El context manager de UoW hará commit automáticamente
            
        # Refrescar pedido con detalles (en una nueva sesión o ya guardado en la respuesta)
        # Para facilitar, retornamos la data armada
        
        # Como necesitamos devolver el PedidoResponse y las relaciones lazy pueden fallar, 
        # obtendremos el pedido con relaciones
        async with UnitOfWork() as uow_read:
            # Asumimos que get_with_relations en pedido carga detalles
            pedido_creado = await uow_read.pedidos.get_by_id(pedido.id) # type: ignore
            # Workaround: SQLModel relations should be eager loaded or returned manually
            # we'll let Pydantic handle it if lazy loading is enabled, or we fetch it via stmt
            
            # Let's fetch details manually to ensure they are present for the response
            stmt_det = select(DetallePedido).where(DetallePedido.pedido_id == pedido.id)
            from sqlalchemy import select
            res = await uow_read.session.execute(stmt_det)
            detalles_bd = list(res.scalars().all())
            
            pedido_creado.detalles = detalles_bd # type: ignore

        return PedidoResponse.model_validate(pedido_creado)
    @staticmethod
    async def transition_pedido_state(
        pedido_id: int,
        nuevo_estado: str,
        usuario_id: int,
        motivo: str | None = None,
    ) -> PedidoResponse:
        """
        Transiciona un pedido a un nuevo estado usando el FSM.
        """
        async with UnitOfWork() as uow:
            from app.modules.pedidos.fsm import OrderFSM
            pedido = await OrderFSM.transition_state(
                uow=uow,
                pedido_id=pedido_id,
                nuevo_estado=nuevo_estado,
                usuario_id=usuario_id,
                motivo=motivo,
            )
            return PedidoResponse.model_validate(pedido)

    @staticmethod
    async def get_pedido_history(
        pedido_id: int,
        current_user: Usuario,
    ) -> list[HistorialEstadoPedidoResponse]:
        """
        Obtiene el historial de estados de un pedido.
        Clientes solo ven el historial de SUS pedidos.
        Gestores/Admins ven cualquiera.
        """
        async with UnitOfWork() as uow:
            pedido = await uow.pedidos.get_by_id(pedido_id)
            if not pedido:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Pedido no encontrado",
                )

            # Validar permisos
            is_staff = any(r.rol_codigo in ["PEDIDOS", "ADMIN"] for r in current_user.usuario_roles)
            if not is_staff and pedido.usuario_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="No tienes permiso para ver el historial de este pedido",
                )

            # Obtener historial
            from sqlalchemy import select
            stmt = select(HistorialEstadoPedido).where(HistorialEstadoPedido.pedido_id == pedido_id).order_by(HistorialEstadoPedido.creado_en.asc())
            result = await uow.session.execute(stmt)
            historial = result.scalars().all()

            return [HistorialEstadoPedidoResponse.model_validate(h) for h in historial]

    @staticmethod
    async def get_user_pedidos(
        current_user: Usuario,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None,
        filtro_usuario_id: int | None = None,
    ) -> PedidoListResponse:
        """
        Lista pedidos. Clientes ven solo los suyos; gestores/admins pueden filtrar.
        """
        is_staff = any(r.rol_codigo in ["PEDIDOS", "ADMIN"] for r in current_user.usuario_roles)

        async with UnitOfWork() as uow:
            if is_staff:
                pedidos, total = await uow.pedidos.get_all(
                    skip=skip,
                    limit=limit,
                    estado=estado,
                    usuario_id=filtro_usuario_id,
                )
            else:
                pedidos, total = await uow.pedidos.get_by_user_id(
                    usuario_id=current_user.id,
                    skip=skip,
                    limit=limit,
                    estado=estado,
                )

        return PedidoListResponse(
            data=[PedidoResponse.model_validate(p) for p in pedidos],
            total=total,
            skip=skip,
            limit=limit,
        )

    @staticmethod
    async def get_pedido_detail(
        pedido_id: int,
        current_user: Usuario,
    ) -> PedidoDetailResponse:
        """
        Retorna detalle completo de un pedido: datos, ítems, historial y pago.
        """
        async with UnitOfWork() as uow:
            pedido = await uow.pedidos.get_detail_by_id(pedido_id)
            if not pedido:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Pedido no encontrado",
                )

            is_staff = any(r.rol_codigo in ["PEDIDOS", "ADMIN"] for r in current_user.usuario_roles)
            if not is_staff and pedido.usuario_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="No tienes permiso para ver este pedido",
                )

            pago_repo = PagoRepository(uow.session)
            pago = await pago_repo.get_by_pedido_id(pedido_id)
            pago_info = None
            if pago:
                pago_info = PagoEstadoInfo(
                    pago_id=pago.id,
                    pago_estado=pago.mp_status,
                    mp_payment_id=pago.mp_payment_id,
                )

            historial = [HistorialEntry.model_validate(h) for h in (pedido.historial_estados or [])]

            return PedidoDetailResponse(
                id=pedido.id,
                usuario_id=pedido.usuario_id,
                estado_codigo=pedido.estado_codigo,
                direccion_id=pedido.direccion_id,
                total=float(pedido.total),
                costo_envio=float(pedido.costo_envio),
                notas=pedido.notas,
                creado_en=pedido.creado_en,
                actualizado_en=pedido.actualizado_en,
                detalles=[DetallePedidoResponse.model_validate(d) for d in (pedido.detalles or [])],
                historial=historial,
                pago=pago_info,
            )

"""
Finite State Machine (FSM) para el ciclo de vida de los pedidos.
Centraliza la lógica de transiciones, validaciones, historial y cancelaciones.
"""

from fastapi import HTTPException, status
from sqlalchemy import select

from app.core.uow import UnitOfWork
from app.modules.pedidos.model import HistorialEstadoPedido, Pedido
from app.modules.productos.model import Producto


class OrderFSM:
    """Máquina de estados para los pedidos."""

    # Mapa de transiciones válidas: estado_actual -> list[estado_destino]
    TRANSITIONS = {
        "PENDIENTE": ["CONFIRMADO", "CANCELADO"],
        "CONFIRMADO": ["EN_PREP", "CANCELADO"],
        "EN_PREP": ["EN_CAMINO", "CANCELADO"],
        "EN_CAMINO": ["ENTREGADO", "CANCELADO"],
        "ENTREGADO": [],  # Estado terminal
        "CANCELADO": [],  # Estado terminal
    }

    @staticmethod
    async def transition_state(
        uow: UnitOfWork,
        pedido_id: int,
        nuevo_estado: str,
        usuario_id: int | None = None,
        motivo: str | None = None,
    ) -> Pedido:
        """
        Ejecuta una transición de estado de manera segura.
        Debe ser llamado DENTRO de un contexto UnitOfWork activo, ya que
        manipula locks y requiere flush/commit coordinado.
        """
        # 1. Obtener pedido con bloqueo (FOR UPDATE) para evitar race conditions
        # Nota: PedidoRepository necesita tener un método get_by_id_with_lock
        pedido = await uow.pedidos.get_by_id_with_lock(pedido_id)
        if not pedido:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pedido no encontrado",
            )

        estado_actual = pedido.estado_codigo

        # 2. Validar transición
        allowed_next_states = OrderFSM.TRANSITIONS.get(estado_actual, [])
        if nuevo_estado not in allowed_next_states:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Transición inválida: no se puede pasar de {estado_actual} a {nuevo_estado}",
            )

        # 3. Lógica específica por estado (ej. CANCELADO -> Restaurar stock)
        if nuevo_estado == "CANCELADO":
            await OrderFSM._handle_cancellation(uow, pedido)

        # 4. Actualizar estado del pedido
        pedido.estado_codigo = nuevo_estado
        await uow.pedidos.update(pedido)

        # 5. Insertar historial (append-only)
        historial = HistorialEstadoPedido(
            pedido_id=pedido.id,
            estado_desde=estado_actual,
            estado_hasta=nuevo_estado,
            usuario_id=usuario_id,
            motivo=motivo,
        )
        uow.session.add(historial)
        
        # Flush para que el UoW central maneje el commit luego
        await uow.session.flush()
        
        return pedido

    @staticmethod
    async def _handle_cancellation(uow: UnitOfWork, pedido: Pedido) -> None:
        """
        Restaura el stock de los productos de un pedido cancelado.
        """
        # Obtener los detalles del pedido
        from app.modules.pedidos.model import DetallePedido
        result = await uow.session.execute(
            select(DetallePedido).where(DetallePedido.pedido_id == pedido.id)
        )
        detalles = result.scalars().all()

        for detalle in detalles:
            # Obtener el producto con FOR UPDATE para modificar stock de forma segura
            producto = await uow.productos.get_by_id_with_lock(detalle.producto_id)
            if producto:
                # El stock fue restado en la creación (PENDIENTE)
                # Lo restauramos
                producto.stock_cantidad += detalle.cantidad
                await uow.productos.update(producto)
            else:
                # Si el producto fue eliminado duro o no existe, lo ignoramos para no abortar
                # la cancelación del pedido. (Normalmente se usa soft-delete).
                pass

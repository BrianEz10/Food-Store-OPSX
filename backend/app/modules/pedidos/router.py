"""
Endpoints para la gestión de pedidos.
"""

from fastapi import APIRouter, Depends, status

from app.core.security import get_current_active_user, require_role
from app.modules.pedidos.schemas import (
    HistorialEstadoPedidoResponse,
    PedidoCreate,
    PedidoResponse,
    PedidoStatusUpdate,
)
from app.modules.pedidos.service import PedidosService
from app.modules.usuarios.model import Usuario

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


@router.post(
    "",
    response_model=PedidoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un nuevo pedido",
    description="Crea un pedido de forma atómica validando stock y guardando snapshots.",
    dependencies=[Depends(require_role(["CLIENT", "ADMIN"]))],
)
async def crear_pedido(
    schema: PedidoCreate,
    current_user: Usuario = Depends(get_current_active_user),
) -> PedidoResponse:
    """
    Crea un nuevo pedido a partir del payload enviado.
    """
    return await PedidosService.create_pedido(schema, current_user)


@router.get(
    "/{pedido_id}/historial",
    response_model=list[HistorialEstadoPedidoResponse],
    summary="Obtener historial de estados",
)
async def obtener_historial_pedido(
    pedido_id: int,
    current_user: Usuario = Depends(get_current_active_user),
) -> list[HistorialEstadoPedidoResponse]:
    """
    Retorna el historial de estados de un pedido específico.
    """
    return await PedidosService.get_pedido_history(pedido_id, current_user)


@router.post(
    "/{pedido_id}/estado",
    response_model=PedidoResponse,
    summary="Actualizar estado del pedido (FSM)",
    dependencies=[Depends(require_role(["GESTOR", "ADMIN"]))],
)
async def actualizar_estado_pedido(
    pedido_id: int,
    schema: PedidoStatusUpdate,
    current_user: Usuario = Depends(get_current_active_user),
) -> PedidoResponse:
    """
    Transiciona un pedido a un nuevo estado validando las reglas de la FSM.
    Solo para gestores y administradores.
    """
    return await PedidosService.transition_pedido_state(
        pedido_id=pedido_id,
        nuevo_estado=schema.nuevo_estado,
        usuario_id=current_user.id,
        motivo=schema.motivo,
    )

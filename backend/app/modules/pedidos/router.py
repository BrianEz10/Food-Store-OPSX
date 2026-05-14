"""
Endpoints para la gestión de pedidos.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query, status

from app.core.security import get_current_active_user, require_role
from app.modules.pedidos.schemas import (
    HistorialEstadoPedidoResponse,
    PedidoCreate,
    PedidoDetailResponse,
    PedidoListResponse,
    PedidoResponse,
    PedidoStatusUpdate,
)
from app.modules.pedidos.service import PedidosService
from app.modules.usuarios.model import Usuario

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


@router.get(
    "",
    response_model=PedidoListResponse,
    summary="Listar pedidos",
)
async def listar_pedidos(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    estado: Optional[str] = Query(None),
    usuario_id: Optional[int] = Query(None),
    current_user: Usuario = Depends(get_current_active_user),
) -> PedidoListResponse:
    """
    Lista pedidos. Los clientes ven solo sus pedidos.
    Gestores/Admins ven todos y pueden filtrar por usuario_id.
    """
    return await PedidosService.get_user_pedidos(
        current_user=current_user,
        skip=skip,
        limit=limit,
        estado=estado,
        filtro_usuario_id=usuario_id,
    )


@router.get(
    "/{pedido_id}",
    response_model=PedidoDetailResponse,
    summary="Obtener detalle de pedido",
)
async def obtener_detalle_pedido(
    pedido_id: int,
    current_user: Usuario = Depends(get_current_active_user),
) -> PedidoDetailResponse:
    """
    Retorna el detalle completo de un pedido con historial y estado del pago.
    """
    return await PedidosService.get_pedido_detail(pedido_id, current_user)


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
    dependencies=[Depends(require_role(["PEDIDOS", "ADMIN"]))],
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

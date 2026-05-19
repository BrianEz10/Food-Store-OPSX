"""
Endpoints de administración.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query

from app.core.dependencies import get_current_active_user, require_role
from app.modules.admin.schemas import (
    AdminUsuarioDetailResponse,
    AdminUsuarioListResponse,
    AdminUsuarioResponse,
    AdminUsuarioUpdate,
    AdminUsuarioEstadoUpdate,
    DashboardResumenResponse,
    VentasPorMesEntry,
    TopProductoEntry,
    PedidosPorEstadoEntry,
    ConfiguracionResponse,
    ConfiguracionUpdate,
)
from app.modules.admin.service import AdminService, DashboardService
from app.modules.usuarios.model import Usuario

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get(
    "/usuarios",
    response_model=AdminUsuarioListResponse,
    summary="Listar usuarios",
    dependencies=[Depends(require_role(["ADMIN"]))],
)
async def listar_usuarios(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    q: Optional[str] = Query(None),
    rol: Optional[str] = Query(None),
    incluir_eliminados: bool = Query(False),
    current_user: Usuario = Depends(get_current_active_user),
) -> AdminUsuarioListResponse:
    """
    Lista usuarios del sistema con filtros. Solo para ADMIN.
    """
    return await AdminService.listar_usuarios(
        current_user=current_user,
        skip=skip,
        limit=limit,
        q=q,
        rol=rol,
        incluir_eliminados=incluir_eliminados,
    )


@router.get(
    "/usuarios/{usuario_id}",
    response_model=AdminUsuarioDetailResponse,
    summary="Detalle de usuario",
    dependencies=[Depends(require_role(["ADMIN"]))],
)
async def obtener_usuario(
    usuario_id: int,
    current_user: Usuario = Depends(get_current_active_user),
) -> AdminUsuarioDetailResponse:
    """
    Obtiene detalle completo de un usuario.
    """
    return await AdminService.get_usuario_detail(usuario_id, current_user)


@router.put(
    "/usuarios/{usuario_id}",
    response_model=AdminUsuarioResponse,
    summary="Actualizar usuario",
    dependencies=[Depends(require_role(["ADMIN"]))],
)
async def actualizar_usuario(
    usuario_id: int,
    data: AdminUsuarioUpdate,
    current_user: Usuario = Depends(get_current_active_user),
) -> AdminUsuarioResponse:
    """
    Actualiza datos y roles de un usuario. Si se cambian roles, se invalidan sus refresh tokens.
    """
    return await AdminService.update_usuario(usuario_id, data, current_user)


@router.patch(
    "/usuarios/{usuario_id}/estado",
    response_model=AdminUsuarioResponse,
    summary="Activar/Desactivar usuario",
    dependencies=[Depends(require_role(["ADMIN"]))],
)
async def toggle_usuario_estado(
    usuario_id: int,
    data: AdminUsuarioEstadoUpdate,
    current_user: Usuario = Depends(get_current_active_user),
) -> AdminUsuarioResponse:
    """
    Activa o desactiva un usuario (soft-delete/restore).
    Al desactivar, se invalidan sus refresh tokens.
    """
    return await AdminService.toggle_usuario_estado(usuario_id, data, current_user)


# ── Dashboard endpoints ──

@router.get(
    "/dashboard/resumen",
    response_model=DashboardResumenResponse,
    summary="KPIs del dashboard",
    dependencies=[Depends(require_role(["ADMIN", "STOCK", "PEDIDOS"]))],
)
async def dashboard_resumen(
    current_user: Usuario = Depends(get_current_active_user),
) -> DashboardResumenResponse:
    """Retorna KPIs generales del sistema."""
    return await DashboardService.get_resumen()


@router.get(
    "/dashboard/ventas-por-mes",
    response_model=list[VentasPorMesEntry],
    summary="Ventas por mes",
    dependencies=[Depends(require_role(["ADMIN", "STOCK", "PEDIDOS"]))],
)
async def dashboard_ventas_por_mes(
    current_user: Usuario = Depends(get_current_active_user),
) -> list[VentasPorMesEntry]:
    """Retorna ventas agrupadas por mes (últimos 12 meses)."""
    return await DashboardService.get_ventas_por_mes()


@router.get(
    "/dashboard/top-productos",
    response_model=list[TopProductoEntry],
    summary="Top productos más vendidos",
    dependencies=[Depends(require_role(["ADMIN", "STOCK", "PEDIDOS"]))],
)
async def dashboard_top_productos(
    limit: int = Query(10, ge=1, le=50),
    current_user: Usuario = Depends(get_current_active_user),
) -> list[TopProductoEntry]:
    """Retorna ranking de productos más vendidos."""
    return await DashboardService.get_top_productos(limit)


@router.get(
    "/dashboard/pedidos-por-estado",
    response_model=list[PedidosPorEstadoEntry],
    summary="Pedidos por estado",
    dependencies=[Depends(require_role(["ADMIN", "STOCK", "PEDIDOS"]))],
)
async def dashboard_pedidos_por_estado(
    current_user: Usuario = Depends(get_current_active_user),
) -> list[PedidosPorEstadoEntry]:
    """Retorna distribución de pedidos por estado."""
    return await DashboardService.get_pedidos_por_estado()


@router.get(
    "/configuracion",
    response_model=list[ConfiguracionResponse],
    summary="Listar configuración",
    dependencies=[Depends(require_role(["ADMIN", "STOCK", "PEDIDOS"]))],
)
async def listar_configuracion(
    current_user: Usuario = Depends(get_current_active_user),
) -> list[ConfiguracionResponse]:
    """Retorna todas las configuraciones del sistema."""
    return await DashboardService.listar_configuracion()


@router.put(
    "/configuracion",
    response_model=ConfiguracionResponse,
    summary="Actualizar configuración",
    dependencies=[Depends(require_role(["ADMIN"]))],
)
async def actualizar_configuracion(
    data: ConfiguracionUpdate,
    current_user: Usuario = Depends(get_current_active_user),
) -> ConfiguracionResponse:
    """Crea o actualiza una configuración del sistema."""
    return await DashboardService.actualizar_configuracion(data)

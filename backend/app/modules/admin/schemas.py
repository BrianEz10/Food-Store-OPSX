"""
Schemas para endpoints de administración.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class AdminUsuarioResponse(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    telefono: Optional[str] = None
    roles: list[str] = []
    activo: bool = True
    creado_en: datetime

    class Config:
        from_attributes = True


class AdminUsuarioDetailResponse(AdminUsuarioResponse):
    actualizado_en: Optional[datetime] = None
    eliminado_en: Optional[datetime] = None


class AdminUsuarioListResponse(BaseModel):
    data: list[AdminUsuarioResponse]
    total: int
    skip: int = 0
    limit: int = 20


class AdminUsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[str] = None
    roles: Optional[list[str]] = None


class AdminUsuarioEstadoUpdate(BaseModel):
    activo: bool


# ── Dashboard schemas ──

class DashboardResumenResponse(BaseModel):
    ventas_totales: float = 0
    cantidad_pedidos: int = 0
    usuarios_registrados: int = 0
    ticket_promedio: float = 0
    pedidos_hoy: int = 0
    productos_disponibles: int = 0


class VentasPorMesEntry(BaseModel):
    mes: str
    ventas: float
    cantidad_pedidos: int


class TopProductoEntry(BaseModel):
    nombre: str
    cantidad_vendida: int
    ingresos_totales: float


class PedidosPorEstadoEntry(BaseModel):
    estado: str
    cantidad: int


class ConfiguracionResponse(BaseModel):
    clave: str
    valor: str
    descripcion: Optional[str] = None
    actualizado_en: Optional[datetime] = None

    class Config:
        from_attributes = True


class ConfiguracionUpdate(BaseModel):
    clave: str
    valor: str
    descripcion: Optional[str] = None

"""
Schemas para el dominio Pedidos.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, conint


class DetallePedidoCreate(BaseModel):
    producto_id: int
    cantidad: conint(ge=1)  # type: ignore
    ingredientes_excluidos: Optional[list[int]] = Field(default_factory=list)


class PedidoCreate(BaseModel):
    direccion_id: int
    notas: Optional[str] = None
    items: list[DetallePedidoCreate] = Field(min_items=1)


class DetallePedidoResponse(BaseModel):
    id: int
    producto_id: int
    nombre_snapshot: str
    precio_snapshot: float
    cantidad: int
    subtotal: float
    personalizacion: Optional[list[int]] = None

    class Config:
        from_attributes = True


class PedidoResponse(BaseModel):
    id: int
    usuario_id: int
    estado_codigo: str
    direccion_id: Optional[int]
    total: float
    costo_envio: float
    notas: Optional[str]
    creado_en: datetime
    actualizado_en: datetime
    detalles: list[DetallePedidoResponse] = []

    class Config:
        from_attributes = True


class HistorialEstadoPedidoResponse(BaseModel):
    id: int
    pedido_id: int
    estado_desde: Optional[str]
    estado_hasta: str
    usuario_id: Optional[int]
    motivo: Optional[str]
    creado_en: datetime

    class Config:
        from_attributes = True


class PedidoStatusUpdate(BaseModel):
    nuevo_estado: str
    motivo: Optional[str] = None

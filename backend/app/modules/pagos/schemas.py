"""
Schemas Pydantic para el módulo de Pagos.
"""

from pydantic import BaseModel


class PagoCreate(BaseModel):
    pedido_id: int
    monto: float


class PagoResponse(BaseModel):
    id: int
    pedido_id: int
    monto: float
    mp_payment_id: int | None
    mp_status: str
    external_reference: str
    preference_id: str | None = None  # devuelto solo al crear
    init_point: str | None = None     # devuelto solo al crear

    class Config:
        from_attributes = True


class WebhookPayload(BaseModel):
    """Payload básico del webhook IPN de MercadoPago."""
    id: int | None = None
    topic: str | None = None
    type: str | None = None
    data: dict | None = None


class PagoEstadoResponse(BaseModel):
    pedido_id: int
    pago_id: int | None
    pago_estado: str | None
    mp_payment_id: int | None
    pedido_estado: str

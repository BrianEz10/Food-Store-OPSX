"""Repositorio de Pago con métodos de dominio."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.base_repository import BaseRepository
from app.modules.pagos.model import Pago


class PagoRepository(BaseRepository[Pago]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Pago)

    async def get_by_pedido_id(self, pedido_id: int) -> Pago | None:
        """Retorna el pago más reciente de un pedido."""
        result = await self.session.execute(
            select(Pago)
            .where(Pago.pedido_id == pedido_id)
            .order_by(Pago.creado_en.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def get_by_mp_payment_id(self, mp_payment_id: int) -> Pago | None:
        """Busca un pago por el ID de MercadoPago (idempotencia)."""
        result = await self.session.execute(
            select(Pago).where(Pago.mp_payment_id == mp_payment_id)
        )
        return result.scalar_one_or_none()

    async def update_estado(
        self,
        pago: Pago,
        mp_status: str,
        mp_payment_id: int | None = None,
    ) -> Pago:
        """Actualiza el estado del pago."""
        pago.mp_status = mp_status
        if mp_payment_id is not None:
            pago.mp_payment_id = mp_payment_id
        self.session.add(pago)
        await self.session.flush()
        return pago

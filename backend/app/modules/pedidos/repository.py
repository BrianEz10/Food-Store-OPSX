"""Repositorio de Pedido."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.base_repository import BaseRepository
from app.modules.pedidos.model import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Pedido)

    async def get_by_id_with_lock(self, id: int) -> Pedido | None:
        """Obtiene un pedido bloqueándolo para actualización."""
        stmt = select(Pedido).where(Pedido.id == id).with_for_update()
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

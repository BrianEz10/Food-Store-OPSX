"""Repositorio de Pedido."""

from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

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

    async def get_by_user_id(
        self,
        usuario_id: int,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None,
    ) -> tuple[list[Pedido], int]:
        """Retorna pedidos de un usuario con paginación y filtro opcional por estado."""
        base = select(Pedido).where(Pedido.usuario_id == usuario_id)
        if estado:
            base = base.where(Pedido.estado_codigo == estado)

        count_stmt = select(func.count()).select_from(base.subquery())
        total = (await self.session.execute(count_stmt)).scalar_one()

        stmt = base.order_by(Pedido.creado_en.desc()).offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all()), total

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None,
        usuario_id: int | None = None,
    ) -> tuple[list[Pedido], int]:
        """Retorna todos los pedidos con paginación y filtros opcionales."""
        base = select(Pedido)
        if estado:
            base = base.where(Pedido.estado_codigo == estado)
        if usuario_id is not None:
            base = base.where(Pedido.usuario_id == usuario_id)

        count_stmt = select(func.count()).select_from(base.subquery())
        total = (await self.session.execute(count_stmt)).scalar_one()

        stmt = base.order_by(Pedido.creado_en.desc()).offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all()), total

    async def get_detail_by_id(self, id: int) -> Optional[Pedido]:
        """Retorna un pedido con detalles e historial eager-loaded."""
        stmt = (
            select(Pedido)
            .options(joinedload(Pedido.detalles), joinedload(Pedido.historial_estados))
            .where(Pedido.id == id)
        )
        result = await self.session.execute(stmt)
        return result.unique().scalar_one_or_none()

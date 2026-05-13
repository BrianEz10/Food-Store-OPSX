"""Repositorio de DireccionEntrega."""

from typing import Optional

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.base_repository import BaseRepository
from app.modules.direcciones.model import DireccionEntrega
from app.modules.direcciones.schemas import DireccionCreate, DireccionUpdate


class DireccionRepository(BaseRepository[DireccionEntrega]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, DireccionEntrega)

    async def list_by_user(self, usuario_id: int) -> list[DireccionEntrega]:
        """Lista todas las direcciones activas de un usuario."""
        stmt = self._base_query().where(DireccionEntrega.usuario_id == usuario_id).order_by(DireccionEntrega.creado_en)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, entity_id: int) -> Optional[DireccionEntrega]:
        """Obtiene una dirección activa por ID."""
        return await super().get_by_id(entity_id)

    async def create_for_user(self, usuario_id: int, data: DireccionCreate) -> DireccionEntrega:
        """Crea una nueva dirección para el usuario."""
        direccion = DireccionEntrega(
            usuario_id=usuario_id,
            **data.model_dump()
        )
        return await self.create(direccion)

    async def update_direccion(self, entity_id: int, data: DireccionUpdate) -> Optional[DireccionEntrega]:
        """Actualiza parcialmente una dirección."""
        direccion = await self.get_by_id(entity_id)
        if not direccion:
            return None
            
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(direccion, key, value)
            
        return await self.update(direccion)

    async def delete_direccion(self, entity_id: int) -> bool:
        """Soft delete de la dirección."""
        direccion = await self.get_by_id(entity_id)
        if not direccion:
            return False
            
        await self.soft_delete(direccion)
        return True

    async def unset_all_default(self, usuario_id: int) -> None:
        """Quita el flag de principal a todas las direcciones de un usuario."""
        stmt = (
            update(DireccionEntrega)
            .where(
                DireccionEntrega.usuario_id == usuario_id,
                DireccionEntrega.es_principal == True
            )
            .values(es_principal=False)
        )
        await self.session.execute(stmt)
        await self.session.flush()

    async def set_default(self, entity_id: int) -> None:
        """Marca una dirección como principal."""
        stmt = (
            update(DireccionEntrega)
            .where(DireccionEntrega.id == entity_id)
            .values(es_principal=True)
        )
        await self.session.execute(stmt)
        await self.session.flush()

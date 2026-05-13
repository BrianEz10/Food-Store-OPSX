"""
Repositorio de Ingrediente.
"""

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.base_repository import BaseRepository
from app.modules.ingredientes.model import Ingrediente


class IngredienteRepository(BaseRepository[Ingrediente]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Ingrediente)

    async def get_all_active(self) -> list[Ingrediente]:
        """Obtiene todos los ingredientes activos."""
        stmt = self._base_query().where(Ingrediente.eliminado_en.is_(None))
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_alergenos(self) -> list[Ingrediente]:
        """Obtiene solo los ingredientes que son alérgenos."""
        stmt = (
            self._base_query()
            .where(Ingrediente.eliminado_en.is_(None))
            .where(Ingrediente.es_alergeno == True)  # noqa: E712
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
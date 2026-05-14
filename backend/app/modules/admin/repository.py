"""
Repositorio de configuración del sistema.
"""

from typing import Optional

from sqlalchemy import select, update as sql_update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.base_repository import BaseRepository
from app.modules.admin.models import Configuracion


class ConfiguracionRepository(BaseRepository[Configuracion]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Configuracion)

    async def get_all_as_dict(self) -> list[dict]:
        """Retorna todas las configuraciones como lista de dicts."""
        configs = await self.list_all()
        return [
            {
                "clave": c.clave,
                "valor": c.valor,
                "descripcion": c.descripcion,
                "actualizado_en": c.actualizado_en,
            }
            for c in configs
        ]

    async def upsert(self, clave: str, valor: str, descripcion: Optional[str] = None) -> Configuracion:
        """Crea o actualiza una configuración (upsert)."""
        existing = await self.get_by_id(clave)
        if existing:
            existing.valor = valor
            if descripcion is not None:
                existing.descripcion = descripcion
            return await self.update(existing)
        config = Configuracion(clave=clave, valor=valor, descripcion=descripcion)
        return await self.create(config)

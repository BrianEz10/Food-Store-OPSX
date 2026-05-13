"""
Servicio de Ingredientes con lógica de negocio.
"""

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError
from app.modules.ingredientes.model import Ingrediente
from app.modules.ingredientes.repository import IngredienteRepository
from app.modules.ingredientes.schemas import (
    IngredienteCreate,
    IngredienteUpdate,
)


class IngredienteService:
    """Servicio para operaciones de ingrediente."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = IngredienteRepository(session)

    async def list_all(self) -> tuple[list[Ingrediente], int]:
        """Lista todos los ingredientes activos."""
        ingredientes = await self.repo.get_all_active()

        stmt_count = select(Ingrediente).where(Ingrediente.eliminado_en.is_(None))
        result = await self.session.execute(stmt_count)
        total = len(result.scalars().all())

        return ingredientes, total

    async def list_alergenos(self) -> list[Ingrediente]:
        """Lista solo los alérgenos."""
        return await self.repo.get_alergenos()

    async def get_by_id(self, ingrediente_id: int) -> Optional[Ingrediente]:
        """Obtiene un ingrediente por ID."""
        return await self.repo.get_by_id(ingrediente_id)

    async def create(self, data: IngredienteCreate) -> Ingrediente:
        """Crea un nuevo ingrediente."""
        ingrediente = Ingrediente(
            nombre=data.nombre,
            descripcion=data.descripcion,
            es_alergeno=data.es_alergeno,
        )
        self.session.add(ingrediente)
        await self.session.commit()
        await self.session.refresh(ingrediente)
        return ingrediente

    async def update(
        self, ingrediente_id: int, data: IngredienteUpdate
    ) -> Ingrediente:
        """Actualiza un ingrediente."""
        ingrediente = await self.repo.get_by_id(ingrediente_id)
        if not ingrediente or ingrediente.eliminado_en is not None:
            raise NotFoundError("Ingrediente no encontrado")

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(ingrediente, field, value)

        ingrediente.actualizado_en = datetime.now(timezone.utc)
        await self.session.commit()
        await self.session.refresh(ingrediente)
        return ingrediente

    async def delete(self, ingrediente_id: int) -> Ingrediente:
        """Elimina (soft delete) un ingrediente."""
        ingrediente = await self.repo.get_by_id(ingrediente_id)
        if not ingrediente or ingrediente.eliminado_en is not None:
            raise NotFoundError("Ingrediente no encontrado")

        # Verificar si hay productos asociados
        from app.modules.productos.model import ProductoIngrediente

        stmt_productos = (
            select(ProductoIngrediente)
            .join(Ingrediente, Ingrediente.id == ProductoIngrediente.ingrediente_id)
            .where(
                Ingrediente.id == ingrediente_id,
                Ingrediente.eliminado_en.is_(None),
            )
        )
        result = await self.session.execute(stmt_productos)
        productos_asociados = result.scalars().all()

        if productos_asociados:
            raise ConflictError(
                "No se puede eliminar el ingrediente porque hay productos asociados. "
                "Desasocia los productos primero."
            )

        # Soft delete
        ingrediente.eliminado_en = datetime.now(timezone.utc)
        await self.session.commit()
        await self.session.refresh(ingrediente)
        return ingrediente
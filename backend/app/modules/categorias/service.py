"""
Servicio de Categorías con lógica de negocio.
"""

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import ConflictError, NotFoundError
from app.modules.categorias.model import Categoria
from app.modules.categorias.schemas import (
    CategoriaCreate,
    CategoriaUpdate,
)


class CategoriaService:
    """Servicio para operaciones de categoría."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_all(self) -> tuple[list[Categoria], int]:
        """
        Lista todas las categorías activas (no eliminadas).
        Retorna tuple (lista, total).
        """
        stmt = (
            select(Categoria)
            .where(Categoria.eliminado_en.is_(None))
            .order_by(Categoria.orden, Categoria.nombre)
        )
        result = await self.session.execute(stmt)
        categorias = result.scalars().all()

        stmt_count = select(Categoria).where(Categoria.eliminado_en.is_(None))
        count_result = await self.session.execute(stmt_count)
        total = len(count_result.scalars().all())

        return list(categorias), total

    async def get_by_id(self, categoria_id: int) -> Optional[Categoria]:
        """Obtiene una categoría por ID."""
        stmt = select(Categoria).where(
            Categoria.id == categoria_id,
            Categoria.eliminado_en.is_(None),
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_tree(self) -> list[Categoria]:
        """
        Obtiene todas las categorías raíz (sin padre) con sus hijos recursivamente.
        """
        # Obtener todas las categorías activas
        stmt = (
            select(Categoria)
            .where(Categoria.eliminado_en.is_(None))
            .options(selectinload(Categoria.hijos).selectinload(Categoria.hijos))
        )
        result = await self.session.execute(stmt)
        todas = result.scalars().all()

        # Filtrar solo las raíz (padre_id = None)
        return [c for c in todas if c.padre_id is None]

    async def create(self, data: CategoriaCreate) -> Categoria:
        """
        Crea una nueva categoría.
        Valida que no haya ciclos si se especifica padre.
        """
        # Validar ciclo si tiene padre
        if data.padre_id:
            if await self._crearia_ciclo(data.padre_id, None):
                raise ConflictError(
                    "La categoría padre seleccionada crearía un ciclo en la jerarquía"
                )

            # Verificar que el padre existe y está activo
            padre = await self.get_by_id(data.padre_id)
            if not padre:
                raise NotFoundError("Categoría padre no encontrada")

        # Crear categoría
        categoria = Categoria(
            nombre=data.nombre,
            descripcion=data.descripcion,
            imagen_url=data.imagen_url,
            padre_id=data.padre_id,
            orden=data.orden,
        )
        self.session.add(categoria)
        await self.session.commit()
        await self.session.refresh(categoria)
        return categoria

    async def update(
        self, categoria_id: int, data: CategoriaUpdate
    ) -> Categoria:
        """
        Actualiza una categoría.
        Valida ciclos si se cambia el padre.
        """
        categoria = await self.get_by_id(categoria_id)
        if not categoria:
            raise NotFoundError("Categoría no encontrada")

        # Validar ciclo si se cambia el padre
        nuevo_padre_id = data.padre_id if data.padre_id is not None else categoria.padre_id

        # Solo validar si hay un cambio de padre o se está asignando uno
        if data.padre_id is not None and data.padre_id != categoria.padre_id:
            if await self._crearia_ciclo(data.padre_id, categoria_id):
                raise ConflictError(
                    "La categoría padre seleccionada crearía un ciclo en la jerarquía"
                )

            # Verificar que el padre existe y está activo
            padre = await self.get_by_id(data.padre_id)
            if not padre:
                raise NotFoundError("Categoría padre no encontrada")

        # Aplicar cambios
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(categoria, field, value)

        categoria.actualizado_en = datetime.now(timezone.utc)
        await self.session.commit()
        await self.session.refresh(categoria)
        return categoria

    async def delete(self, categoria_id: int) -> Categoria:
        """
        Elimina (soft delete) una categoría.
        Verifica que no haya productos asociados.
        """
        categoria = await self.get_by_id(categoria_id)
        if not categoria:
            raise NotFoundError("Categoría no encontrada")

        # Verificar si hay productos asociados (usando la tabla intermedia)
        from app.modules.productos.model import ProductoCategoria

        stmt_productos = (
            select(ProductoCategoria)
            .join(Categoria, Categoria.id == ProductoCategoria.categoria_id)
            .where(
                Categoria.id == categoria_id,
                Categoria.eliminado_en.is_(None),
            )
        )
        result = await self.session.execute(stmt_productos)
        productos_asociados = result.scalars().all()

        if productos_asociados:
            raise ConflictError(
                "No se puede eliminar la categoría porque hay productos asociados. "
                "Desasocia los productos primero."
            )

        # Soft delete
        categoria.eliminado_en = datetime.now(timezone.utc)
        await self.session.commit()
        await self.session.refresh(categoria)
        return categoria

    async def _crearia_ciclo(
        self, nuevo_padre_id: int, categoria_excluir_id: Optional[int] = None
    ) -> bool:
        """
        Verifica si asignar nuevo_padre_id como padre crearía un ciclo.
        Recorre ascendentes desde nuevo_padre_id buscando categoria_excluir_id.
        """
        # Query recursivo para encontrar todos los ancestros de nuevo_padre_id
        # Usando un loop en lugar de CTE directo para simplicidad
        actual_id = nuevo_padre_id
        visited = set()

        while actual_id:
            if actual_id == categoria_excluir_id:
                return True  # Se encontró ciclo

            if actual_id in visited:
                break  # Evitar loop infinito

            visited.add(actual_id)

            # Obtener el padre del nodo actual
            stmt = select(Categoria).where(Categoria.id == actual_id)
            result = await self.session.execute(stmt)
            categoria = result.scalar_one_or_none()

            if not categoria:
                break

            actual_id = categoria.padre_id

        return False
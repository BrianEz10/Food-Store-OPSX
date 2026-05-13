"""
Servicio de Productos con lógica de negocio.
Sigue el patrón establecido por los módulos categorías e ingredientes.
"""

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import ConflictError, NotFoundError
from app.modules.categorias.model import Categoria
from app.modules.ingredientes.model import Ingrediente
from app.modules.productos.model import Producto, ProductoCategoria, ProductoIngrediente
from app.modules.productos.repository import ProductoRepository
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoUpdate,
)


class ProductoService:
    """Servicio para operaciones de producto."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = ProductoRepository(session)

    # ── Operaciones de lectura ──────────────────────────────────────────

    async def list_all(
        self,
        skip: int = 0,
        limit: int = 100,
        categoria_id: Optional[int] = None,
        search: Optional[str] = None,
    ) -> tuple[list[Producto], int]:
        """
        Lista productos activos con filtros opcionales.

        Args:
            skip: Registros a saltar (paginación)
            limit: Máximo de registros a retornar
            categoria_id: Filtrar por categoría (opcional)
            search: Búsqueda por nombre ILIKE (opcional)

        Returns:
            tuple (lista de productos, total de registros)
        """
        if search:
            return await self.repo.search_by_name(search, skip, limit)
        if categoria_id is not None:
            return await self.repo.list_by_categoria(categoria_id, skip, limit)

        # Listado simple con paginación
        productos = await self.repo.list_all(skip, limit)
        total = await self.repo.count()
        return productos, total

    async def get_by_id(self, producto_id: int) -> Optional[Producto]:
        """
        Obtiene un producto por ID con todas sus relaciones cargadas
        (categorías e ingredientes).
        """
        return await self.repo.get_with_relations(producto_id)

    # ── Operaciones de escritura ─────────────────────────────────────────

    async def create(self, data: ProductoCreate) -> Producto:
        """
        Crea un nuevo producto con sus relaciones M2M.

        Valida que los IDs de categorías e ingredientes existan
        antes de crear las asociaciones.
        """
        # Validar categorías
        if data.categoria_ids:
            await self._validate_categorias(data.categoria_ids)

        # Validar ingredientes
        if data.ingredientes:
            await self._validate_ingredientes(
                [i.ingrediente_id for i in data.ingredientes]
            )

        # Crear producto
        producto = Producto(
            nombre=data.nombre,
            descripcion=data.descripcion,
            imagen_url=data.imagen_url,
            precio_base=data.precio_base,
            stock_cantidad=data.stock_cantidad,
            disponible=data.disponible,
        )
        self.session.add(producto)
        await self.session.flush()  # Obtener ID

        # Crear relaciones M2M
        if data.categoria_ids:
            for cat_id in data.categoria_ids:
                self.session.add(
                    ProductoCategoria(producto_id=producto.id, categoria_id=cat_id)
                )

        if data.ingredientes:
            for ing in data.ingredientes:
                self.session.add(
                    ProductoIngrediente(
                        producto_id=producto.id,
                        ingrediente_id=ing.ingrediente_id,
                        es_removible=ing.es_removible,
                    )
                )

        await self.session.commit()
        await self.session.refresh(producto)

        # Recargar con relaciones para el response
        return await self.repo.get_with_relations(producto.id)

    async def update(self, producto_id: int, data: ProductoUpdate) -> Producto:
        """
        Actualiza un producto existente con reemplazo completo de relaciones M2M.

        Si se envían categoria_ids o ingredientes, se reemplazan TODAS
        las relaciones existentes por las nuevas listas.
        Si no se envían, las relaciones existentes se mantienen intactas.
        """
        producto = await self.repo.get_by_id(producto_id)
        if not producto:
            raise NotFoundError("Producto no encontrado")

        # Aplicar cambios a campos escalares
        update_data = data.model_dump(exclude_unset=True, exclude={"categoria_ids", "ingredientes"})
        for field, value in update_data.items():
            setattr(producto, field, value)

        producto.actualizado_en = datetime.now(timezone.utc)

        # Reemplazo de relaciones M2M (solo si se enviaron)
        if data.categoria_ids is not None:
            await self._validate_categorias(data.categoria_ids)
            await self._replace_categorias(producto.id, data.categoria_ids)

        if data.ingredientes is not None:
            await self._validate_ingredientes(
                [i.ingrediente_id for i in data.ingredientes]
            )
            await self._replace_ingredientes(producto.id, data.ingredientes)

        await self.session.commit()
        await self.session.refresh(producto)

        return await self.repo.get_with_relations(producto.id)

    async def delete(self, producto_id: int) -> Producto:
        """
        Soft delete de un producto.
        Valida que no tenga pedidos activos asociados antes de eliminar.
        """
        producto = await self.repo.get_by_id(producto_id)
        if not producto:
            raise NotFoundError("Producto no encontrado")

        # Validar pedidos activos
        if await self.repo.has_active_orders(producto_id):
            raise ConflictError(
                "No se puede eliminar el producto porque tiene pedidos activos asociados"
            )

        # Soft delete
        producto.eliminado_en = datetime.now(timezone.utc)
        await self.session.commit()
        await self.session.refresh(producto)
        return producto

    # ── Métodos auxiliares ─────────────────────────────────────────────

    async def _validate_categorias(self, categoria_ids: list[int]) -> None:
        """Valida que todos los IDs de categoría existan y estén activos."""
        stmt = select(Categoria).where(
            Categoria.id.in_(categoria_ids),
            Categoria.eliminado_en.is_(None),
        )
        result = await self.session.execute(stmt)
        existentes = {c.id for c in result.scalars().all()}
        faltantes = set(categoria_ids) - existentes
        if faltantes:
            raise NotFoundError(
                f"Categorías no encontradas: {sorted(faltantes)}"
            )

    async def _validate_ingredientes(self, ingrediente_ids: list[int]) -> None:
        """Valida que todos los IDs de ingrediente existan y estén activos."""
        stmt = select(Ingrediente).where(
            Ingrediente.id.in_(ingrediente_ids),
            Ingrediente.eliminado_en.is_(None),
        )
        result = await self.session.execute(stmt)
        existentes = {i.id for i in result.scalars().all()}
        faltantes = set(ingrediente_ids) - existentes
        if faltantes:
            raise NotFoundError(
                f"Ingredientes no encontrados: {sorted(faltantes)}"
            )

    async def _replace_categorias(
        self, producto_id: int, categoria_ids: list[int]
    ) -> None:
        """Reemplaza todas las categorías de un producto."""
        # Eliminar relaciones existentes
        stmt_delete = select(ProductoCategoria).where(
            ProductoCategoria.producto_id == producto_id
        )
        result = await self.session.execute(stmt_delete)
        for pc in result.scalars().all():
            await self.session.delete(pc)

        # Insertar nuevas relaciones
        for cat_id in categoria_ids:
            self.session.add(
                ProductoCategoria(producto_id=producto_id, categoria_id=cat_id)
            )

    async def _replace_ingredientes(
        self,
        producto_id: int,
        ingredientes: list,
    ) -> None:
        """Reemplaza todos los ingredientes de un producto."""
        # Eliminar relaciones existentes
        stmt_delete = select(ProductoIngrediente).where(
            ProductoIngrediente.producto_id == producto_id
        )
        result = await self.session.execute(stmt_delete)
        for pi in result.scalars().all():
            await self.session.delete(pi)

        # Insertar nuevas relaciones
        for ing in ingredientes:
            self.session.add(
                ProductoIngrediente(
                    producto_id=producto_id,
                    ingrediente_id=ing.ingrediente_id,
                    es_removible=ing.es_removible,
                )
            )

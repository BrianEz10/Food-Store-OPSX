"""
Repositorios de Producto con métodos de dominio.
"""

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.base_repository import BaseRepository
from app.modules.pedidos.model import DetallePedido, EstadoPedido, Pedido
from app.modules.productos.model import Producto, ProductoCategoria, ProductoIngrediente


class ProductoRepository(BaseRepository[Producto]):
    """
    Repositorio de Producto con métodos de dominio.
    Hereda CRUD base de BaseRepository.
    """

    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Producto)

    async def search_by_name(
        self,
        search: str,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Producto], int]:
        """
        Busca productos activos por nombre usando ILIKE (case-insensitive).
        Retorna tuple (lista, total).
        """
        stmt = (
            self._base_query()
            .where(Producto.nombre.ilike(f"%{search}%"))
            .order_by(Producto.nombre)
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        productos = list(result.scalars().all())

        # Conteo total para paginación
        count_stmt = (
            select(func.count())
            .select_from(Producto)
            .where(Producto.eliminado_en.is_(None))
            .where(Producto.nombre.ilike(f"%{search}%"))
        )
        count_result = await self.session.execute(count_stmt)
        total = count_result.scalar_one()

        return productos, total

    async def list_by_categoria(
        self,
        categoria_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Producto], int]:
        """
        Lista productos activos filtrados por categoría.
        Retorna tuple (lista, total).
        """
        stmt = (
            self._base_query()
            .join(ProductoCategoria, Producto.id == ProductoCategoria.producto_id)
            .where(ProductoCategoria.categoria_id == categoria_id)
            .where(Producto.eliminado_en.is_(None))
            .order_by(Producto.nombre)
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        productos = list(result.scalars().all())

        # Conteo total
        count_stmt = (
            select(func.count())
            .select_from(Producto)
            .join(ProductoCategoria, Producto.id == ProductoCategoria.producto_id)
            .where(ProductoCategoria.categoria_id == categoria_id)
            .where(Producto.eliminado_en.is_(None))
        )
        count_result = await self.session.execute(count_stmt)
        total = count_result.scalar_one()

        return productos, total

    async def has_active_orders(self, producto_id: int) -> bool:
        """
        Verifica si un producto tiene pedidos activos asociados.
        Un pedido activo es aquel con estado NO terminal
        (diferente de ENTREGADO y CANCELADO).

        Returns:
            True si el producto tiene al menos un pedido activo.
        """
        stmt = (
            select(DetallePedido.id)
            .join(Pedido, Pedido.id == DetallePedido.pedido_id)
            .join(EstadoPedido, EstadoPedido.codigo == Pedido.estado_codigo)
            .where(DetallePedido.producto_id == producto_id)
            .where(EstadoPedido.es_terminal == False)  # noqa: E712
            .limit(1)
        )
        result = await self.session.execute(stmt)
        return result.first() is not None

    async def get_with_relations(self, producto_id: int) -> Producto | None:
        """
        Obtiene un producto con sus relaciones (categorías e ingredientes) cargadas.
        """
        stmt = (
            self._base_query()
            .where(Producto.id == producto_id)
            .options(
                selectinload(Producto.producto_categorias).selectinload(
                    ProductoCategoria.categoria
                ),
                selectinload(Producto.producto_ingredientes).selectinload(
                    ProductoIngrediente.ingrediente
                ),
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_many_with_lock(self, ids: list[int]) -> list[Producto]:
        """
        Obtiene múltiples productos bloqueándolos para actualización (SELECT FOR UPDATE).
        Ordena por ID para prevenir deadlocks.
        """
        if not ids:
            return []

        # Ordenar ids para evitar deadlocks
        sorted_ids = sorted(list(set(ids)))

        stmt = (
            self._base_query()
            .where(Producto.id.in_(sorted_ids))
            .order_by(Producto.id)
            .with_for_update()
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
    async def get_by_id_with_lock(self, id: int) -> Producto | None:
        """Obtiene un producto bloqueándolo para actualización."""
        stmt = self._base_query().where(Producto.id == id).with_for_update()
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

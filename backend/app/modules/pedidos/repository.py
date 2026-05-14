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

    async def get_resumen_kpis(self) -> dict:
        """Calcula KPIs generales del dashboard."""
        from sqlalchemy import func, select
        from app.modules.usuarios.model import Usuario
        from app.modules.productos.model import Producto

        # Ventas totales (excluyendo cancelados)
        ventas = await self.session.execute(
            select(func.coalesce(func.sum(Pedido.total), 0))
            .where(Pedido.estado_codigo != "CANCELADO", Pedido.eliminado_en.is_(None))
        )
        ventas_totales = float(ventas.scalar_one())

        # Cantidad de pedidos (no eliminados)
        count_pedidos = await self.session.execute(
            select(func.count(Pedido.id)).where(Pedido.eliminado_en.is_(None))
        )
        cantidad_pedidos = count_pedidos.scalar_one()

        # Usuarios activos
        count_usuarios = await self.session.execute(
            select(func.count(Usuario.id)).where(Usuario.eliminado_en.is_(None))
        )
        usuarios_registrados = count_usuarios.scalar_one()

        # Ticket promedio
        ticket_promedio = round(ventas_totales / cantidad_pedidos, 2) if cantidad_pedidos > 0 else 0

        # Pedidos de hoy
        from datetime import date
        hoy = date.today()
        pedidos_hoy = await self.session.execute(
            select(func.count(Pedido.id))
            .where(
                func.date(Pedido.creado_en) == hoy,
                Pedido.eliminado_en.is_(None),
            )
        )
        cantidad_hoy = pedidos_hoy.scalar_one()

        # Productos disponibles
        count_productos = await self.session.execute(
            select(func.count(Producto.id)).where(
                Producto.disponible.is_(True),
                Producto.eliminado_en.is_(None),
            )
        )
        productos_disponibles = count_productos.scalar_one()

        return {
            "ventas_totales": ventas_totales,
            "cantidad_pedidos": cantidad_pedidos,
            "usuarios_registrados": usuarios_registrados,
            "ticket_promedio": ticket_promedio,
            "pedidos_hoy": cantidad_hoy,
            "productos_disponibles": productos_disponibles,
        }

    async def get_ventas_por_mes(self) -> list[dict]:
        """Ventas agrupadas por mes (últimos 12 meses)."""
        from sqlalchemy import func, select

        stmt = (
            select(
                func.date_trunc("month", Pedido.creado_en).label("mes"),
                func.coalesce(func.sum(Pedido.total), 0).label("ventas"),
                func.count(Pedido.id).label("cantidad_pedidos"),
            )
            .where(
                Pedido.estado_codigo != "CANCELADO",
                Pedido.eliminado_en.is_(None),
                Pedido.creado_en >= func.now() - func.make_interval(months=12),
            )
            .group_by(func.date_trunc("month", Pedido.creado_en))
            .order_by(func.date_trunc("month", Pedido.creado_en))
        )
        result = await self.session.execute(stmt)
        rows = result.all()
        return [
            {
                "mes": str(row.mes)[:7],  # YYYY-MM
                "ventas": float(row.ventas),
                "cantidad_pedidos": row.cantidad_pedidos,
            }
            for row in rows
        ]

    async def get_top_productos(self, limit: int = 10) -> list[dict]:
        """Ranking de productos más vendidos."""
        from sqlalchemy import func, select
        from app.modules.pedidos.model import DetallePedido
        from app.modules.productos.model import Producto

        stmt = (
            select(
                Producto.nombre,
                func.coalesce(func.sum(DetallePedido.cantidad), 0).label("cantidad_vendida"),
                func.coalesce(func.sum(DetallePedido.subtotal), 0).label("ingresos_totales"),
            )
            .join(DetallePedido, DetallePedido.producto_id == Producto.id)
            .join(Pedido, Pedido.id == DetallePedido.pedido_id)
            .where(
                Pedido.estado_codigo != "CANCELADO",
                Pedido.eliminado_en.is_(None),
                Producto.eliminado_en.is_(None),
            )
            .group_by(Producto.id, Producto.nombre)
            .order_by(func.sum(DetallePedido.cantidad).desc())
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        rows = result.all()
        return [
            {
                "nombre": row.nombre,
                "cantidad_vendida": int(row.cantidad_vendida),
                "ingresos_totales": float(row.ingresos_totales),
            }
            for row in rows
        ]

    async def get_pedidos_por_estado(self) -> list[dict]:
        """Distribución de pedidos por estado."""
        from sqlalchemy import func, select

        stmt = (
            select(
                Pedido.estado_codigo.label("estado"),
                func.count(Pedido.id).label("cantidad"),
            )
            .where(Pedido.eliminado_en.is_(None))
            .group_by(Pedido.estado_codigo)
            .order_by(Pedido.estado_codigo)
        )
        result = await self.session.execute(stmt)
        rows = result.all()
        return [
            {
                "estado": row.estado,
                "cantidad": row.cantidad,
            }
            for row in rows
        ]

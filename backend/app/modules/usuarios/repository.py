"""Repositorio de Usuario."""

from typing import Optional

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.base_repository import BaseRepository
from app.modules.usuarios.model import Usuario, UsuarioRol


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Usuario)

    async def get_by_id(self, entity_id: int) -> Optional[Usuario]:
        """
        Obtiene un usuario por su ID, cargando eager sus roles.
        """
        stmt = (
            self._base_query()
            .where(self.model.id == entity_id)
            .options(selectinload(Usuario.usuario_roles))
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def update_perfil(self, usuario_id: int, nombre: str | None, apellido: str | None) -> Optional[Usuario]:
        """
        Actualiza el perfil del usuario.
        """
        usuario = await self.get_by_id(usuario_id)
        if not usuario:
            return None
        
        if nombre is not None:
            usuario.nombre = nombre
        if apellido is not None:
            usuario.apellido = apellido
            
        return await self.update(usuario)

    async def update_password(self, usuario_id: int, new_password_hash: str) -> Optional[Usuario]:
        """
        Actualiza la contraseña del usuario.
        """
        usuario = await self.get_by_id(usuario_id)
        if not usuario:
            return None
            
        usuario.password_hash = new_password_hash
        return await self.update(usuario)

    async def list_all_admin(
        self,
        skip: int = 0,
        limit: int = 20,
        q: str | None = None,
        rol: str | None = None,
        incluir_eliminados: bool = False,
    ) -> tuple[list[Usuario], int]:
        """Lista usuarios con filtros admin: búsqueda, rol, incluir eliminados."""
        stmt = (
            select(Usuario)
            .options(selectinload(Usuario.usuario_roles))
        )

        if not incluir_eliminados:
            stmt = stmt.where(Usuario.eliminado_en.is_(None))

        if q:
            like_pattern = f"%{q}%"
            stmt = stmt.where(
                or_(
                    Usuario.nombre.ilike(like_pattern),
                    Usuario.apellido.ilike(like_pattern),
                    Usuario.email.ilike(like_pattern),
                )
            )

        if rol:
            stmt = stmt.where(
                Usuario.id.in_(
                    select(UsuarioRol.usuario_id).where(UsuarioRol.rol_codigo == rol)
                )
            )

        stmt = stmt.order_by(Usuario.creado_en.desc())

        stmt = stmt.offset(skip).limit(limit)

        result = await self.session.execute(stmt)
        usuarios = list(result.unique().scalars().all())

        total = await self._count_admin(q=q, rol=rol, incluir_eliminados=incluir_eliminados)

        return usuarios, total

    async def _count_admin(
        self,
        q: str | None = None,
        rol: str | None = None,
        incluir_eliminados: bool = False,
    ) -> int:
        """Count usuarios con los mismos filtros que list_all_admin."""
        stmt = select(func.count(Usuario.id)).select_from(Usuario)

        if not incluir_eliminados:
            stmt = stmt.where(Usuario.eliminado_en.is_(None))

        if q:
            like_pattern = f"%{q}%"
            stmt = stmt.where(
                or_(
                    Usuario.nombre.ilike(like_pattern),
                    Usuario.apellido.ilike(like_pattern),
                    Usuario.email.ilike(like_pattern),
                )
            )

        if rol:
            stmt = stmt.where(
                Usuario.id.in_(
                    select(UsuarioRol.usuario_id).where(UsuarioRol.rol_codigo == rol)
                )
            )

        result = await self.session.execute(stmt)
        return result.scalar_one()

    async def count_by_role(self, rol_codigo: str) -> int:
        """Cuenta cuántos usuarios tienen un rol específico."""
        stmt = (
            select(func.count())
            .select_from(UsuarioRol)
            .where(
                UsuarioRol.rol_codigo == rol_codigo,
                UsuarioRol.usuario_id.in_(
                    select(Usuario.id).where(Usuario.eliminado_en.is_(None))
                ),
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar_one()

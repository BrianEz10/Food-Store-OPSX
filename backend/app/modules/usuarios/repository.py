"""Repositorio de Usuario."""

from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.base_repository import BaseRepository
from app.modules.usuarios.model import Usuario


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

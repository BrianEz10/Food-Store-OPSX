from datetime import datetime, timezone
import hashlib

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.refreshtokens.model import RefreshToken
from app.modules.usuarios.model import Rol, Usuario, UsuarioRol


async def get_user_by_email(db: AsyncSession, email: str) -> Usuario | None:
    """Busca usuario activo por email."""
    stmt = select(Usuario).where(
        Usuario.email == email, Usuario.eliminado_en.is_(None)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_user_with_roles(db: AsyncSession, user_id: int) -> Usuario | None:
    """Obtiene un usuario con sus roles cargados."""
    stmt = (
        select(Usuario)
        .options(selectinload(Usuario.usuario_roles).selectinload(UsuarioRol.rol))
        .where(Usuario.id == user_id, Usuario.eliminado_en.is_(None))
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def create_user(
    db: AsyncSession,
    email: str,
    password_hash: str,
    nombre: str,
    apellido: str,
    telefono: str | None = None,
) -> Usuario:
    """Crea un nuevo usuario."""
    user = Usuario(
        email=email,
        password_hash=password_hash,
        nombre=nombre,
        apellido=apellido,
        telefono=telefono,
    )
    db.add(user)
    
    # Asignar rol por defecto CLIENT (requiere que el rol ya exista en BD)
    # Por las dudas, lo añadimos como UsuarioRol
    # Hacemos flush para obtener el ID de usuario
    await db.flush()
    
    usuario_rol = UsuarioRol(usuario_id=user.id, rol_codigo="CLIENT")
    db.add(usuario_rol)
    
    await db.commit()
    await db.refresh(user)
    return user


async def create_refresh_token(
    db: AsyncSession, usuario_id: int, token_hash: str, expires_at: datetime
) -> RefreshToken:
    """Crea un nuevo refresh token vinculado al usuario."""
    rt = RefreshToken(
        token_hash=token_hash,
        usuario_id=usuario_id,
        expires_at=expires_at,
    )
    db.add(rt)
    await db.commit()
    await db.refresh(rt)
    return rt


async def get_refresh_token(db: AsyncSession, token_hash: str) -> RefreshToken | None:
    """Obtiene un refresh token por su hash (y usa FOR UPDATE para seguridad concurrente)."""
    stmt = select(RefreshToken).where(RefreshToken.token_hash == token_hash).with_for_update()
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def mark_refresh_token_used(db: AsyncSession, token_hash: str) -> None:
    """Marca un token de refresco como usado (revocado)."""
    stmt = (
        update(RefreshToken)
        .where(RefreshToken.token_hash == token_hash)
        .values(revoked_at=datetime.now(timezone.utc))
    )
    await db.execute(stmt)
    await db.commit()


async def revoke_all_user_tokens(db: AsyncSession, usuario_id: int) -> None:
    """Revoca todos los refresh tokens activos de un usuario."""
    stmt = (
        update(RefreshToken)
        .where(
            RefreshToken.usuario_id == usuario_id,
            RefreshToken.revoked_at.is_(None),
        )
        .values(revoked_at=func.now())
    )
    await db.execute(stmt)
    await db.flush()

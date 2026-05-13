import hashlib
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.modules.auth import repository
from app.modules.auth.schemas import (
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)
from app.modules.usuarios.model import Usuario

settings = get_settings()


def _hash_refresh_token(token: str) -> str:
    """Hashea el refresh token con SHA-256 para guardarlo de forma segura."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


async def register(db: AsyncSession, data: UserRegisterRequest) -> UserResponse:
    """Registra un usuario y retorna su perfil básico."""
    existing_user = await repository.get_user_by_email(db, data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email ya registrado",
        )

    pwd_hash = hash_password(data.password)
    user = await repository.create_user(
        db=db,
        email=data.email,
        password_hash=pwd_hash,
        nombre=data.nombre,
        apellido=data.apellido,
    )

    return UserResponse(
        id=user.id,
        email=user.email,
        nombre=user.nombre,
        apellido=user.apellido,
        roles=["CLIENT"],  # Lo acabamos de asignar por defecto
    )


async def authenticate(db: AsyncSession, data: UserLoginRequest) -> Usuario:
    """Verifica credenciales de usuario."""
    user = await repository.get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )

    return user


async def create_tokens(db: AsyncSession, user_id: int) -> dict:
    """Crea y persiste los tokens de acceso y refresco."""
    # 1. Crear access token (JWT)
    access_token = create_access_token(data={"sub": str(user_id)})

    # 2. Crear refresh token string (UUID o random)
    refresh_token_str = str(uuid4())

    # 3. Guardar el refresh token hasheado
    expires_at = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    token_hash = _hash_refresh_token(refresh_token_str)
    
    await repository.create_refresh_token(
        db=db,
        usuario_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at,
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token_str,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


async def refresh_access_token(db: AsyncSession, refresh_token: str) -> dict:
    """Verifica el refresh token, lo revoca y crea uno nuevo."""
    token_hash = _hash_refresh_token(refresh_token)
    rt_record = await repository.get_refresh_token(db, token_hash)

    if not rt_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido",
        )

    if rt_record.revoked_at is not None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token ya fue utilizado o revocado",
        )

    if rt_record.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expirado",
        )

    # Marcar como usado (rotación)
    await repository.mark_refresh_token_used(db, token_hash)

    # Emitir nuevos tokens
    return await create_tokens(db, rt_record.usuario_id)


async def logout(db: AsyncSession, refresh_token: str) -> None:
    """Cierra la sesión revocando el refresh token provisto."""
    token_hash = _hash_refresh_token(refresh_token)
    rt_record = await repository.get_refresh_token(db, token_hash)
    
    if rt_record and rt_record.revoked_at is None:
        await repository.mark_refresh_token_used(db, token_hash)


async def get_user_roles(db: AsyncSession, user_id: int) -> list[str]:
    """Obtiene los códigos de rol del usuario."""
    user = await repository.get_user_with_roles(db, user_id)
    if not user:
        return []
    return [ur.rol_codigo for ur in user.usuario_roles]

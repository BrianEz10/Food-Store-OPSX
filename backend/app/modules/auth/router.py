from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.core.rate_limit import limiter
from app.modules.auth import service
from app.modules.auth.schemas import (
    MessageResponse,
    TokenRefreshRequest,
    TokenResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)
from app.modules.usuarios.model import Usuario

router = APIRouter(tags=["auth"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar un nuevo usuario",
)
async def register(
    data: UserRegisterRequest,
    db: AsyncSession = Depends(get_session),
) -> UserResponse:
    """Registra un nuevo usuario en el sistema con el rol CLIENT por defecto."""
    return await service.register(db, data)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Iniciar sesión",
)
@limiter.limit("5/15minute")
async def login(
    request: Request,
    data: UserLoginRequest,
    db: AsyncSession = Depends(get_session),
) -> TokenResponse:
    """Verifica credenciales y retorna access y refresh tokens. Limite de 5 intentos por 15 min."""
    user = await service.authenticate(db, data)
    tokens = await service.create_tokens(db, user.id)
    return TokenResponse(**tokens)


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refrescar access token",
)
async def refresh(
    data: TokenRefreshRequest,
    db: AsyncSession = Depends(get_session),
) -> TokenResponse:
    """Intercambia un refresh token válido por nuevos tokens (rotación)."""
    tokens = await service.refresh_access_token(db, data.refresh_token)
    return TokenResponse(**tokens)


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Cerrar sesión",
)
async def logout(
    data: TokenRefreshRequest,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> MessageResponse:
    """Invalida el refresh token provisto. Requiere auth."""
    await service.logout(db, data.refresh_token)
    return MessageResponse(detail="Sesión cerrada exitosamente")

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.modules.usuarios import service
from app.modules.usuarios.model import Usuario
from app.modules.usuarios.schemas import (
    CambioPasswordRequest,
    PerfilResponse,
    PerfilUpdate,
)

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


@router.get(
    "/me",
    response_model=PerfilResponse,
    summary="Ver perfil del usuario",
)
async def get_my_profile(
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> PerfilResponse:
    """Retorna el perfil del usuario autenticado."""
    return await service.get_perfil(db, current_user.id)  # type: ignore


@router.patch(
    "/me",
    response_model=PerfilResponse,
    summary="Editar perfil del usuario",
)
async def update_my_profile(
    data: PerfilUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> PerfilResponse:
    """Actualiza los datos permitidos del perfil del usuario autenticado."""
    return await service.update_perfil(db, current_user.id, data)  # type: ignore


@router.patch(
    "/me/password",
    status_code=status.HTTP_200_OK,
    summary="Cambiar contraseña",
)
async def change_password(
    data: CambioPasswordRequest,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> dict:
    """Cambia la contraseña del usuario previa verificación de la actual."""
    await service.cambiar_password(
        db, 
        current_user.id,  # type: ignore
        data.current_password, 
        data.new_password
    )
    return {"detail": "Contraseña actualizada exitosamente"}

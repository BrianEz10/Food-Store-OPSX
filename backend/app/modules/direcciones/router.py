from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.modules.direcciones import service
from app.modules.direcciones.schemas import (
    DireccionCreate,
    DireccionResponse,
    DireccionUpdate,
)
from app.modules.usuarios.model import Usuario

router = APIRouter(prefix="/direcciones", tags=["direcciones"])


@router.get(
    "",
    response_model=list[DireccionResponse],
    summary="Listar direcciones",
)
async def list_direcciones(
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> list[DireccionResponse]:
    """Retorna la lista de direcciones del usuario autenticado."""
    return await service.list_direcciones(db, current_user.id)  # type: ignore


@router.post(
    "",
    response_model=DireccionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear dirección",
)
async def create_direccion(
    data: DireccionCreate,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> DireccionResponse:
    """Crea una nueva dirección para el usuario autenticado."""
    return await service.create_direccion(db, current_user.id, data)  # type: ignore


@router.get(
    "/{id}",
    response_model=DireccionResponse,
    summary="Obtener dirección",
)
async def get_direccion(
    id: int,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> DireccionResponse:
    """Obtiene una dirección por su ID, verificando que pertenezca al usuario."""
    return await service.get_direccion(db, current_user.id, id)  # type: ignore


@router.patch(
    "/{id}",
    response_model=DireccionResponse,
    summary="Editar dirección",
)
async def update_direccion(
    id: int,
    data: DireccionUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> DireccionResponse:
    """Actualiza una dirección existente."""
    return await service.update_direccion(db, current_user.id, id, data)  # type: ignore


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar dirección",
)
async def delete_direccion(
    id: int,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> None:
    """Realiza un borrado lógico de la dirección."""
    await service.delete_direccion(db, current_user.id, id)  # type: ignore


@router.post(
    "/{id}/predeterminada",
    response_model=DireccionResponse,
    summary="Establecer como principal",
)
async def set_predeterminada(
    id: int,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> DireccionResponse:
    """Marca una dirección como principal y desmarca las demás."""
    return await service.set_predeterminada(db, current_user.id, id)  # type: ignore

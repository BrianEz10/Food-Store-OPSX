"""
Router de Ingredientes.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_user, require_role
from app.modules.ingredientes import service
from app.modules.ingredientes.schemas import (
    IngredienteAlergenoResponse,
    IngredienteCreate,
    IngredienteDeleteResponse,
    IngredienteListResponse,
    IngredienteResponse,
    IngredienteUpdate,
)
from app.modules.usuarios.model import Usuario

router = APIRouter(tags=["ingredientes"])


# ── Endpoints públicos ─────────────────────────────────────────────────


@router.get(
    "",
    response_model=IngredienteListResponse,
    summary="Listar todos los ingredientes",
)
async def list_ingredientes(
    db: AsyncSession = Depends(get_session),
) -> IngredienteListResponse:
    """Lista todos los ingredientes activos (público)."""
    ingredientes, total = await service.IngredienteService(db).list_all()
    return IngredienteListResponse(
        data=[IngredienteResponse.model_validate(i) for i in ingredientes],
        total=total,
    )


@router.get(
    "/alergenos",
    response_model=list[IngredienteAlergenoResponse],
    summary="Listar solo alérgenos",
)
async def list_alergenos(
    db: AsyncSession = Depends(get_session),
) -> list[IngredienteAlergenoResponse]:
    """Lista solo los ingredientes que son alérgenos (público)."""
    alergenos = await service.IngredienteService(db).list_alergenos()
    return [
        IngredienteAlergenoResponse(id=i.id, nombre=i.nombre, es_alergeno=i.es_alergeno)
        for i in alergenos
    ]


@router.get(
    "/{ingrediente_id}",
    response_model=IngredienteResponse,
    summary="Obtener un ingrediente por ID",
)
async def get_ingrediente(
    ingrediente_id: int,
    db: AsyncSession = Depends(get_session),
) -> IngredienteResponse:
    """Obtiene un ingrediente específico por su ID (público)."""
    ingrediente = await service.IngredienteService(db).get_by_id(ingrediente_id)
    if not ingrediente or ingrediente.eliminado_en is not None:
        from app.core.exceptions import NotFoundError

        raise NotFoundError("Ingrediente no encontrado")
    return IngredienteResponse.model_validate(ingrediente)


# ── Endpoints protegidos (STOCK, ADMIN) ────────────────────────────────


@router.post(
    "",
    response_model=IngredienteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un ingrediente",
    dependencies=[Depends(require_role(["STOCK", "ADMIN"]))],
)
async def create_ingrediente(
    data: IngredienteCreate,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> IngredienteResponse:
    """Crea un nuevo ingrediente. Requiere rol STOCK o ADMIN."""
    ingrediente = await service.IngredienteService(db).create(data)
    return IngredienteResponse.model_validate(ingrediente)


@router.put(
    "/{ingrediente_id}",
    response_model=IngredienteResponse,
    summary="Actualizar un ingrediente",
    dependencies=[Depends(require_role(["STOCK", "ADMIN"]))],
)
async def update_ingrediente(
    ingrediente_id: int,
    data: IngredienteUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> IngredienteResponse:
    """Actualiza un ingrediente existente. Requiere rol STOCK o ADMIN."""
    ingrediente = await service.IngredienteService(db).update(ingrediente_id, data)
    return IngredienteResponse.model_validate(ingrediente)


@router.delete(
    "/{ingrediente_id}",
    response_model=IngredienteDeleteResponse,
    summary="Eliminar un ingrediente",
    dependencies=[Depends(require_role(["STOCK", "ADMIN"]))],
)
async def delete_ingrediente(
    ingrediente_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> IngredienteDeleteResponse:
    """Elimina (soft delete) un ingrediente. Requiere rol STOCK o ADMIN."""
    ingrediente = await service.IngredienteService(db).delete(ingrediente_id)
    return IngredienteDeleteResponse(
        id=ingrediente.id,
        eliminado_en=ingrediente.eliminado_en,
    )
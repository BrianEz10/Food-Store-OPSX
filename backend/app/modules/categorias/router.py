"""
Router de Categorías.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_user, require_role
from app.modules.categorias import service
from app.modules.categorias.schemas import (
    CategoriaCreate,
    CategoriaDeleteResponse,
    CategoriaListResponse,
    CategoriaResponse,
    CategoriaTreeNode,
    CategoriaTreeResponse,
    CategoriaUpdate,
)
from app.modules.usuarios.model import Usuario

router = APIRouter(tags=["categorias"])


# ── Endpoints públicos ─────────────────────────────────────────────────


@router.get(
    "",
    response_model=CategoriaListResponse,
    summary="Listar todas las categorías",
)
async def list_categorias(
    db: AsyncSession = Depends(get_session),
) -> CategoriaListResponse:
    """Lista todas las categorías activas (público)."""
    categorias, total = await service.CategoriaService(db).list_all()
    return CategoriaListResponse(
        data=[CategoriaResponse.model_validate(c) for c in categorias],
        total=total,
    )


@router.get(
    "/arbol",
    response_model=CategoriaTreeResponse,
    summary="Obtener árbol de categorías",
)
async def get_arbol_categorias(
    db: AsyncSession = Depends(get_session),
) -> CategoriaTreeResponse:
    """Obtiene el árbol completo de categorías con hijos anidados (público)."""
    categorias_raiz = await service.CategoriaService(db).get_tree()

    def build_tree(categoria) -> CategoriaTreeNode:
        return CategoriaTreeNode(
            id=categoria.id,
            nombre=categoria.nombre,
            hijos=[build_tree(h) for h in categoria.hijos if h.eliminado_en is None],
        )

    return CategoriaTreeResponse(
        data=[build_tree(c) for c in categorias_raiz]
    )


@router.get(
    "/{categoria_id}",
    response_model=CategoriaResponse,
    summary="Obtener una categoría por ID",
)
async def get_categoria(
    categoria_id: int,
    db: AsyncSession = Depends(get_session),
) -> CategoriaResponse:
    """Obtiene una categoría específica por su ID (público)."""
    categoria = await service.CategoriaService(db).get_by_id(categoria_id)
    if not categoria:
        from app.core.exceptions import NotFoundError
        raise NotFoundError("Categoría no encontrada")
    return CategoriaResponse.model_validate(categoria)


# ── Endpoints protegidos (STOCK, ADMIN) ────────────────────────────────


@router.post(
    "",
    response_model=CategoriaResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear una categoría",
    dependencies=[Depends(require_role(["STOCK", "ADMIN"]))],
)
async def create_categoria(
    data: CategoriaCreate,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> CategoriaResponse:
    """Crea una nueva categoría. Requiere rol STOCK o ADMIN."""
    categoria = await service.CategoriaService(db).create(data)
    return CategoriaResponse.model_validate(categoria)


@router.put(
    "/{categoria_id}",
    response_model=CategoriaResponse,
    summary="Actualizar una categoría",
    dependencies=[Depends(require_role(["STOCK", "ADMIN"]))],
)
async def update_categoria(
    categoria_id: int,
    data: CategoriaUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> CategoriaResponse:
    """Actualiza una categoría existente. Requiere rol STOCK o ADMIN."""
    categoria = await service.CategoriaService(db).update(categoria_id, data)
    return CategoriaResponse.model_validate(categoria)


@router.delete(
    "/{categoria_id}",
    response_model=CategoriaDeleteResponse,
    summary="Eliminar una categoría",
    dependencies=[Depends(require_role(["STOCK", "ADMIN"]))],
)
async def delete_categoria(
    categoria_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> CategoriaDeleteResponse:
    """Elimina (soft delete) una categoría. Requiere rol STOCK o ADMIN."""
    categoria = await service.CategoriaService(db).delete(categoria_id)
    return CategoriaDeleteResponse(
        id=categoria.id,
        eliminado_en=categoria.eliminado_en,
    )
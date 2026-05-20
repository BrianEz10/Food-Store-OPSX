"""
Router de Productos.
Endpoints públicos de consulta y protegidos (STOCK/ADMIN) para mutación.
"""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_user, require_role
from app.modules.productos import service
from app.modules.productos.schemas import (
    ProductoCategoriaOut,
    ProductoCreate,
    ProductoDeleteResponse,
    ProductoListResponse,
    ProductoListadoItem,
    ProductoResponse,
    ProductoUpdate,
)
from app.modules.usuarios.model import Usuario

router = APIRouter(tags=["productos"])


# ── Endpoints públicos ──────────────────────────────────────────────────


@router.get(
    "",
    response_model=ProductoListResponse,
    summary="Listar productos del catálogo",
)
async def list_productos(
    skip: int = Query(default=0, ge=0, description="Registros a saltar"),
    limit: int = Query(default=100, ge=1, le=500, description="Máximo de registros"),
    categoria_id: int | None = Query(default=None, description="Filtrar por categoría"),
    search: str | None = Query(default=None, min_length=1, max_length=100, description="Búsqueda por nombre"),
    db: AsyncSession = Depends(get_session),
) -> ProductoListResponse:
    """Lista productos activos con paginación y filtros opcionales (público)."""
    productos, total = await service.ProductoService(db).list_all(
        skip=skip,
        limit=limit,
        categoria_id=categoria_id,
        search=search,
    )
    data: list[ProductoListadoItem] = []
    for p in productos:
        item = ProductoListadoItem.model_validate(p)
        item.categorias = [
            ProductoCategoriaOut(
                id=pc.categoria.id,
                nombre=pc.categoria.nombre,
                es_principal=pc.es_principal,
            )
            for pc in p.producto_categorias
            if pc.categoria and pc.categoria.eliminado_en is None
        ]
        data.append(item)

    return ProductoListResponse(
        data=data,
        total=total,
    )


@router.get(
    "/{producto_id}",
    response_model=ProductoResponse,
    summary="Obtener un producto por ID",
)
async def get_producto(
    producto_id: int,
    db: AsyncSession = Depends(get_session),
) -> ProductoResponse:
    """Obtiene un producto específico con sus relaciones (público)."""
    svc = service.ProductoService(db)
    producto = await svc.get_by_id(producto_id)
    if not producto:
        from app.core.exceptions import NotFoundError

        raise NotFoundError("Producto no encontrado")

    # Mapear response con relaciones
    return _map_producto_response(producto)


# ── Endpoints protegidos (STOCK, ADMIN) ────────────────────────────────


@router.post(
    "",
    response_model=ProductoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un producto",
    dependencies=[Depends(require_role(["STOCK", "ADMIN"]))],
)
async def create_producto(
    data: ProductoCreate,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> ProductoResponse:
    """Crea un nuevo producto con categorías e ingredientes. Requiere rol STOCK o ADMIN."""
    svc = service.ProductoService(db)
    producto = await svc.create(data)
    return _map_producto_response(producto)


@router.put(
    "/{producto_id}",
    response_model=ProductoResponse,
    summary="Actualizar un producto",
    dependencies=[Depends(require_role(["STOCK", "ADMIN"]))],
)
async def update_producto(
    producto_id: int,
    data: ProductoUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> ProductoResponse:
    """Actualiza un producto existente (reemplazo completo de relaciones). Requiere rol STOCK o ADMIN."""
    svc = service.ProductoService(db)
    producto = await svc.update(producto_id, data)
    return _map_producto_response(producto)


@router.delete(
    "/{producto_id}",
    response_model=ProductoDeleteResponse,
    summary="Eliminar un producto",
    dependencies=[Depends(require_role(["STOCK", "ADMIN"]))],
)
async def delete_producto(
    producto_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> ProductoDeleteResponse:
    """Elimina (soft delete) un producto. Valida que no tenga pedidos activos. Requiere rol STOCK o ADMIN."""
    producto = await service.ProductoService(db).delete(producto_id)
    return ProductoDeleteResponse(
        id=producto.id,
        eliminado_en=producto.eliminado_en,
    )


# ── Helpers ─────────────────────────────────────────────────────────────


def _map_producto_response(producto) -> ProductoResponse:
    """
    Mapea un producto ORM a ProductoResponse con relaciones anidadas.
    Convierte las tablas pivote en listas planas de categorías e ingredientes.
    """
    from app.modules.productos.schemas import (
        ProductoCategoriaOut,
        ProductoIngredienteOut,
    )

    categorias = [
        ProductoCategoriaOut(
            id=pc.categoria.id,
            nombre=pc.categoria.nombre,
            es_principal=pc.es_principal,
        )
        for pc in producto.producto_categorias
        if pc.categoria and pc.categoria.eliminado_en is None
    ]

    ingredientes = [
        ProductoIngredienteOut(
            id=pi.ingrediente.id,
            nombre=pi.ingrediente.nombre,
            es_alergeno=pi.ingrediente.es_alergeno,
            es_removible=pi.es_removible,
        )
        for pi in producto.producto_ingredientes
        if pi.ingrediente and pi.ingrediente.eliminado_en is None
    ]

    response = ProductoResponse.model_validate(producto)
    response.categorias = categorias
    response.ingredientes = ingredientes
    return response

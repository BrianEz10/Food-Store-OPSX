"""
Schemas Pydantic para el módulo de Productos.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


# ── Schemas anidados ──────────────────────────────────────────────────


class ProductoCategoriaOut(BaseModel):
    """Categoría asociada a un producto (response)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    es_principal: bool


class ProductoIngredienteCreate(BaseModel):
    """Schema para asociar ingrediente al crear/actualizar producto."""

    ingrediente_id: int = Field(..., description="ID del ingrediente")
    es_removible: bool = Field(..., description="Si el ingrediente puede removerse")


class ProductoIngredienteOut(BaseModel):
    """Ingrediente asociado a un producto (response)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    es_alergeno: bool
    es_removible: bool


# ── Schemas de Request ──────────────────────────────────────────────────


class ProductoCreate(BaseModel):
    """Schema para crear un producto."""

    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: str = Field(..., min_length=1, max_length=200)
    descripcion: Optional[str] = Field(default=None, max_length=2000)
    imagen_url: Optional[str] = Field(default=None, max_length=500)
    precio_base: float = Field(..., ge=0, description="Precio base del producto")
    stock_cantidad: int = Field(default=0, ge=0, description="Cantidad en stock")
    disponible: bool = Field(default=True, description="Si está disponible para la venta")
    categoria_ids: list[int] = Field(default_factory=list, description="IDs de categorías asociadas")
    ingredientes: list[ProductoIngredienteCreate] = Field(
        default_factory=list,
        description="Ingredientes asociados",
    )


class ProductoUpdate(BaseModel):
    """Schema para actualizar un producto."""

    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: Optional[str] = Field(default=None, min_length=1, max_length=200)
    descripcion: Optional[str] = Field(default=None, max_length=2000)
    imagen_url: Optional[str] = Field(default=None, max_length=500)
    precio_base: Optional[float] = Field(default=None, ge=0)
    stock_cantidad: Optional[int] = Field(default=None, ge=0)
    disponible: Optional[bool] = Field(default=None)
    categoria_ids: Optional[list[int]] = Field(default=None, description="IDs de categorías (reemplazo completo)")
    ingredientes: Optional[list[ProductoIngredienteCreate]] = Field(
        default=None,
        description="Ingredientes (reemplazo completo)",
    )


# ── Schemas de Response ─────────────────────────────────────────────────


class ProductoResponse(BaseModel):
    """Schema completo de producto (desde BD) con relaciones."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: Optional[str]
    imagen_url: Optional[str]
    precio_base: float
    stock_cantidad: int
    disponible: bool
    eliminado_en: Optional[datetime]
    creado_en: datetime
    actualizado_en: datetime
    categorias: list[ProductoCategoriaOut] = Field(default_factory=list)
    ingredientes: list[ProductoIngredienteOut] = Field(default_factory=list)


class ProductoListadoItem(BaseModel):
    """Versión ligera de producto para listados paginados."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: Optional[str]
    imagen_url: Optional[str]
    precio_base: float
    stock_cantidad: int
    disponible: bool
    creado_en: datetime
    categorias: list[ProductoCategoriaOut] = Field(default_factory=list)


class ProductoListResponse(BaseModel):
    """Response para listar productos."""

    data: list[ProductoListadoItem]
    total: int


class ProductoDeleteResponse(BaseModel):
    """Response para eliminación."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    eliminado_en: Optional[datetime]

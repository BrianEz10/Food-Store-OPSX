"""
Schemas Pydantic para el módulo de Categorías.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


# ── Schemas de Request ──────────────────────────────────────────────────


class CategoriaCreate(BaseModel):
    """Schema para crear una categoría."""

    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: str = Field(..., min_length=1, max_length=100)
    descripcion: Optional[str] = Field(default=None, max_length=500)
    imagen_url: Optional[str] = Field(default=None, max_length=500)
    padre_id: Optional[int] = Field(default=None, description="ID de la categoría padre")
    orden: int = Field(default=0, description="Orden de visualización")


class CategoriaUpdate(BaseModel):
    """Schema para actualizar una categoría."""

    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: Optional[str] = Field(default=None, min_length=1, max_length=100)
    descripcion: Optional[str] = Field(default=None, max_length=500)
    imagen_url: Optional[str] = Field(default=None, max_length=500)
    padre_id: Optional[int] = Field(default=None, description="ID de la categoría padre")
    orden: Optional[int] = Field(default=None)


# ── Schemas de Response ─────────────────────────────────────────────────


class CategoriaResponse(BaseModel):
    """Schema base de categoría (desde BD)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: Optional[str]
    imagen_url: Optional[str]
    padre_id: Optional[int]
    orden: int
    eliminado_en: Optional[datetime]
    creado_en: datetime
    actualizado_en: datetime


class CategoriaTreeNode(BaseModel):
    """Nodo del árbol de categorías para respuesta jerárquica."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    hijos: list["CategoriaTreeNode"] = Field(default_factory=list)


class CategoriaListResponse(BaseModel):
    """Response para listar categorías."""

    data: list[CategoriaResponse]
    total: int


class CategoriaTreeResponse(BaseModel):
    """Response para el árbol de categorías."""

    data: list[CategoriaTreeNode]


class CategoriaDeleteResponse(BaseModel):
    """Response para eliminación."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    eliminado_en: Optional[datetime]


# ── Schemas auxiliary ───────────────────────────────────────────────────


class CategoriaConHijos(BaseModel):
    """Categoría con sus hijos para construcción del árbol."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: Optional[str]
    padre_id: Optional[int]
    orden: int
    hijos: list["CategoriaConHijos"] = Field(default_factory=list)
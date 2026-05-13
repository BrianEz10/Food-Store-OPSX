"""
Schemas Pydantic para el módulo de Ingredientes.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


# ── Schemas de Request ──────────────────────────────────────────────────


class IngredienteCreate(BaseModel):
    """Schema para crear un ingrediente."""

    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: str = Field(..., min_length=1, max_length=100)
    descripcion: Optional[str] = Field(default=None, max_length=500)
    es_alergeno: bool = Field(default=False, description="Flag de alérgeno")


class IngredienteUpdate(BaseModel):
    """Schema para actualizar un ingrediente."""

    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: Optional[str] = Field(default=None, min_length=1, max_length=100)
    descripcion: Optional[str] = Field(default=None, max_length=500)
    es_alergeno: Optional[bool] = Field(default=None)


# ── Schemas de Response ─────────────────────────────────────────────────


class IngredienteResponse(BaseModel):
    """Schema base de ingrediente (desde BD)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: Optional[str]
    es_alergeno: bool
    eliminado_en: Optional[datetime]
    creado_en: datetime
    actualizado_en: datetime


class IngredienteListResponse(BaseModel):
    """Response para listar ingredientes."""

    data: list[IngredienteResponse]
    total: int


class IngredienteAlergenoResponse(BaseModel):
    """Response para listar solo alérgenos."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    es_alergeno: bool


class IngredienteDeleteResponse(BaseModel):
    """Response para eliminación."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    eliminado_en: Optional[datetime]
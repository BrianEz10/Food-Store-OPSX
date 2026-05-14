"""
Schemas para endpoints de administración.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class AdminUsuarioResponse(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    telefono: Optional[str] = None
    roles: list[str] = []
    activo: bool = True
    creado_en: datetime

    class Config:
        from_attributes = True


class AdminUsuarioDetailResponse(AdminUsuarioResponse):
    actualizado_en: Optional[datetime] = None
    eliminado_en: Optional[datetime] = None


class AdminUsuarioListResponse(BaseModel):
    data: list[AdminUsuarioResponse]
    total: int
    skip: int = 0
    limit: int = 20


class AdminUsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[str] = None
    roles: Optional[list[str]] = None


class AdminUsuarioEstadoUpdate(BaseModel):
    activo: bool

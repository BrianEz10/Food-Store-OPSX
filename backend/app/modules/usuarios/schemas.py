from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class PerfilResponse(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: EmailStr
    roles: list[str]
    creado_en: datetime

    model_config = ConfigDict(from_attributes=True)


class PerfilUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1, max_length=100)
    apellido: Optional[str] = Field(None, min_length=1, max_length=100)


class CambioPasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8)

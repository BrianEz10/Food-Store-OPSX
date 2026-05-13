from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class DireccionResponse(BaseModel):
    id: int
    alias: Optional[str] = None
    linea1: str
    linea2: Optional[str] = None
    ciudad: str
    codigo_postal: str
    es_principal: bool

    model_config = ConfigDict(from_attributes=True)


class DireccionCreate(BaseModel):
    alias: Optional[str] = Field(None, max_length=50)
    linea1: str = Field(..., min_length=1)
    linea2: Optional[str] = Field(None)
    ciudad: str = Field(..., min_length=1, max_length=100)
    codigo_postal: str = Field(..., min_length=1, max_length=10)
    es_principal: bool = Field(default=False)


class DireccionUpdate(BaseModel):
    alias: Optional[str] = Field(None, max_length=50)
    linea1: Optional[str] = Field(None, min_length=1)
    linea2: Optional[str] = Field(None)
    ciudad: Optional[str] = Field(None, min_length=1, max_length=100)
    codigo_postal: Optional[str] = Field(None, min_length=1, max_length=10)
    es_principal: Optional[bool] = Field(None)

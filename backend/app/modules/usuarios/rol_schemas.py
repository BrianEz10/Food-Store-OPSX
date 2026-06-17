from sqlmodel import SQLModel


class RolOut(SQLModel):
    codigo: str
    nombre: str
    descripcion: str | None = None
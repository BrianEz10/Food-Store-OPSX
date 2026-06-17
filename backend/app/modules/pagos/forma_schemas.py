from sqlmodel import SQLModel


class FormaPagoOut(SQLModel):
    codigo: str
    descripcion: str
    habilitado: bool
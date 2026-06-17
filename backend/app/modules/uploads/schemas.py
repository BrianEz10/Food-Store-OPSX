from sqlmodel import SQLModel


class UploadResponse(SQLModel):
    secure_url: str
    public_id: str
    format: str


class ImagenProductoUpdate(SQLModel):
    imagenes_url: list[str]


class ImagenCategoriaUpdate(SQLModel):
    imagen_url: str | None = None
from sqlmodel import SQLModel, Field
from app.modules.categorias.schemas import CategoriaOut
from app.modules.ingredientes.schemas import IngredienteOut


class UploadResponse(SQLModel):
    url: str
    filename: str
    format: str


class ImagenProductoUpdate(SQLModel):
    imagenes_url: list[str]


class CategoriaEnProducto(SQLModel):
    categoria_id: int
    es_principal: bool = False


class IngredienteEnProducto(SQLModel):
    ingrediente_id: int
    cantidad: float = 0


class ProductoCreate(SQLModel):
    nombre: str = Field(max_length=150)
    descripcion: str | None = None
    precio_base: float = Field(default=0, ge=0)
    imagenes_url: list[str] | None = None
    stock_cantidad: int = Field(default=0, ge=0)
    disponible: bool = True
    categorias: list[CategoriaEnProducto] = []
    ingredientes: list[IngredienteEnProducto] = []


class ProductoUpdate(SQLModel):
    nombre: str | None = Field(default=None, max_length=150)
    descripcion: str | None = None
    precio_base: float | None = Field(default=None, ge=0)
    imagenes_url: list[str] | None = None
    stock_cantidad: int | None = Field(default=None, ge=0)
    disponible: bool | None = None
    categorias: list[CategoriaEnProducto] | None = None
    ingredientes: list[IngredienteEnProducto] | None = None


class ProductoOut(SQLModel):
    id: int
    nombre: str
    descripcion: str | None = None
    precio_base: float = 0
    imagenes_url: list[str] | None = None
    stock_cantidad: int = 0
    disponible: bool = True
    categorias: list[CategoriaOut] = []


class DisponibilidadRequest(SQLModel):
    disponible: bool


class PaginatedProductos(SQLModel):
    items: list[ProductoOut]
    total: int
    page: int
    size: int
    pages: int


class IngredienteEnProductoRequest(SQLModel):
    ingrediente_id: int
    cantidad: float = Field(gt=0)


class ProductoIngredienteRead(SQLModel):
    producto_id: int
    ingrediente_id: int
    cantidad: float

class IngredientePersonalizadoOut(SQLModel):
    id: int
    nombre: str
    es_alergeno: bool

class IngredienteEnProductoOut(IngredienteOut):
    pass


class ProductoDetail(SQLModel):
    id: int
    nombre: str
    descripcion: str | None = None
    precio_base: float = 0
    imagenes_url: list[str] | None = None
    stock_cantidad: int = 0
    disponible: bool = True
    categorias: list[CategoriaOut] = []
    ingredientes: list[IngredienteEnProductoOut] = []

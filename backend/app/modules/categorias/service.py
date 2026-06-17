from datetime import datetime, timezone
from sqlmodel import Session, select
from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import CategoriaCreate, CategoriaUpdate, CategoriaOut, CategoriaWithHijos
from app.modules.productos.associations import ProductoCategoria
from app.core.errors import http_error

class CategoriaService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def _get_or_404(self, categoria_id: int) -> Categoria:
        categoria = self._session.get(Categoria, categoria_id)
        if not categoria:
            raise http_error(404, f"Categoria con id {categoria_id} no encontrada", "NOT_FOUND", "categoria_id")
        return categoria

    def _assert_name_unique(self, nombre: str) -> None:
        existing = self._session.exec(
            select(Categoria).where(Categoria.nombre == nombre, Categoria.deleted_at == None)
        ).first()
        if existing:
            raise http_error(409, f"Ya existe una categoria con nombre '{nombre}'", "ALREADY_EXISTS", "nombre")

    def create(self, data: CategoriaCreate) -> CategoriaOut:
        self._assert_name_unique(data.nombre)
        if data.parent_id is not None:
            parent = self._session.get(Categoria, data.parent_id)
            if not parent:
                raise http_error(400, f"Categoria padre no encontrada", "NOT_FOUND", "parent_id")
        categoria = Categoria.model_validate(data)
        self._session.add(categoria)
        self._session.flush()
        self._session.commit()
        return CategoriaOut.model_validate(categoria)

    def get_all(self, parent_id: int | None = None, offset: int = 0, limit: int = 20) -> list[CategoriaOut]:
        stmt = select(Categoria).where(Categoria.deleted_at == None)
        if parent_id == -1:
            stmt = stmt.where(Categoria.parent_id == None)
        elif parent_id is not None:
            stmt = stmt.where(Categoria.parent_id == parent_id)
        stmt = stmt.offset(offset).limit(limit).order_by(Categoria.id)
        categorias = self._session.exec(stmt).all()
        return [CategoriaOut.model_validate(c) for c in categorias]

    def get_by_id(self, categoria_id: int) -> CategoriaWithHijos:
        categoria = self._get_or_404(categoria_id)
        hijos = [h for h in categoria.hijos if h.deleted_at is None]
        categoria.hijos = hijos
        return CategoriaWithHijos.model_validate(categoria)

    def update(self, categoria_id: int, data: CategoriaUpdate) -> CategoriaOut:
        categoria = self._get_or_404(categoria_id)
        if data.parent_id is not None:
            if data.parent_id == categoria_id:
                raise http_error(400, "Una categoria no puede ser padre de si misma", "BAD_REQUEST", "parent_id")
            parent = self._session.get(Categoria, data.parent_id)
            if not parent:
                raise http_error(400, f"Categoria padre no encontrada", "NOT_FOUND", "parent_id")
        patch = data.model_dump(exclude_unset=True)
        for field, value in patch.items():
            if field == "nombre":
                existing = self._session.exec(
                    select(Categoria).where(Categoria.nombre == value, Categoria.deleted_at == None)
                ).first()
                if existing and existing.id != categoria_id:
                    raise http_error(409, f"Ya existe una categoria con nombre '{value}'", "ALREADY_EXISTS", "nombre")
            setattr(categoria, field, value)
        self._session.add(categoria)
        self._session.commit()
        return CategoriaOut.model_validate(categoria)

    def delete(self, categoria_id: int) -> None:
        categoria = self._get_or_404(categoria_id)
        productos_asociados = self._session.exec(
            select(ProductoCategoria).where(ProductoCategoria.categoria_id == categoria_id)
        ).first()
        if productos_asociados:
            raise http_error(409, "No se puede eliminar: tiene productos asociados", "BAD_REQUEST")
        categoria.deleted_at = datetime.now(timezone.utc)
        self._session.commit()

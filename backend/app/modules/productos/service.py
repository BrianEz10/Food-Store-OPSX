from datetime import datetime, timezone
from sqlalchemy import func
from sqlmodel import Session, select
from app.modules.categorias.schemas import CategoriaOut
from app.modules.productos.models import Producto
from app.modules.productos.schemas import IngredienteEnProductoOut, IngredienteEnProductoRequest, IngredientePersonalizadoOut, ProductoCreate, ProductoDetail, ProductoIngredienteRead, ProductoUpdate, ProductoOut, PaginatedProductos
from app.modules.productos.associations import ProductoCategoria, ProductoIngrediente
from app.modules.categorias.models import Categoria
from app.modules.ingredientes.models import Ingrediente
from app.core.errors import http_error


class ProductoService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def _get_or_404(self, producto_id: int) -> Producto:
        producto = self._session.get(Producto, producto_id)
        if not producto:
            raise http_error(404, "Producto no encontrado", "NOT_FOUND", "producto_id")
        return producto

    def create(self, data: ProductoCreate) -> ProductoOut:
        producto = Producto(**data.model_dump(exclude={"categorias", "ingredientes"}))
        self._session.add(producto)
        self._session.flush()
        principales = [c for c in data.categorias if c.es_principal]
        if len(principales) > 1:
            raise http_error(400, "Solo puede haber una categoría principal por producto", "BAD_REQUEST", "categorias")
        for cat_data in data.categorias:
            cat = self._session.get(Categoria, cat_data.categoria_id)
            if not cat:
                raise http_error(404, "Categoria no encontrada", "NOT_FOUND", "categoria_id")
            link = ProductoCategoria(
                producto_id=producto.id,
                categoria_id=cat_data.categoria_id,
                es_principal=cat_data.es_principal,
            )
            self._session.add(link)
        for ing_data in data.ingredientes:
            ing = self._session.get(Ingrediente, ing_data.ingrediente_id)
            if not ing:
                raise http_error(404, "Ingrediente no encontrado", "NOT_FOUND", "ingrediente_id")
            if ing_data.cantidad <= 0:
                raise http_error(400, "La cantidad debe ser mayor a 0", "BAD_REQUEST", "cantidad")
            link = ProductoIngrediente(
                producto_id=producto.id,
                ingrediente_id=ing_data.ingrediente_id,
                cantidad=ing_data.cantidad,
            )
            self._session.add(link)
        self._session.commit()
        return ProductoOut.model_validate(producto)

    def get_all(self, categoria_id: int | None = None, disponible: bool | None = None,
                buscar: str | None = None, page: int = 1, size: int = 20) -> PaginatedProductos:
        stmt = select(Producto).where(Producto.deleted_at == None)
        if categoria_id is not None:
            stmt = stmt.join(ProductoCategoria).where(
                ProductoCategoria.categoria_id == categoria_id
            ).distinct()
        if disponible is not None:
            stmt = stmt.where(Producto.disponible == disponible)
        if buscar:
            stmt = stmt.where(Producto.nombre.ilike(f"%{buscar}%"))

        total = self._session.exec(
            select(func.count()).select_from(stmt.subquery())
        ).one()

        stmt = stmt.offset((page - 1) * size).limit(size).order_by(Producto.id)
        productos_db = self._session.exec(stmt).all()
        result = []
        for p in productos_db:
            out = ProductoOut.model_validate(p)
            pc_stmt = select(Categoria).join(ProductoCategoria).where(ProductoCategoria.producto_id == p.id)
            cat_result = self._session.exec(pc_stmt).all()
            out.categorias = [CategoriaOut.model_validate(c) for c in cat_result]
            result.append(out)
        pages = (total + size - 1) // size

        return PaginatedProductos(items=result, total=total, page=page, size=size, pages=pages)

    def get_by_id(self, producto_id: int) -> ProductoDetail:
        producto = self._get_or_404(producto_id)
        result = ProductoDetail.model_validate(producto)

        ingredientes = []
        for pi in producto.producto_ingredientes:
            ing = IngredienteEnProductoOut(
                id=pi.ingrediente.id,
                nombre=pi.ingrediente.nombre,
                descripcion=pi.ingrediente.descripcion,
                es_alergeno=pi.ingrediente.es_alergeno,
            )
            ingredientes.append(ing)

        result.ingredientes = ingredientes
        return result

    def get_ingredientes(self, producto_id: int) -> list[IngredientePersonalizadoOut]:
        self._get_or_404(producto_id)
        stmt = (
            select(Ingrediente)
            .join(ProductoIngrediente, Ingrediente.id == ProductoIngrediente.ingrediente_id)
            .where(ProductoIngrediente.producto_id == producto_id)
        )
        rows = self._session.exec(stmt).all()
        result = [
            IngredientePersonalizadoOut(
                id=ing.id,
                nombre=ing.nombre,
                es_alergeno=ing.es_alergeno,
            )
            for ing in rows
        ]
        return result

    def agregar_ingrediente(self, producto_id: int, data: IngredienteEnProductoRequest) -> ProductoIngredienteRead:
        self._get_or_404(producto_id)
        ing = self._session.get(Ingrediente, data.ingrediente_id)
        if not ing:
            raise http_error(404, "Ingrediente no encontrado", "NOT_FOUND", "ingrediente_id")
        if data.cantidad <= 0:
            raise http_error(400, "La cantidad debe ser mayor a 0", "BAD_REQUEST", "cantidad")
        link = ProductoIngrediente(
            producto_id=producto_id,
            ingrediente_id=data.ingrediente_id,
            cantidad=data.cantidad,
        )
        self._session.add(link)
        self._session.commit()
        return ProductoIngredienteRead(
            producto_id=producto_id,
            ingrediente_id=data.ingrediente_id,
            cantidad=data.cantidad,
        )

    def update(self, producto_id: int, data: ProductoUpdate) -> ProductoOut:
        producto = self._get_or_404(producto_id)
        update_data = data.model_dump(exclude_unset=True, exclude={"categorias", "ingredientes"})
        for field, value in update_data.items():
            setattr(producto, field, value)
        if data.categorias is not None:
            principales = [c for c in data.categorias if c.es_principal]
            if len(principales) > 1:
                raise http_error(400, "Solo puede haber una categoría principal por producto", "BAD_REQUEST", "categorias")
            old_cat_links = self._session.exec(
                select(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id)
            ).all()
            for link in old_cat_links:
                self._session.delete(link)

            for cat_data in data.categorias:
                cat = self._session.get(Categoria, cat_data.categoria_id)
                if not cat:
                    raise http_error(404, "Categoria no encontrada", "NOT_FOUND", "categoria_id")
                link = ProductoCategoria(
                    producto_id=producto.id,
                    categoria_id=cat_data.categoria_id,
                    es_principal=cat_data.es_principal,
                )
                self._session.add(link)

        if data.ingredientes is not None:
            old_ing_links = self._session.exec(
                select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
            ).all()
            for link in old_ing_links:
                self._session.delete(link)
            for ing_data in data.ingredientes:
                ing = self._session.get(Ingrediente, ing_data.ingrediente_id)
                if not ing:
                    raise http_error(404, f"Ingrediente {ing_data.ingrediente_id} no encontrado", "NOT_FOUND", "ingrediente_id")
                if ing_data.cantidad <= 0:
                    raise http_error(400, "La cantidad debe ser mayor a 0", "BAD_REQUEST", "cantidad")
                link = ProductoIngrediente(
                    producto_id=producto_id,
                    ingrediente_id=ing_data.ingrediente_id,
                    cantidad=ing_data.cantidad,
                )
                self._session.add(link)
        self._session.add(producto)
        self._session.commit()
        return ProductoOut.model_validate(producto)

    def update_imagenes(self, producto_id: int, imagenes_url: list[str]) -> ProductoOut:
        producto = self._get_or_404(producto_id)
        producto.imagenes_url = imagenes_url
        self._session.commit()
        return ProductoOut.model_validate(producto)

    def toggle_disponibilidad(self, producto_id: int, disponible: bool) -> ProductoOut:
        producto = self._get_or_404(producto_id)
        producto.disponible = disponible
        self._session.commit()
        return ProductoOut.model_validate(producto)

    def delete(self, producto_id: int) -> None:
        producto = self._get_or_404(producto_id)
        producto.deleted_at = datetime.now(timezone.utc)
        self._session.commit()

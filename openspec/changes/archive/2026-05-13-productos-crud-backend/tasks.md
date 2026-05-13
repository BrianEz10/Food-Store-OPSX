## 1. Schemas Pydantic (productos/schemas.py)

- [x] 1.1 Crear `ProductoCreate` con nombre, descripcion, imagen_url, precio_base, stock_cantidad, disponible, categoria_ids: list[int], ingredientes: list[ProductoIngredienteCreate]
- [x] 1.2 Crear `ProductoIngredienteCreate` con ingrediente_id y es_removible
- [x] 1.3 Crear `ProductoUpdate` con todos los campos opcionales + categoria_ids e ingredientes
- [x] 1.4 Crear `ProductoResponse` con from_attributes=True, incluyendo categorias e ingredientes como listas anidadas
- [x] 1.5 Crear `ProductoListResponse` con data: list[ProductoResponse] y total: int
- [x] 1.6 Crear `ProductoDeleteResponse` con id y eliminado_en
- [x] 1.7 Crear `ProductoListadoItem` (versión ligera sin relaciones para listados paginados)

## 2. Repositorio extendido (productos/repository.py)

- [x] 2.1 Agregar método `search_by_name(self, search: str, skip: int, limit: int) -> tuple[list[Producto], int]` con ILIKE
- [x] 2.2 Agregar método `list_by_categoria(self, categoria_id: int, skip: int, limit: int) -> tuple[list[Producto], int]` con join a ProductoCategoria
- [x] 2.3 Agregar método `has_active_orders(self, producto_id: int) -> bool` que verifica DetallePedido con pedidos en estado no terminal

## 3. Servicio (productos/service.py)

- [x] 3.1 Implementar `create(data: ProductoCreate)` con validación de M2M: crear producto + insertar relaciones + commit
- [x] 3.2 Implementar `get_by_id(producto_id: int)` con relaciones (selectinload)
- [x] 3.3 Implementar `list_all(skip, limit, categoria_id, search)` con filtros opcionales
- [x] 3.4 Implementar `update(producto_id, data: ProductoUpdate)` con reemplazo completo de relaciones M2M
- [x] 3.5 Implementar `delete(producto_id)` con validación de pedidos activos → soft delete
- [x] 3.6 Mapear respuestas con relaciones incluidas para get_by_id (categorías + ingredientes anidados)

## 4. Router (productos/router.py)

- [x] 4.1 Crear endpoint GET /api/v1/productos (público, con paginación, ?categoria_id, ?search)
- [x] 4.2 Crear endpoint GET /api/v1/productos/{producto_id} (público, con relaciones)
- [x] 4.3 Crear endpoint POST /api/v1/productos (protegido STOCK/ADMIN, HTTP 201)
- [x] 4.4 Crear endpoint PUT /api/v1/productos/{producto_id} (protegido STOCK/ADMIN)
- [x] 4.5 Crear endpoint DELETE /api/v1/productos/{producto_id} (protegido STOCK/ADMIN, soft delete)

## 5. Registrar router en main.py

- [x] 5.1 Importar router de productos en backend/app/main.py
- [x] 5.2 Registrar con app.include_router(productos_router, prefix="/api/v1/productos")

## 6. Corregir bug IngredienteRepository

- [x] 6.1 Eliminar `IngredienteRepository` de `productos/repository.py` (redundante con `ingredientes/repository.py`)
- [x] 6.2 Actualizar import en `app/core/uow.py`: usar `ingredientes.repository` en lugar de `productos.repository`
- [x] 6.3 Corregir import en `tests/conftest.py` que también importaba `Ingrediente` desde `productos.model`

## Why

El catálogo de productos es el núcleo del negocio de Food Store. Actualmente los modelos `Producto`, `ProductoCategoria` y `ProductoIngrediente` ya existen en la base de datos, pero no hay una API que permita gestionar productos. Sin este cambio, no es posible crear, editar, listar ni eliminar productos, lo que bloquea todo el flujo de catálogo, carrito de compras y pedidos. Este cambio implementa el CRUD completo de productos en el backend con relaciones M:N contra categorías e ingredientes, control de stock y soft delete.

## What Changes

- Nuevo módulo `productos/` con schemas Pydantic, servicio con lógica de negocio y router FastAPI
- CRUD completo de productos: crear, listar (con paginación y filtros), obtener por ID, actualizar y soft delete
- Asociación M2M con categorías (tabla `productos_categorias`) e ingredientes (`productos_ingredientes`) durante creación/actualización
- Validación de stock (`stock_cantidad >= 0`) y flag `disponible`
- Soft delete con validación: no se puede eliminar un producto si tiene pedidos activos asociados
- Endpoints protegidos por rol STOCK/ADMIN
- Corrección de bug en `productos/repository.py`: `IngredienteRepository` importa desde `productos.model` pero la clase está en `ingredientes.model`. Se actualiza la importación.
- El `ProductoRepository` se extiende con métodos de dominio (búsqueda por nombre, filtro por categoría, verificación de pedidos activos)

## Capabilities

### New Capabilities
- `productos-crud`: CRUD completo de productos del catálogo con relaciones M2M (categorías, ingredientes), control de stock, soft delete con validación de pedidos activos, y endpoints protegidos por roles. Define los schemas de request/response, la lógica de negocio en service, y los endpoints REST.

### Modified Capabilities
- `backend-patterns`: El `ProductoRepository` existente se extiende con métodos de dominio específicos (búsqueda, filtros, validación de pedidos activos)
- `database-models`: Los modelos `Producto`, `ProductoCategoria` y `ProductoIngrediente` ya existen; no requieren cambios

## Impact

- **Nuevo**: `backend/app/modules/productos/schemas.py`, `service.py`, `router.py`
- **Modificado**: `backend/app/modules/productos/repository.py` (extensión + fix import Ingrediente), `backend/app/main.py` (registrar nuevo router)
- **Sin cambios**: modelos de base de datos, migraciones, seed data — ya están implementados en changes previos

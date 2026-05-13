## Why

El backend ya expone endpoints públicos para listar y consultar productos (GET /api/v1/productos con paginación, filtro por categoría y búsqueda por nombre), pero el frontend carece de una vista de catálogo donde los clientes puedan explorar los productos disponibles. Sin esta interfaz, los usuarios no pueden navegar el menú de la tienda, lo que bloquea la experiencia de compra.

## What Changes

- Crear una página de **Catálogo Público** (`/catalogo`) que muestre productos en cuadrícula con paginación, filtro por categoría y búsqueda por nombre.
- Crear una página de **Detalle de Producto** (`/producto/:id`) accesible desde el catálogo, que muestre información completa del producto incluyendo precio, descripción, ingredientes (con indicación de removibles) y categorías.
- Agregar la entidad `Product` en la capa `entities` de FSD con tipos y stores (TanStack Query).
- Agregar enlace al catálogo en la navegación principal del AppLayout (visible para todos los roles, incluidos usuarios anónimos).
- Conectar los datos con los endpoints existentes del backend.

## Capabilities

### New Capabilities
- `public-catalog`: Vista pública de productos en cuadrícula con paginación, filtro por categoría y búsqueda por nombre, conectada a los endpoints GET /api/v1/productos.
- `product-detail`: Vista detallada de un producto individual con precio, descripción, categorías e ingredientes, conectada al endpoint GET /api/v1/productos/:id.

### Modified Capabilities
- `app-shell`: Agregar ruta `/catalogo` y `/producto/:id` al router, y enlace "Catálogo" en el menú de navegación para todos los roles (incluyendo usuarios anónimos).

## Impact

- **Frontend**: Nuevas páginas en `src/pages/catalogo/` y `src/pages/producto/`. Nueva entidad `Product` en `src/entities/product/`. Nuevo queryKey y hooks con TanStack Query. Modificación del router en `app/router.tsx`. Modificación del layout en `app/AppLayout.tsx` para agregar el enlace al catálogo.
- **API**: No requiere cambios — consume endpoints existentes de productos.
- **Dependencias**: Ninguna nueva. Usa TanStack Query y Axios ya configurados.

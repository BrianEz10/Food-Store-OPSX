## Context

Actualmente el frontend de Food Store no cuenta con una vista pública de productos. Los endpoints backend ya existen y están operativos:
- `GET /api/v1/productos` — listado paginado con filtros (categoria_id, search) y ordenado por nombre
- `GET /api/v1/productos/:id` — detalle con categorías e ingredientes asociados

La arquitectura frontend está organizada bajo Feature-Sliced Design (FSD) con Vite + React + TypeScript, TanStack Query para manejo de estado del servidor, y Axios como cliente HTTP con refresh de JWT automático.

El layout principal (`AppLayout`) ya maneja navegación por roles y rutas públicas/protegidas, con sidebar en desktop y bottom nav en mobile.

## Goals / Non-Goals

**Goals:**
- Proveer una página de catálogo público (`/catalogo`) donde los clientes puedan explorar productos en cuadrícula con paginación, filtro por categoría y búsqueda por nombre.
- Proveer una página de detalle de producto (`/producto/:id`) con info completa del producto.
- Crear la entidad `Product` en la capa `entities` de FSD con tipos TypeScript, queries de TanStack Query y claves de caché.
- Integrar las nuevas rutas en el router y en la navegación del AppLayout (visible para todos los roles incluido anónimo).

**Non-Goals:**
- No se modifican endpoints del backend.
- No se implementa carrito de compras (será un cambio futuro).
- No se implementa autenticación ni control de roles en estas páginas (son completamente públicas).
- No se implementan reseñas, valoraciones ni comentarios de productos.
- No se implementa vista de administración de productos (ya existe en admin).

## Decisions

1. **Entidad `Product` ubicada en `entities/product/`**: Sigue la convención FSD donde `entities` contiene modelos de negocio. Incluirá tipos, queries (useProducts, useProduct), queryKeys, y un adapter para transformar la respuesta de la API.

2. **Catálogo como página (`pages/catalogo/`)**: Se crea una página `CatalogPage` que orquesta los widgets de filtros y la grilla. Esto mantiene la página delgada y permite reutilizar los widgets en otros contextos.

3. **Filtros client-side vs server-side**: Se opta por filtros server-side (query params). La búsqueda por nombre y filtro por categoría se envían como parámetros a `GET /api/v1/productos`, que ya los soporta. TanStack Query se encarga del caching y refetch.

4. **Sin lazy loading inicial**: Las páginas son lo suficientemente livianas. Si el catálogo crece mucho, se puede agregar React.lazy + Suspense más adelante.

5. **Navegación**: "Catálogo" se agrega como primer item del menú para TODOS los roles (incluyendo anónimos), antes de "Inicio". En mobile aparece en el bottom nav.

6. **Imágenes**: El campo `imagen` del producto se muestra con un `img` placeholder en caso de null. No se implementa CDN ni optimización de imágenes en este cambio.

## Risks / Trade-offs

- [Paginación] → La paginación actual del backend usa skip/limit. Si el catálogo tiene +1000 productos, puede volverse lento. Mitigación: el endpoint ya tiene paginación, y TanStack Query cachea los resultados.
- [Sin lazy loading] → Si las páginas crecen en complejidad, pueden aumentar el bundle inicial. Mitigación: monitorear y agregar lazy loading post-MVP si es necesario.
- [UX en mobile] → La grilla de productos en pantallas chicas puede verse apretada. Mitigación: usar columnas responsivas (1 columna mobile, 2 tablet, 3-4 desktop) vía Tailwind.

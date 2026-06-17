## 1. Entidad Product en frontend

- [x] 1.1 Crear tipos TypeScript para Product, Category, Ingredient en `entities/product/types.ts`
- [x] 1.2 Crear queryKeys para productos (`productos/all`, `productos/byId`) en `entities/product/queryKeys.ts`
- [x] 1.3 Crear query `useProducts` con filtros (skip, limit, categoria_id, search) en `entities/product/queries.ts`
- [x] 1.4 Crear query `useProduct` para obtener un producto por ID en `entities/product/queries.ts`
- [x] 1.5 Crear barrel export `entities/product/index.ts`

## 2. Widgets de catálogo

- [x] 2.1 Crear `ProductCard` widget: tarjeta con imagen, nombre, precio, categorías, y navegación al detalle
- [x] 2.2 Crear `ProductGrid` widget: cuadrícula responsiva de ProductCards con estados loading (skeleton), empty y error
- [x] 2.3 Crear `CatalogFilters` widget: filtro por categoría (dropdown/chips) con selección/des-selección
- [x] 2.4 Crear `SearchBar` widget: campo de búsqueda con debounce de 300ms
- [x] 2.5 Crear `Pagination` widget: controles de paginación (anterior/siguiente/números)

## 3. Página de Catálogo

- [x] 3.1 Crear `CatalogPage` en `pages/catalogo/CatalogPage.tsx` orquestando widgets y TanStack Query
- [x] 3.2 Manejar filtros vía query params de URL (categoria_id, search, skip, limit)
- [x] 3.3 Sincronizar URL con los filtros activos (push/replace state)

## 4. Página de Detalle de Producto

- [x] 4.1 Crear `ProductDetailPage` en `pages/producto/ProductDetailPage.tsx`
- [x] 4.2 Mostrar imagen, nombre, descripción, precio, categorías (badges) e ingredientes (con indicador de removible)
- [x] 4.3 Manejar estados: loading (skeleton), error (reintentar), not found (404 con volver al catálogo)
- [x] 4.4 Agregar botón "Volver al catálogo"

## 5. Integración con routing y navegación

- [x] 5.1 Agregar rutas `/catalogo` y `/producto/:id` en `app/router.tsx` dentro del AppLayout
- [x] 5.2 Agregar item "Catálogo" en el menú de navegación del AppLayout (primer item, visible para todos los roles y anónimos)
- [x] 5.3 Verificar que el item "Catálogo" se resalta como activo en `/catalogo` y `/producto/:id`

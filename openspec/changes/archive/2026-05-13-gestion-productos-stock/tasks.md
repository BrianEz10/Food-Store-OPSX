## 1. Estructura y routing

- [x] 1.1 Crear directorios: `frontend/src/pages/admin/productos/`, `frontend/src/widgets/product-form/`
- [x] 1.2 Crear barrel exports (`index.ts`) en cada nuevo directorio
- [x] 1.3 Agregar items de navegación en `NAV_ITEMS` para Productos (roles STOCK, ADMIN)
- [x] 1.4 Registrar rutas protegidas en el router: `/admin/productos`, `/admin/productos/nuevo`, `/admin/productos/:id/editar`
- [x] 1.5 Verificar que las rutas se renderizan dentro del AppLayout existente

## 2. ProductListPage — Listado con tabla paginada

- [x] 2.1 Crear `ProductListPage.tsx` con tabla de productos y columnas: nombre, precio, categorías, stock, disponible, acciones
- [x] 2.2 Implementar fetch paginado desde `GET /api/v1/productos` con skip/limit
- [x] 2.3 Agregar campo de búsqueda por nombre con debounce
- [x] 2.4 Implementar paginación (anterior/siguiente + contador de total)
- [x] 2.5 Mostrar skeleton loaders mientras carga la tabla

## 3. Acciones inline en el listado

- [x] 3.1 Implementar toggle de disponibilidad (checkbox) que envía PUT /api/v1/productos/{id} con `disponible` invertido
- [x] 3.2 Implementar botón de editar que navega a `/admin/productos/{id}/editar`
- [x] 3.3 Implementar botón de eliminar con confirmación (`confirm()`) que envía DELETE /api/v1/productos/{id}
- [x] 3.4 Implementar actualización rápida de stock (input inline o pequeño modal) que envía PUT con `stock_cantidad`
- [x] 3.5 Mostrar toast de éxito/error después de cada acción

## 4. ProductFormPage — Formulario crear/editar

- [x] 4.1 Crear `ProductFormPage.tsx` que detecta si es crear o editar por la presencia de `productoId` en la URL
- [x] 4.2 Implementar formulario con campos: nombre, descripción, imagen_url, precio_base, stock_cantidad, disponible
- [x] 4.3 Cargar lista de categorías desde `GET /api/v1/categorias` y mostrar como multi-select
- [x] 4.4 Cargar lista de ingredientes desde `GET /api/v1/ingredientes` y mostrar como tabla con checkbox de removible
- [x] 4.5 En modo edición, precargar todos los campos con datos del producto existente (`GET /api/v1/productos/{id}`)
- [x] 4.6 Implementar validación básica antes de enviar (campos requeridos, precio >= 0)
- [x] 4.7 Implementar envío: POST /api/v1/productos (crear) o PUT /api/v1/productos/{id} (editar)
- [x] 4.8 Redirigir al listado con toast de éxito al completar, o mostrar toast de error si falla

## 5. Verificación

- [x] 5.1 Verificar que `npx tsc --noEmit` compila sin errores
- [x] 5.2 Verificar que todas las rutas admin/productos están protegidas por rol (redirige a /unauthorized para CLIENT/anónimo)
- [x] 5.3 Verificar navegación completa: listado → crear → guardar → listado, listado → editar → guardar → listado
- [x] 5.4 Verificar toggle de disponibilidad y actualización de stock inline

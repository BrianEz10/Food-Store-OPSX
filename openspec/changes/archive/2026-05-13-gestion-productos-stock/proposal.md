## Why

Actualmente los roles STOCK y ADMIN pueden crear y modificar productos solo mediante llamadas directas a la API (Postman, curl, etc.). No existe una interfaz gráfica que permita gestionar el catálogo de productos, controlar el stock y alternar la disponibilidad de forma visual e intuitiva. Sin este cambio, la gestión diaria de productos depende de herramientas externas, lo que ralentiza las operaciones del negocio.

## What Changes

- **Nueva página de listado de productos** (STOCK/ADMIN): tabla con búsqueda, paginación, acciones de editar/eliminar y toggle de disponibilidad
- **Formulario de creación de producto**: campos para nombre, descripción, imagen, precio base, stock inicial, selección de categorías (multi-select) e ingredientes asociados con flag de removible
- **Formulario de edición de producto**: misma estructura que creación pero precargada con datos existentes
- **Panel de control de stock**: actualización rápida de cantidad y toggle de disponibilidad desde el listado
- **Integración con los endpoints existentes**: `POST`, `PUT`, `DELETE /api/v1/productos` protegidos por rol STOCK/ADMIN

## Capabilities

### New Capabilities
- `gestion-stock`: Panel de administración de productos y stock para roles STOCK y ADMIN, con listado, creación, edición, control de stock y toggle de disponibilidad

### Modified Capabilities
- Ninguna. Los cambios son 100% frontend y no alteran contratos de API ni requisitos de especificaciones existentes.

## Impact

- **Frontend**: Nuevo directorio `src/pages/admin/productos/` con `ProductListPage`, `ProductFormPage` y sus variantes de crear/editar. Posible nuevo widget `widgets/product-form/` si el formulario se reutiliza.
- **No breaking changes**: Todos los endpoints existentes mantienen su contrato actual.
- **Navegación**: Se debe agregar la ruta al menú del layout (ya existe `NAV_ITEMS` en `shared/lib/constants.ts`).

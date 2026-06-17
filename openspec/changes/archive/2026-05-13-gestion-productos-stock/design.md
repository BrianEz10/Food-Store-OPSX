## Context

Actualmente el backend expone endpoints CRUD completos para productos (`POST`, `PUT`, `DELETE /api/v1/productos`) protegidos por rol STOCK/ADMIN. El frontend ya cuenta con layout base, sistema de navegación por roles y páginas admin para categorías e ingredientes. Sin embargo, no existe una interfaz para gestionar productos, lo que obliga a STOCK/ADMIN a usar herramientas externas (Postman, curl) para crear y modificar productos.

El proyecto sigue Feature-Sliced Design (FSD) con estructura `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`. Las páginas admin existentes (`pages/admin/categorias/`, `pages/admin/ingredientes/`) sirven como referencia de patrón.

## Goals / Non-Goals

**Goals:**
- Página de listado de productos con tabla, búsqueda, paginación y acciones inline (editar, eliminar, toggle disponible)
- Formulario de creación de producto con todos los campos del schema `ProductoCreate`
- Formulario de edición de producto precargado con datos existentes
- Control rápido de stock desde el listado (actualizar cantidad sin abrir formulario)
- Toggle de disponibilidad inline en el listado
- Protección por rol: solo STOCK y ADMIN pueden acceder
- Registro de rutas en el router protegidas con `RoleBasedRoute`

**Non-Goals:**
- Catálogo público de productos (es el change 07b)
- Vista de detalle de producto para clientes
- Modificaciones al backend o a los contratos de API existentes
- Carga masiva de productos (CSV, etc.)

## Decisions

### 1. Página única con modos crear/editar (no dos páginas separadas)

**Decisión**: Usar una sola página `ProductFormPage` que recibe un `productoId` opcional por URL. Si no hay ID → modo creación. Si hay ID → modo edición con precarga de datos.

**Rationale**: El formulario de crear y editar comparte exactamente los mismos campos y validaciones. Separarlos en dos páginas duplicaría lógica sin beneficio. El patrón ya se usa en las páginas admin existentes.

**Alternativa descartada**: Dos páginas separadas (`CreateProductPage`, `EditProductPage`) — más boilerplate, misma funcionalidad.

### 2. Estado del formulario con Zustand (no TanStack Form)

**Decisión**: Usar estado local de React (`useState`) para el formulario, con validación manual antes de enviar.

**Rationale**: El formulario de producto es de complejidad media (~10 campos incluyendo selects múltiples). Usar TanStack Form agregaría una dependencia extra que no está justificada para un solo formulario. El estado local es más simple y directo. Si en el futuro hay múltiples formularios complejos, se puede reevaluar.

**Alternativa descartada**: TanStack Form — buena herramienta pero sobreingeniería para un solo formulario.

### 3. Multi-select de categorías e ingredientes con fetch desde API

**Decisión**: El formulario carga las listas de categorías e ingredientes desde los endpoints públicos existentes al montarse. Usa checkboxes o un multi-select nativo.

**Rationale**: Las categorías e ingredientes ya tienen endpoints GET públicos. No tiene sentido duplicar estos datos en el frontend. Cargarlos al montar el formulario asegura que siempre estén actualizados.

### 4. Acciones inline en el listado sin modal de confirmación

**Decisión**: La acción de eliminar muestra un mensaje de confirmación tipo `confirm()` nativo del navegador. El toggle de disponibilidad y la actualización rápida de stock se hacen inline sin recargar la página.

**Rationale**: Para un panel de administración interno, los modales complejos agregan fricción innecesaria. `confirm()` es suficiente para evitar eliminaciones accidentales. Los toggles inline dan feedback visual inmediato.

### 5. Ruta anidada bajo `/admin/productos`

**Decisión**: Registrar las rutas como `/admin/productos` (listado) y `/admin/productos/nuevo` / `/admin/productos/:id/editar` (formulario), protegidas con `RoleBasedRoute` para roles STOCK y ADMIN.

**Rationale**: Sigue el patrón de las rutas admin existentes (`/admin/categorias`, `/admin/ingredientes`). Es coherente con la navegación actual.

## Risks / Trade-offs

- **[Riesgo] Formulario con muchos campos** → 10+ campos incluyendo selects múltiples puede ser abrumador. Mitigación: agrupar campos en secciones visuales (información básica, precio/stock, categorías, ingredientes) con espaciado claro.
- **[Trade-off] Sin validación en tiempo real** → La validación solo ocurre al enviar el formulario. Podría mejorar UX con validación por campo al perder foco, pero agrega complejidad. Se deja para una iteración futura si es necesario.
- **[Riesgo] Dependencia de IDs de categorías e ingredientes** → Si se elimina una categoría o ingrediente después de cargar el formulario, el envío fallará. Mitigación: el backend valida y responde con error 422 claro, el frontend muestra el mensaje de error.

## Purpose
Página pública de detalle de producto con información completa incluyendo precio, descripción, categorías e ingredientes.

## Requirements

### Requirement: Página de detalle de producto

El sistema SHALL proveer una página `/producto/:id` que muestre la información completa de un producto obtenida de `GET /api/v1/productos/:id`.

#### Scenario: Visualización completa del producto

- **WHEN** un usuario accede a `/producto/1` y el producto existe
- **THEN** se muestra: imagen del producto (o placeholder), nombre, descripción, precio base, lista de categorías, lista de ingredientes con indicación de cuáles son removibles

#### Scenario: Producto no encontrado

- **WHEN** un usuario accede a `/producto/999` y el producto no existe
- **THEN** se muestra un mensaje "Producto no encontrado" con un botón para volver al catálogo

#### Scenario: Estado de carga

- **WHEN** el detalle del producto se está cargando
- **THEN** se muestra un skeleton con la estructura de la página (imagen placeholder, líneas de texto animadas)

#### Scenario: Error de carga

- **WHEN** el request a `GET /api/v1/productos/:id` falla
- **THEN** se muestra un mensaje de error con botón "Reintentar"

### Requirement: Visualización de ingredientes y categorías

El sistema SHALL mostrar los ingredientes y categorías asociados al producto.

#### Scenario: Ingredientes listados con indicación de removibilidad

- **WHEN** un producto tiene ingredientes asociados
- **THEN** cada ingrediente se muestra con su nombre y un badge o indicador visual si `es_removible=true`

#### Scenario: Producto sin ingredientes

- **WHEN** un producto no tiene ingredientes asociados
- **THEN** se muestra "Sin ingredientes adicionales" o se omite la sección

#### Scenario: Categorías como badges

- **WHEN** un producto tiene categorías asociadas
- **THEN** las categorías se muestran como badges/chips con color y nombre

### Requirement: Navegación de vuelta al catálogo

El sistema SHALL proveer un botón o enlace para volver al catálogo desde la página de detalle.

#### Scenario: Botón volver

- **WHEN** un usuario está en `/producto/:id`
- **THEN** hay un botón "Volver al catálogo" que navega a `/catalogo` preservando el historial del navegador

## Changelog
- 2026-05-13: Created initial spec for catalogo-publico change

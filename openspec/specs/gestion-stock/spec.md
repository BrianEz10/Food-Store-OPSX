# gestion-stock Specification

## Purpose
Definir el panel de administración de productos y stock para los roles STOCK y ADMIN, permitiendo la gestión visual del catálogo de productos, control de existencias y disponibilidad.

## Requirements

### Requirement: Listado de productos con acciones de gestión

El sistema SHALL proveer una página de listado de productos para roles STOCK y ADMIN, con tabla paginada, búsqueda por nombre, y acciones inline para editar, eliminar, toggle de disponibilidad y actualización rápida de stock.

#### Scenario: Listado paginado visible para STOCK/ADMIN
- **WHEN** un usuario con rol STOCK o ADMIN navega a `/admin/productos`
- **THEN** se muestra una tabla paginada con los productos activos, incluyendo columnas: nombre, precio, categorías, stock, disponible, acciones

#### Scenario: Búsqueda por nombre en el listado
- **WHEN** un usuario escribe en el campo de búsqueda y presiona Enter o hace clic en buscar
- **THEN** el listado se filtra mostrando solo productos cuyo nombre contenga el texto buscado

#### Scenario: Toggle de disponibilidad inline
- **WHEN** un usuario hace clic en el toggle de disponible de un producto
- **THEN** se envía una petición PUT actualizando `disponible` al valor opuesto y el toggle se actualiza sin recargar la página

#### Scenario: Actualización rápida de stock
- **WHEN** un usuario hace clic en el botón de stock de un producto
- **THEN** se muestra un campo inline o un pequeño modal para ingresar la nueva cantidad y al confirmar se envía PUT actualizando `stock_cantidad`

#### Scenario: Confirmación antes de eliminar
- **WHEN** un usuario hace clic en eliminar
- **THEN** se muestra un mensaje de confirmación (`confirm()`), y si confirma se envía DELETE /api/v1/productos/{id}

### Requirement: Creación de producto con formulario completo

El sistema SHALL proveer un formulario para crear productos con todos los campos del schema `ProductoCreate`, incluyendo selección múltiple de categorías e ingredientes.

#### Scenario: Formulario con todos los campos
- **WHEN** un usuario navega a `/admin/productos/nuevo`
- **THEN** se muestra un formulario con campos: nombre, descripción, imagen_url, precio_base, stock_cantidad, disponible, selector de categorías (multi-select), y tabla de ingredientes asociados con checkbox de removible

#### Scenario: Carga de opciones de categorías e ingredientes
- **WHEN** el formulario se monta
- **THEN** se cargan las listas de categorías e ingredientes desde los endpoints GET públicos y se muestran como opciones seleccionables

#### Scenario: Creación exitosa
- **WHEN** un usuario completa el formulario y hace clic en "Guardar"
- **THEN** se envía POST /api/v1/productos con los datos, y si es exitoso (HTTP 201) se redirige al listado con un toast de éxito

#### Scenario: Error de validación
- **WHEN** un usuario envía el formulario con datos inválidos (ej. precio negativo)
- **THEN** se muestra un toast de error con el mensaje del backend y el formulario permanece abierto con los datos ingresados

### Requirement: Edición de producto con formulario precargado

El sistema SHALL proveer un formulario de edición que cargue los datos existentes del producto y permita modificarlos, incluyendo reemplazo completo de relaciones M2M.

#### Scenario: Formulario precargado
- **WHEN** un usuario navega a `/admin/productos/{id}/editar`
- **THEN** se muestra el mismo formulario de creación pero con todos los campos precargados con los valores actuales del producto, incluyendo categorías e ingredientes seleccionados

#### Scenario: Edición exitosa
- **WHEN** un usuario modifica campos y hace clic en "Guardar"
- **THEN** se envía PUT /api/v1/productos/{id}, y si es exitoso (HTTP 200) se redirige al listado con un toast de éxito

### Requirement: Protección por rol

El sistema SHALL proteger todas las páginas de gestión de productos bajo los roles STOCK y ADMIN, redirigiendo a `/unauthorized` si el usuario no tiene permisos.

#### Scenario: Acceso permitido para STOCK
- **WHEN** un usuario con rol STOCK navega a `/admin/productos`
- **THEN** la página se renderiza normalmente

#### Scenario: Acceso denegado para CLIENT
- **WHEN** un usuario con rol CLIENT navega a `/admin/productos`
- **THEN** se redirige a `/unauthorized`

## Changelog
- 2026-05-13: Created initial spec for gestion-productos-stock change

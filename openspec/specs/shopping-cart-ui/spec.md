## Purpose
Componentes de UI del carrito de compras: CartDrawer (panel lateral), CartPage (vista completa), badge de cantidad en el header, botón "Agregar al carrito" en catálogo y detalle, personalización de producto por exclusión de ingredientes, y confirmación modal para vaciar el carrito.

## Requirements

### Requirement: CartDrawer — panel lateral del carrito

El sistema SHALL proveer un `CartDrawer` como widget (`src/widgets/cart/`) que se despliegue como panel deslizable desde el lado derecho de la pantalla, mostrando un resumen del carrito.

#### Scenario: Apertura del drawer

- **WHEN** el usuario hace clic en el icono/badge del carrito en el header
- **THEN** el drawer se desliza desde la derecha mostrando: lista de items (imagen, nombre, cantidad, subtotal), total general, y botón "Ver carrito completo"

#### Scenario: Item con exclusiones en el drawer

- **WHEN** un item en el drawer tiene ingredientes excluidos
- **THEN** se muestra un indicador "Personalizado" debajo del nombre del producto

#### Scenario: Carrito vacío en el drawer

- **WHEN** el carrito está vacío y se abre el drawer
- **THEN** se muestra un mensaje "Tu carrito está vacío" con un botón "Ir al catálogo"

#### Scenario: Cierre del drawer

- **WHEN** el usuario hace clic fuera del drawer o en el botón "X"
- **THEN** el drawer se cierra con animación

### Requirement: CartPage — página completa del carrito

El sistema SHALL proveer una página `/carrito` (`src/pages/cart/`) con la vista completa del carrito de compras.

#### Scenario: Vista completa del carrito

- **WHEN** el usuario navega a `/carrito` con items en el carrito
- **THEN** se muestra: lista completa de items (imagen, nombre, precio unitario, cantidad con controles +/-, exclusiones, subtotal), total general, y botón "Proceder al checkout"

#### Scenario: Carrito vacío en la página

- **WHEN** el usuario navega a `/carrito` sin items
- **THEN** se muestra un mensaje "Tu carrito está vacío" con una ilustración y un botón "Explorar productos" que navega a `/catalogo`

#### Scenario: Precios con 2 decimales

- **WHEN** se muestra cualquier precio en la CartPage
- **THEN** los precios se formatean con 2 decimales usando `toFixed(2)` o `Intl.NumberFormat`

### Requirement: Badge de cantidad en el header

El sistema SHALL mostrar un badge con la cantidad total de items del carrito en el icono de carrito del header/navbar.

#### Scenario: Badge se actualiza al modificar carrito

- **WHEN** se agrega, elimina o modifica la cantidad de un item
- **THEN** el badge en el header se actualiza reflejando `itemCount`

#### Scenario: Badge oculto en carrito vacío

- **WHEN** el carrito está vacío (`itemCount === 0`)
- **THEN** el badge no se muestra (oculto)

### Requirement: Botón "Agregar al carrito" en tarjetas del catálogo

El sistema SHALL incluir un botón "Agregar" en cada tarjeta de la cuadrícula del catálogo público (`/catalogo`) que agregue el producto al carrito con cantidad=1.

#### Scenario: Agregar desde el catálogo

- **WHEN** el usuario hace clic en "Agregar" en una tarjeta de producto
- **THEN** el producto se agrega al cartStore con cantidad=1 y sin exclusiones, y se muestra un toast "Producto agregado al carrito"

#### Scenario: Producto ya en carrito desde catálogo

- **WHEN** el usuario hace clic en "Agregar" en un producto que ya está en el carrito
- **THEN** se incrementa la cantidad del item existente y se muestra un toast "Cantidad actualizada"

### Requirement: Personalización de producto al agregar desde detalle

El sistema SHALL permitir al cliente excluir ingredientes removibles al agregar un producto desde la página de detalle (`/producto/:id`).

#### Scenario: Checkboxes de ingredientes removibles

- **WHEN** el usuario está en la página de detalle de un producto con ingredientes removibles
- **THEN** se muestran checkboxes junto a cada ingrediente con `es_removible=true` para que el usuario seleccione cuáles excluir

#### Scenario: Agregar con exclusiones desde el detalle

- **WHEN** el usuario selecciona ingredientes a excluir y hace clic en "Agregar al carrito"
- **THEN** el producto se agrega al cartStore con cantidad=1 y `exclusiones: number[]` conteniendo los IDs de los ingredientes seleccionados

#### Scenario: Sin ingredientes removibles

- **WHEN** el producto no tiene ingredientes o ninguno es removible
- **THEN** no se muestran checkboxes de exclusión y el botón "Agregar al carrito" agrega el producto sin `exclusiones`

### Requirement: Confirmación modal para vaciar carrito

El sistema SHALL mostrar un diálogo de confirmación antes de vaciar el carrito.

#### Scenario: Confirmación de vaciado

- **WHEN** el usuario hace clic en "Vaciar carrito"
- **THEN** se muestra un modal de confirmación con "¿Estás seguro de vaciar el carrito?" y botones "Cancelar" y "Sí, vaciar"

#### Scenario: Vaciado confirmado

- **WHEN** el usuario confirma en el modal
- **THEN** se invoca `clearCart()`, se cierra el modal, los items se eliminan, el total pasa a $0, y se muestra un toast "Carrito vaciado"

## Changelog
- 2026-05-13: Created initial spec for carrito-de-compras change

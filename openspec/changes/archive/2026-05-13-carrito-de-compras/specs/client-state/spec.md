## MODIFIED Requirements

### Requirement: cartStore — Estado del carrito

El sistema SHALL proveer un store Zustand `cartStore` con persistencia en localStorage para gestionar el carrito de compras, incluyendo personalización por exclusión de ingredientes.

#### Scenario: Agregar item

- **WHEN** se invoca `addItem(item)` con un producto nuevo
- **THEN** el item se agrega a la lista con `exclusiones: number[]` y `total` e `itemCount` se recalculan

#### Scenario: Agregar item existente

- **WHEN** se invoca `addItem(item)` con un producto que ya está en el carrito
- **THEN** la cantidad del item existente se incrementa (no se duplica), manteniendo las exclusiones originales del item existente

#### Scenario: Agregar item existente con exclusiones diferentes

- **WHEN** se invoca `addItem(item)` con el mismo producto pero diferentes `exclusiones`
- **THEN** se agrega como un item separado (mismo productoId, exclusiones diferentes = items diferentes)

#### Scenario: Modificar cantidad

- **WHEN** se invoca `updateQuantity(productId, quantity)` con cantidad > 0
- **THEN** la cantidad del item se actualiza y `total` se recalcula

#### Scenario: Modificar cantidad a 0

- **WHEN** se invoca `updateQuantity(productoId, 0)`
- **THEN** el item se elimina del carrito

#### Scenario: Eliminar item

- **WHEN** se invoca `removeItem(productId)`
- **THEN** el item se elimina del carrito y los totales se recalculan

#### Scenario: Vaciar carrito

- **WHEN** se invoca `clearCart()`
- **THEN** `items` se vacía, `total` y `itemCount` son 0

#### Scenario: Persistencia en localStorage

- **WHEN** se modifica el carrito y se recarga la página
- **THEN** el carrito se restaura desde localStorage con los mismos items, cantidades y exclusiones

#### Scenario: Cálculo de total

- **WHEN** se invoca el selector `total`
- **THEN** retorna la suma de `precio * cantidad` de todos los items, con 2 decimales de precisión

#### Scenario: Cálculo de subtotal por item

- **WHEN** se invoca el selector `subtotal(productId)`
- **THEN** retorna `precio * cantidad` del item específico

#### Scenario: Conteo de items

- **WHEN** se invoca el selector `itemCount`
- **THEN** retorna la suma total de cantidades de todos los items

### Requirement: CartItem — Tipo de datos del item del carrito

El sistema SHALL definir el tipo `CartItem` en `shared/types/cart.ts` con los campos necesarios para representar un producto en el carrito.

#### Scenario: Estructura de CartItem

- **WHEN** se inspecciona el tipo `CartItem`
- **THEN** contiene: `productoId: number`, `nombre: string`, `precio: number`, `cantidad: number`, `imagen: string`, `exclusiones: number[]` (IDs de ingredientes excluidos), y opcionalmente `maxCantidad?: number` y `stockDisponible?: boolean`

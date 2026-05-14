## Why

Ahora que tenemos el backend capaz de procesar pedidos atómicamente, necesitamos proveer al usuario la interfaz gráfica (UI) para seleccionar su dirección de entrega, revisar los detalles de su carrito y confirmar la compra. Sin este paso, no hay forma de que los usuarios interactúen con el nuevo motor de pedidos.

## What Changes

- Creación de la página/flujo de Checkout.
- Implementación de la selección de dirección de entrega (usando las direcciones ya guardadas por el usuario).
- Visualización de un resumen de compra final antes de confirmar (precios, envío y totales).
- Conexión con el endpoint `POST /api/v1/pedidos`.
- Pantalla de confirmación de pedido creado exitosamente y vaciado automático del carrito local.

## Capabilities

### New Capabilities
- `checkout-frontend`: Flujo de interfaz de usuario para completar una compra y procesar el pedido.

### Modified Capabilities

## Impact

- **Nuevas Vistas**: Página de Checkout, Página de Éxito/Confirmación de Pedido.
- **Stores**: Integración con `cartStore` (para vaciar tras el éxito) y fetching de direcciones vía TanStack Query.
- **Red**: Consumo del nuevo endpoint de pedidos protegido por auth.

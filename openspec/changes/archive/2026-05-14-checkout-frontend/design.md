## Context

El flujo de compras requiere una interfaz clara para revisar lo que el usuario está a punto de adquirir. El carrito actualmente vive en Zustand y `localStorage`. Al ir al Checkout, se deben combinar los datos del carrito con la selección de la dirección de entrega y enviar un payload al backend.

## Goals / Non-Goals

**Goals:**
- Presentar un flujo intuitivo para confirmar dirección y enviar pedido.
- Limpiar el estado del carrito inmediatamente después de la confirmación exitosa.
- Manejar los errores transaccionales (e.g., producto sin stock) devueltos por el backend con notificaciones claras (Toasts).

**Non-Goals:**
- No implementar integración con la pasarela de pago (MercadoPago se implementará en el Change 10). El pedido quedará en estado `PENDIENTE`.

## Decisions

1. **Estructura de la página:** Una vista principal `/checkout` que mostrará las direcciones del usuario (permitiendo seleccionar una) y el resumen de la orden a un lado.
2. **Mutación de Pedidos:** Uso de `useMutation` de TanStack Query para llamar al endpoint `POST /api/v1/pedidos` armando el schema esperado por el backend.
3. **Vaciado del Carrito:** Al resolverse exitosamente la promesa de creación del pedido, se invocará `clearCart()` en el `cartStore` y se redirigirá a `/checkout/success/:id`.

## Risks / Trade-offs

- **[Risk]** El usuario no tiene direcciones cargadas en su cuenta.
  → **Mitigación**: Mostrar un botón prominente "Agregar Dirección" que redirija al perfil o abra un modal para cargar una.

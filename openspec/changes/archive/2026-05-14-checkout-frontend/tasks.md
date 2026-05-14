## 1. Servicios y API

- [x] 1.1 Crear funciones en `src/services/pedidos.ts` (en frontend) para conectar con el backend (`POST /api/v1/pedidos`).
- [x] 1.2 Implementar hook custom `useCreatePedido` usando `useMutation` de TanStack Query.

## 2. Componentes UI y Vistas

- [x] 2.1 Armar la estructura básica de `CheckoutPage.tsx` con grid de 2 columnas (formulario/selección de dirección y resumen de orden).
- [x] 2.2 Reutilizar el hook de obtención de direcciones del usuario para mostrarlas como opciones seleccionables.
- [x] 2.3 Mostrar el resumen del carrito (lista de items, subtotales, costo de envío fijo y total final).

## 3. Integración y Lógica de Negocio

- [x] 3.1 Armar el payload a partir de `cartStore` y la dirección seleccionada, transformando los items al schema requerido.
- [x] 3.2 Conectar la mutación al botón "Confirmar Pedido", mostrando spinner/estado de loading y bloqueando el submit.
- [x] 3.3 En caso de éxito de la mutación, invocar `clearCart()` en el store y redirigir a `/checkout/success/:pedido_id`.
- [x] 3.4 Capturar y mostrar errores del backend (e.g., falta de stock) usando notificaciones (react-hot-toast o similar).

## 4. Pantalla Post-Checkout

- [x] 4.1 Crear la vista `CheckoutSuccessPage.tsx` agradeciendo la compra y mostrando el ID del pedido generado.
- [x] 4.2 Agregar las rutas protegidas correspondientes en el enrutador (`/checkout` y `/checkout/success/:id`).

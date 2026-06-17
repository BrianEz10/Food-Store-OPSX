## Why

Los pedidos que crea el sistema actualmente quedan en estado `PENDIENTE` indefinidamente porque no existe un mecanismo de pago real. Para monetizar la plataforma y activar el flujo completo de negocio (PENDIENTE → CONFIRMADO), necesitamos integrar MercadoPago como pasarela de cobro. Sin esto, la FSM de pedidos (Change 11a) no tiene su disparador principal (el webhook de pago aprobado).

## What Changes

- Creación de un módulo `pagos/` en el backend que se comunica con la API de MercadoPago para generar preferencias de pago.
- Webhook IPN/Notifications que recibe el resultado del pago con idempotencia garantizada por `idempotency_key`.
- Endpoint de consulta de estado de pago para polling desde el frontend.
- Soporte para reintentar pagos rechazados.
- Integración del SDK `@mercadopago/sdk-react` en el frontend con componente `CardPayment` embebido (tokenización PCI SAQ-A).
- Páginas de retorno: `/pago/success`, `/pago/failure`, `/pago/pending`.

## Capabilities

### New Capabilities
- `payment-processing`: Flujo completo de procesamiento de pagos: creación de orden MP, recepción de webhook IPN, consulta de estado y reintento.

### Modified Capabilities
- `pedidos-backend`: El módulo de pedidos agrega el campo `pago_id` / `pago_estado` para vincular un pedido a su transacción de pago (delta spec).

## Impact

- **Backend**: Nuevo módulo `backend/app/modules/pagos/` con router, service, schemas y modelo de persistencia `Pago`.
- **Frontend**: Nuevo `paymentStore` (Zustand) + páginas de checkout de pago (`/pago/success`, `/pago/failure`, `/pago/pending`) + flujo embebido con `@mercadopago/sdk-react`.
- **Variables de entorno**: `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `MP_PUBLIC_KEY` requeridas.
- **Dependencias externas**: SDK de MercadoPago, HTTPS para webhooks (requiere túnel tipo ngrok en local).

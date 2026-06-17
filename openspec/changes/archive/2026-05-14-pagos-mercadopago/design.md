## Context

MercadoPago ofrece dos superficies de integración relevantes para este proyecto:

1. **Checkout Pro (redirect)**: El usuario sale de la app y paga en MP. Simple pero baja conversión.
2. **Checkout Bricks / CardPayment (embebido)**: El formulario de tarjeta queda dentro de nuestra app. MP se encarga de la tokenización PCI SAQ-A. **Esta es la elegida.**

El flujo es: el backend crea una "preferencia" en MP → el frontend embebe el Brick → el usuario paga → MP notifica via webhook → el backend procesa y transiciona el estado del pedido.

## Goals / Non-Goals

**Goals:**
- Implementar el flujo de cobro completo: preferencia → brick → webhook → transición de estado.
- Garantizar idempotencia en el webhook (mismo evento procesado N veces = mismo resultado).
- Soportar los tres resultados de pago: `approved`, `rejected`, `pending`/`in_process`.
- Permitir reintento de pago para pedidos con estado `rejected`.

**Non-Goals:**
- No se implementa split de pago (marketplace).
- No se implementa devolución (refund) — queda para un change posterior.
- El SDK de MercadoPago maneja la seguridad PCI; no tocamos datos de tarjeta en nuestros servidores.

## Architecture

### Modelo de Datos: `Pago`

```
pagos
  id              UUID PK (= idempotency_key)
  pedido_id       FK → pedidos
  mp_payment_id   VARCHAR nullable (ID de MP, llega en webhook)
  mp_preference_id VARCHAR
  estado          ENUM: pending | approved | rejected | in_process | cancelled
  monto           DECIMAL(10,2)
  creado_en       TIMESTAMPTZ
  actualizado_en  TIMESTAMPTZ
```

### Flujo Backend

1. `POST /api/v1/pagos/{pedido_id}` — Crea preferencia MP, inserta `Pago` en BD con `estado=pending`, devuelve `preference_id` y `init_point`.
2. `POST /api/v1/pagos/webhook` — Recibe IPN de MP. Valida firma (`x-signature` header). Consulta estado real a MP API. Actualiza `Pago`. Si `approved`, llama a `FSMService.transition(pedido, CONFIRMADO)`.
3. `GET /api/v1/pagos/{pedido_id}/estado` — Devuelve estado actual del pago (para polling del frontend).

### Flujo Frontend

1. En `CheckoutPage`, luego de confirmar pedido (estado PENDIENTE), llamamos `POST /pagos/{id}` para obtener el `preference_id`.
2. Embebemos `<CardPayment>` de `@mercadopago/sdk-react` pasándole el `publicKey` (env var `VITE_MP_PUBLIC_KEY`).
3. Al procesar el pago, MP redirige a `/pago/success?payment_id=...`, `/pago/failure?...` o `/pago/pending?...`.
4. Esas páginas hacen polling a `GET /pagos/{pedido_id}/estado` hasta confirmar y redirigen al resumen del pedido.

### Idempotencia del Webhook

El `id` del `Pago` es un UUID generado por nosotros al crear la preferencia (actúa como `X-Idempotency-Key`). Al llegar el webhook:
- Si `mp_payment_id` ya está registrado con el mismo estado → skip.
- Si el estado cambia → update y disparar side-effects.

## Decisions

1. **Embebido > Redirect**: Mejor UX, misma seguridad PCI con Bricks.
2. **UUID como idempotency key**: Generado en backend al crear la preferencia, enviado a MP como `external_reference`. Así el webhook puede correlacionar sin depender del orden de llegada.
3. **Polling vs WebSocket**: Para simplificar, el frontend usa polling con intervalo de 2s (máx 30s) en las páginas de retorno. WebSocket se puede agregar después.

## Risks / Trade-offs

- **[Risk]** El webhook necesita URL pública. En desarrollo local requiere ngrok/tunnel.
  → **Mitigación**: Documentar setup de tunnel en README; el `GET /estado` permite verificar manualmente también.
- **[Risk]** MP puede enviar el webhook antes de que el usuario llegue a la página de retorno.
  → **Mitigación**: Las páginas de retorno hacen polling, no dependen del timing del webhook.

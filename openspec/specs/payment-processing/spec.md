## Purpose
Este documento define los requisitos para el procesamiento de pagos integrados con MercadoPago.
## Requirements
### Requirement: Payment Initiation
The system SHALL allow a user with an order in `PENDIENTE` state to initiate a payment via MercadoPago.

#### Scenario: Creating a payment preference
- **WHEN** the user confirms checkout and a `pedido` is created in `PENDIENTE` state
- **THEN** the backend creates a MercadoPago preference and stores a `Pago` record with `estado=pending`
- **THEN** the frontend receives the `preference_id` and renders the embedded CardPayment Brick

#### Scenario: Payment approved
- **WHEN** MercadoPago sends a webhook notification with `status=approved`
- **THEN** the backend validates the webhook signature
- **THEN** the `Pago` record is updated to `estado=approved`
- **THEN** the webhook handler invokes the Order FSM to transition the order from `PENDIENTE` to `CONFIRMADO`

#### Scenario: Payment rejected
- **WHEN** MercadoPago sends a webhook notification with `status=rejected`
- **THEN** the `Pago` record is updated to `estado=rejected`
- **THEN** the order remains in `PENDIENTE` state
- **THEN** the user is shown a retry option on the failure page

#### Scenario: Idempotent webhook processing
- **WHEN** the same webhook event is received multiple times
- **THEN** the system processes it only once (idempotency via `mp_payment_id` deduplication)
- **THEN** subsequent identical events are silently ignored

### Requirement: Payment Status Query
The system SHALL expose an endpoint to query the current payment status for a given order.

#### Scenario: Polling payment status
- **WHEN** the frontend polls `GET /api/v1/pagos/{pedido_id}/estado`
- **THEN** the backend returns the current payment state and order state

### Requirement: Payment Retry
The system SHALL allow users to retry a rejected payment for an order still in `PENDIENTE` state.

#### Scenario: Retrying a rejected payment
- **WHEN** the user navigates to the failure page with a rejected payment
- **THEN** a "Reintentar pago" button is available
- **THEN** clicking it creates a new `Pago` record and renders a fresh CardPayment Brick


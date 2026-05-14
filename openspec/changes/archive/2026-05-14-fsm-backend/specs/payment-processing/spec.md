## MODIFIED Requirements

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

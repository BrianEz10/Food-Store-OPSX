## Purpose
Este documento define los requisitos para la creación y persistencia atómica de pedidos en el backend.
## Requirements
### Requirement: Atomic Order Creation
The system SHALL create an order atomically, ensuring that the stock is validated and deducted within a single transaction, and creating all necessary records (order, details, and initial state history).

#### Scenario: Successful order creation with sufficient stock
- **WHEN** an authenticated user submits a valid order request with products that have sufficient stock
- **THEN** the system creates the order, details, and history records
- **THEN** the stock of the selected products is decremented
- **THEN** the order is saved with `PENDIENTE` state and snapshots of current prices and delivery address

#### Scenario: Order creation failure due to insufficient stock
- **WHEN** a user submits an order request where one or more products do not have sufficient stock
- **THEN** the system aborts the transaction
- **THEN** an error is returned indicating which products are out of stock
- **THEN** no changes are persisted to the database

#### Scenario: Order creation concurrency control
- **WHEN** multiple concurrent requests attempt to buy the last available unit of a product
- **THEN** the system uses row-level locks to process requests sequentially
- **THEN** only the first request succeeds and subsequent requests fail with an insufficient stock error

### Requirement: Snapshots for Immutability
The system SHALL capture the state of volatile information at the moment of purchase to prevent historical orders from changing if product prices or user addresses change.

#### Scenario: Price snapshot capture
- **WHEN** an order detail is created
- **THEN** the current product price is stored independently as `precio_snapshot`

#### Scenario: Address snapshot capture
- **WHEN** an order is created
- **THEN** the full address information (street, city, zip code) is serialized and stored as `direccion_snapshot`

### Requirement: Historical Endpoints and Manual Transitions
The system SHALL expose endpoints to fetch the history of an order and to allow authorized roles to manually transition the state of an order.

#### Scenario: Fetching order history
- **WHEN** an authorized user requests the history of a specific order
- **THEN** the system returns a list of history records ordered by timestamp (oldest first or newest first consistently)

#### Scenario: Authorized manual state transition
- **WHEN** a user with the `GESTOR` or `ADMIN` role requests to transition an order's state manually
- **THEN** the system invokes the FSM to validate and execute the transition
- **THEN** a success response is returned with the new state

#### Scenario: Unauthorized manual state transition
- **WHEN** a regular user (e.g., `CLIENTE`) requests to transition an order's state (other than possible self-cancellations if allowed, but generally not allowed)
- **THEN** the system returns a 403 Forbidden error


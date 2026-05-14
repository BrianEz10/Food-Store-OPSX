# order-fsm Specification

## Purpose
TBD - created by archiving change fsm-backend. Update Purpose after archive.
## Requirements
### Requirement: Finite State Machine (FSM) Core
The system SHALL strictly enforce the order lifecycle through a predefined state transition map.

#### Scenario: Valid state transition
- **WHEN** a transition is requested from a valid current state to a valid next state (e.g., `PENDIENTE` to `CONFIRMADO`)
- **THEN** the system updates the order's state
- **THEN** an entry is created in the order history table

#### Scenario: Invalid state transition
- **WHEN** a transition is requested to a state not allowed by the transition map (e.g., `PENDIENTE` to `ENTREGADO`)
- **THEN** the system rejects the operation
- **THEN** an error indicating an invalid transition is returned
- **THEN** no changes are persisted to the database

### Requirement: Append-Only History Logging
Every state change SHALL be recorded immutably in the order history.

#### Scenario: Logging a successful transition
- **WHEN** the FSM executes a successful transition
- **THEN** an append-only insert is made into the history table
- **THEN** the record includes the old state, the new state, a timestamp, and an optional reason

### Requirement: Order Cancellation and Stock Restoration
The system SHALL handle order cancellations by restoring the previously deducted stock.

#### Scenario: Canceling an order
- **WHEN** an order is transitioned to `CANCELADO`
- **THEN** the order state is updated
- **THEN** the stock of all associated products is incremented by the purchased quantities
- **THEN** the transition and reasoning are recorded in the history table


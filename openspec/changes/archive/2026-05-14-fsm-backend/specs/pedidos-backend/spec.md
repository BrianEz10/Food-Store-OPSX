## ADDED Requirements

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

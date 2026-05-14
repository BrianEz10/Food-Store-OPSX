## ADDED Requirements

### Requirement: Order Checkout Flow
The system SHALL provide a checkout interface allowing users to select a delivery address and confirm their order.

#### Scenario: Successful checkout submission
- **WHEN** the user selects a delivery address and clicks "Confirm Order"
- **THEN** a POST request is sent to the backend with the address and cart items
- **THEN** upon success, the cart is automatically emptied
- **THEN** the user is redirected to a success screen displaying their order number

#### Scenario: Checkout with missing address
- **WHEN** the user attempts to confirm the order without selecting an address
- **THEN** the system prevents submission and prompts the user to select or add an address

#### Scenario: Handling backend validation errors
- **WHEN** the backend returns an error (e.g., insufficient stock)
- **THEN** the user is notified with a clear error message describing the issue
- **THEN** the user remains on the checkout page to adjust their cart or retry

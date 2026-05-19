## ADDED Requirements

### Requirement: Global Visual Identity
The system SHALL implement the "Vivid Modernity" visual identity across all screens.

#### Scenario: Color Palette Applied
- **WHEN** any UI component renders
- **THEN** it strictly uses colors from the Vivid Modernity palette (Primary: `#b3193d`, Secondary: `#6d4e9f`, Tertiary: `#006a42`, Surface: `#fff8f7`)

#### Scenario: Typography Applied
- **WHEN** text is displayed on any screen
- **THEN** headlines are rendered in `Outfit` (font-weight 600-700) and body/labels in `Inter` (font-weight 400-600)

#### Scenario: Radius Tokens Applied
- **WHEN** rendering structural boundaries
- **THEN** cards/inputs use 8px radius, modals use 12px radius, and chips use full (9999px) radius

### Requirement: Unified Base Layout
The system SHALL provide a unified base layout wrapper for all authenticated and unauthenticated application pages, excluding dedicated Auth pages (Login/Register).

#### Scenario: Base Layout Elements
- **WHEN** a user navigates to an app page (e.g., HomePage, DashboardPage)
- **THEN** the layout renders a lightweight top Header and a collapsible Aside panel

#### Scenario: Header Functionality
- **WHEN** the Header is rendered
- **THEN** it contains a toggle for the Aside, a search bar, a dark mode toggle, a cart shortcut, and a user profile shortcut

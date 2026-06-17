## MODIFIED Requirements

### Requirement: HomePage y DashboardPage

El sistema SHALL reemplazar los placeholders inline del router con componentes de página dedicados.

#### Scenario: HomePage muestra mensaje de bienvenida

- **WHEN** un usuario accede a `/`
- **THEN** se renderiza `HomePage` con una landing page completa y dinámica estructurada con Hero, Categorías, Platos del Día, Promociones y un Footer, integrada dentro de la estructura de AppLayout

#### Scenario: DashboardPage placeholder

- **WHEN** un usuario con rol ADMIN/STOCK/PEDIDOS accede a `/dashboard`
- **THEN** se renderiza `DashboardPage` con un placeholder (funcionalidad real en Change 13)

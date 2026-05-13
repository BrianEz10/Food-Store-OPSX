## ADDED Requirements

### Requirement: AppLayout responsive con sidebar y bottom nav

El sistema SHALL proveer un componente `AppLayout` que encapsule la estructura visual principal de la aplicación, con navegación persistente adaptada al tamaño de pantalla.

#### Scenario: Sidebar visible en desktop

- **WHEN** el viewport es ≥ 768px
- **THEN** se muestra una sidebar vertical fija en el lado izquierdo con los items de navegación, colapsable mediante un toggle que reduce la sidebar a solo iconos

#### Scenario: Bottom nav visible en mobile

- **WHEN** el viewport es < 768px
- **THEN** se muestra una barra de navegación inferior fija (bottom nav) con máximo 5 items visibles y un item "Más" para overflow

#### Scenario: Header con información de usuario

- **WHEN** el usuario está autenticado y cualquier página se renderiza dentro del layout
- **THEN** el header muestra: logo/nombre de la app, nombre del usuario autenticado, y botón de logout

#### Scenario: Header sin información de usuario

- **WHEN** el usuario NO está autenticado y la página se renderiza dentro del layout
- **THEN** el header muestra solo el logo/nombre de la app y botones de Login/Register

#### Scenario: Outlet para contenido

- **WHEN** cualquier ruta hijo se renderiza dentro del layout
- **THEN** el contenido se renderiza en un `<main>` con padding consistente, ubicado entre el header y la navegación inferior (mobile) o al lado de la sidebar (desktop)

### Requirement: Menú de navegación por roles

El sistema SHALL proporcionar un sistema de navegación que filtre los items del menú según los roles del usuario autenticado.

#### Scenario: Items visibles para CLIENT

- **WHEN** un usuario con rol `CLIENT` está autenticado
- **THEN** el menú muestra: Inicio, Mi Perfil, Mis Direcciones

#### Scenario: Items visibles para STOCK

- **WHEN** un usuario con rol `STOCK` está autenticado
- **THEN** el menú muestra: Inicio, Categorías, Ingredientes, Dashboard

#### Scenario: Items visibles para PEDIDOS

- **WHEN** un usuario con rol `PEDIDOS` está autenticado
- **THEN** el menú muestra: Inicio, Dashboard

#### Scenario: Items visibles para ADMIN

- **WHEN** un usuario con rol `ADMIN` está autenticado
- **THEN** el menú muestra: Inicio, Dashboard, Categorías, Ingredientes, Usuarios

#### Scenario: Items visibles para usuarios anónimos

- **WHEN** el usuario no está autenticado
- **THEN** el menú muestra solo Inicio

#### Scenario: Item activo resaltado

- **WHEN** el usuario navega a una ruta
- **THEN** el item de navegación correspondiente se muestra visualmente como activo (color, weight, indicador)

### Requirement: Navegación estructurada con layout routes

El sistema SHALL organizar el enrutamiento usando layout routes de React Router v7, con rutas públicas fuera del layout y rutas protegidas dentro del layout.

#### Scenario: Rutas públicas sin layout

- **WHEN** un usuario accede a `/login` o `/register`
- **THEN** la página se renderiza sin AppLayout (sin sidebar, header ni bottom nav)

#### Scenario: Rutas protegidas dentro del layout

- **WHEN** un usuario autenticado accede a `/perfil`, `/mis-direcciones`, `/admin/*`, `/dashboard`
- **THEN** la página se renderiza dentro de AppLayout con navegación persistente

#### Scenario: Ruta /unauthorized

- **WHEN** un usuario sin permisos intenta acceder a una ruta restringida
- **THEN** se redirige a `/unauthorized` que muestra un mensaje de acceso denegado con un botón para volver al inicio

#### Scenario: Ruta 404

- **WHEN** un usuario accede a una ruta que no existe
- **THEN** se renderiza una página 404 con mensaje y botón para volver al inicio

### Requirement: HomePage y DashboardPage

El sistema SHALL reemplazar los placeholders inline del router con componentes de página dedicados.

#### Scenario: HomePage muestra mensaje de bienvenida

- **WHEN** un usuario accede a `/`
- **THEN** se renderiza `HomePage` con un mensaje de bienvenida y resumen básico del sistema

#### Scenario: DashboardPage placeholder

- **WHEN** un usuario con rol ADMIN/STOCK/PEDIDOS accede a `/dashboard`
- **THEN** se renderiza `DashboardPage` con un placeholder (funcionalidad real en Change 13)

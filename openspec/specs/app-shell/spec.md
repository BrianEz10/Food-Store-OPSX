## Purpose
Definir el layout principal de la aplicación con navegación responsive, menú adaptado por rol y estructura de routing.
## Requirements
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
- **THEN** el menú muestra: Catálogo, Inicio, Mi Perfil, Mis Direcciones

#### Scenario: Items visibles para STOCK

- **WHEN** un usuario con rol `STOCK` está autenticado
- **THEN** el menú muestra: Catálogo, Inicio, Categorías, Ingredientes, Dashboard

#### Scenario: Items visibles para PEDIDOS

- **WHEN** un usuario con rol `PEDIDOS` está autenticado
- **THEN** el menú muestra: Catálogo, Inicio, Dashboard

#### Scenario: Items visibles para ADMIN

- **WHEN** un usuario con rol `ADMIN` está autenticado
- **THEN** el menú muestra: Catálogo, Inicio, Dashboard, Categorías, Ingredientes, Usuarios

#### Scenario: Items visibles para usuarios anónimos

- **WHEN** el usuario no está autenticado
- **THEN** el menú muestra: Catálogo, Inicio

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
- **THEN** se renderiza `HomePage` con una landing page completa y dinámica estructurada con Hero, Categorías, Platos del Día, Promociones y un Footer, integrada dentro de la estructura de AppLayout

#### Scenario: DashboardPage placeholder

- **WHEN** un usuario con rol ADMIN/STOCK/PEDIDOS accede a `/dashboard`
- **THEN** se renderiza `DashboardPage` con un placeholder (funcionalidad real en Change 13)

### Requirement: Rutas públicas del catálogo

El sistema SHALL incluir las rutas `/catalogo` y `/producto/:id` como rutas públicas dentro del AppLayout, accesibles por cualquier usuario.

#### Scenario: Ruta /catalogo accesible públicamente

- **WHEN** cualquier usuario (autenticado o no) accede a `/catalogo`
- **THEN** la página se renderiza dentro de AppLayout con la navegación persistente

#### Scenario: Ruta /producto/:id accesible públicamente

- **WHEN** cualquier usuario accede a `/producto/5`
- **THEN** la página se renderiza dentro de AppLayout con la navegación persistente

### Requirement: Enlace "Catálogo" en el menú de navegación

El sistema SHALL incluir el enlace "Catálogo" como item en el menú de navegación del AppLayout, visible para todos los roles (incluyendo usuarios anónimos).

#### Scenario: Item visible para todos los roles

- **WHEN** un usuario con cualquier rol (CLIENT, STOCK, PEDIDOS, ADMIN) o sin autenticar ve el menú
- **THEN** el item "Catálogo" aparece como opción en la navegación

#### Scenario: Item activo resaltado

- **WHEN** el usuario está en `/catalogo` o `/producto/:id`
- **THEN** el item "Catálogo" se muestra visualmente como activo

## Changelog
- 2026-05-13: Created initial spec for navegacion-layout-base change
- 2026-05-13: Added catalog routes and nav item for catalogo-publico change

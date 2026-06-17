## ADDED Requirements

### Requirement: Ruta /catalogo en el router

El sistema SHALL agregar la ruta `/catalogo` como ruta pública dentro del AppLayout (visible para todos los usuarios, autenticados o no).

#### Scenario: Ruta /catalogo accesible públicamente

- **WHEN** cualquier usuario (autenticado o no) accede a `/catalogo`
- **THEN** la página se renderiza dentro de AppLayout con la navegación persistente

### Requirement: Ruta /producto/:id en el router

El sistema SHALL agregar la ruta `/producto/:id` como ruta pública dentro del AppLayout.

#### Scenario: Ruta /producto/:id accesible públicamente

- **WHEN** cualquier usuario accede a `/producto/5`
- **THEN** la página se renderiza dentro de AppLayout con la navegación persistente

### Requirement: Enlace "Catálogo" en el menú de navegación

El sistema SHALL agregar el enlace "Catálogo" como primer item en el menú de navegación del AppLayout, visible para todos los roles (incluyendo usuarios anónimos).

#### Scenario: Item visible para todos los roles

- **WHEN** un usuario con cualquier rol (CLIENT, STOCK, PEDIDOS, ADMIN) o sin autenticar ve el menú
- **THEN** el item "Catálogo" aparece como primera opción en la navegación

#### Scenario: Item activo resaltado

- **WHEN** el usuario está en `/catalogo` o `/producto/:id`
- **THEN** el item "Catálogo" se muestra visualmente como activo

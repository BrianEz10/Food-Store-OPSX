## ADDED Requirements

### Requirement: Catálogo público con cuadrícula de productos

El sistema SHALL proveer una página `/catalogo` que muestre los productos disponibles en una cuadrícula responsiva, conectada al endpoint `GET /api/v1/productos` con paginación y filtros.

#### Scenario: Vista inicial del catálogo

- **WHEN** un usuario accede a `/catalogo` sin parámetros de filtro
- **THEN** se muestran los primeros productos (paginación por defecto) en una cuadrícula, cada tarjeta con: imagen, nombre, rango de precio, y etiquetas de categorías

#### Scenario: Paginación funciona correctamente

- **WHEN** un usuario hace clic en "Siguiente" o un número de página
- **THEN** se cargan los productos de la página correspondiente usando `GET /api/v1/productos?skip=<offset>&limit=<pageSize>` y se actualiza la UI

#### Scenario: Cuadrícula responsiva

- **WHEN** el catálogo se renderiza en distintos viewports
- **THEN** se muestran 1 columna en mobile (< 640px), 2 en tablet (640-1024px) y 3-4 en desktop (> 1024px) usando Tailwind grid

#### Scenario: Estado vacío

- **WHEN** no hay productos disponibles o el filtro no devuelve resultados
- **THEN** se muestra un mensaje "No hay productos disponibles" con una ilustración o icono

#### Scenario: Estado de carga

- **WHEN** los productos se están cargando
- **THEN** se muestran skeletons (placeholders animados) en lugar de las tarjetas

#### Scenario: Error de carga

- **WHEN** el request a `GET /api/v1/productos` falla
- **THEN** se muestra un mensaje de error con un botón "Reintentar"

### Requirement: Filtro por categoría en el catálogo

El sistema SHALL permitir filtrar productos por categoría mediante un selector visual (dropdown, chips, o sidebar de categorías).

#### Scenario: Selección de categoría

- **WHEN** un usuario selecciona una categoría del filtro
- **THEN** se envía `GET /api/v1/productos?categoria_id=<id>` y se actualiza la cuadrícula con los productos de esa categoría

#### Scenario: Limpiar filtro

- **WHEN** un usuario deselecciona la categoría activa
- **THEN** se vuelven a mostrar todos los productos sin filtro de categoría

#### Scenario: Categoría sin productos

- **WHEN** un usuario selecciona una categoría que no tiene productos
- **THEN** se muestra el estado vacío con mensaje "No hay productos en esta categoría"

### Requirement: Búsqueda por nombre en el catálogo

El sistema SHALL proveer un campo de búsqueda textual que filtre productos por nombre usando `GET /api/v1/productos?search=<query>`.

#### Scenario: Búsqueda exitosa

- **WHEN** un usuario escribe "hamburguesa" en el campo de búsqueda y presiona Enter o hace clic en buscar
- **THEN** se envía `GET /api/v1/productos?search=hamburguesa` y se muestran los resultados coincidentes

#### Scenario: Búsqueda sin resultados

- **WHEN** un usuario busca un término que no coincide con ningún producto
- **THEN** se muestra "No se encontraron productos para '<término>'"

#### Scenario: Limpiar búsqueda

- **WHEN** un usuario borra el texto del campo de búsqueda
- **THEN** se restablece la vista completa del catálogo sin filtro de búsqueda

#### Scenario: Debounce en búsqueda

- **WHEN** un usuario escribe en el campo de búsqueda
- **THEN** el request no se dispara hasta que haya dejado de escribir por 300ms (debounce)

### Requirement: Navegación al detalle del producto

El sistema SHALL permitir hacer clic en una tarjeta de producto para navegar a `/producto/:id`.

#### Scenario: Clic en tarjeta navega al detalle

- **WHEN** un usuario hace clic en una tarjeta de producto
- **THEN** se navega a `/producto/<id>` mediante React Router

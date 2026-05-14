# order-visualization Specification

## Purpose
TBD - created by archiving change visualizacion-pedidos. Update Purpose after archive.
## Requirements
### Requirement: Listado de pedidos del cliente
El sistema SHALL permitir a un usuario autenticado con rol `CLIENT` listar sus propios pedidos con paginación, filtro por estado y ordenación por fecha descendente. La respuesta SHALL incluir `data` (array de items), `total` (int), `skip` (int) y `limit` (int).

#### Scenario: Cliente lista sus pedidos sin filtros
- **WHEN** un usuario `CLIENT` hace `GET /api/v1/pedidos` sin parámetros
- **THEN** el sistema retorna los primeros 20 pedidos del usuario ordenados por `creado_en` descendente, con `total` igual a la cantidad total de pedidos del usuario

#### Scenario: Cliente filtra pedidos por estado
- **WHEN** un usuario `CLIENT` hace `GET /api/v1/pedidos?estado=CONFIRMADO`
- **THEN** el sistema retorna solo los pedidos del usuario en estado `CONFIRMADO`

#### Scenario: Cliente pagina resultados
- **WHEN** un usuario `CLIENT` hace `GET /api/v1/pedidos?skip=20&limit=10`
- **THEN** el sistema retorna los pedidos 21-30 del usuario

#### Scenario: Cliente ve pedidos vacío
- **WHEN** un usuario `CLIENT` sin pedidos hace `GET /api/v1/pedidos`
- **THEN** el sistema retorna `{ "data": [], "total": 0, "skip": 0, "limit": 20 }`

### Requirement: Listado global de pedidos para staff
El sistema SHALL permitir a usuarios con rol `GESTOR` o `ADMIN` listar TODOS los pedidos del sistema con los mismos filtros y paginación. Además SHALL poder filtrar por `usuario_id`.

#### Scenario: Gestor lista todos los pedidos
- **WHEN** un usuario `GESTOR` hace `GET /api/v1/pedidos`
- **THEN** el sistema retorna pedidos de TODOS los usuarios, no solo los del gestor

#### Scenario: Staff filtra por usuario específico
- **WHEN** un usuario `ADMIN` hace `GET /api/v1/pedidos?usuario_id=5`
- **THEN** el sistema retorna solo los pedidos del usuario con id=5

#### Scenario: Cliente no puede ver pedidos de otros
- **WHEN** un usuario `CLIENT` hace `GET /api/v1/pedidos?usuario_id=999`
- **THEN** el sistema IGNORA el filtro `usuario_id` y retorna solo los pedidos del cliente autenticado

### Requirement: Detalle de pedido
El sistema SHALL exponer `GET /api/v1/pedidos/{pedido_id}` que retorne el detalle completo del pedido: datos del pedido, items con snapshots, historial de estados, y estado del pago asociado.

#### Scenario: Cliente ve detalle de su propio pedido
- **WHEN** un usuario `CLIENT` hace `GET /api/v1/pedidos/1` y el pedido 1 le pertenece
- **THEN** el sistema retorna `PedidoDetailResponse` con pedido, detalles, historial y estado del pago

#### Scenario: Cliente no puede ver detalle de pedido ajeno
- **WHEN** un usuario `CLIENT` hace `GET /api/v1/pedidos/2` y el pedido 2 NO le pertenece
- **THEN** el sistema retorna `403 Forbidden`

#### Scenario: Staff puede ver cualquier detalle
- **WHEN** un usuario `GESTOR` hace `GET /api/v1/pedidos/2`
- **THEN** el sistema retorna el detalle del pedido 2 aunque no sea de su propiedad

#### Scenario: Pedido inexistente
- **WHEN** cualquier usuario hace `GET /api/v1/pedidos/99999`
- **THEN** el sistema retorna `404 Not Found`

### Requirement: Badge visual de estado
El frontend SHALL mostrar el estado del pedido con un badge coloreado según el estado. Los colores SHALL ser:
- `PENDIENTE` → gris/neutral
- `CONFIRMADO` → azul
- `EN_PREP` → amarillo/ámbar
- `EN_CAMINO` → naranja
- `ENTREGADO` → verde
- `CANCELADO` → rojo

#### Scenario: Badge se renderiza con color correcto
- **WHEN** la UI recibe un pedido con `estado_codigo: "EN_PREP"`
- **THEN** el badge muestra el texto "EN PREP" con fondo amarillo/ámbar

### Requirement: Timeline visual de historial
El frontend SHALL mostrar el historial de cambios de estado como una línea de tiempo vertical cronológica, con cada entrada mostrando: estado anterior → estado nuevo, fecha/hora, y quién realizó la transición.

#### Scenario: Timeline muestra historial completo
- **WHEN** la UI recibe un array de `HistorialEstadoPedidoResponse`
- **THEN** renderiza una timeline vertical con cada transición en orden cronológico descendente, mostrando estado, fecha y responsable

#### Scenario: Timeline vacío
- **WHEN** el historial está vacío
- **THEN** la UI muestra un mensaje "Sin cambios de estado registrados"

### Requirement: Acciones de avance de estado para staff
El frontend SHALL permitir a usuarios `GESTOR`/`ADMIN` avanzar el estado de un pedido desde la UI, mostrando solo las transiciones válidas según la FSM. SHALL incluir un campo opcional de motivo.

#### Scenario: Gestor avanza estado desde detalle
- **WHEN** un `GESTOR` ve el detalle de un pedido en estado `CONFIRMADO`
- **THEN** la UI muestra botón "En preparación" que al clickear cambia el estado a `EN_PREP`

#### Scenario: Botones deshabilitados según FSM
- **WHEN** un pedido está en estado `ENTREGADO` (terminal)
- **THEN** la UI NO muestra botones de avance de estado

#### Scenario: Confirmación antes de cancelar
- **WHEN** un `GESTOR` hace clic en "Cancelar pedido"
- **THEN** la UI muestra un modal de confirmación con campo de motivo obligatorio antes de ejecutar la transición

### Requirement: Página "Mis Pedidos" (cliente)
El frontend SHALL tener una ruta `/mis-pedidos` protegida con `ProtectedRoute` que muestre el listado de pedidos del cliente autenticado con: tabla de pedidos (ID, fecha, total, estado), paginación, filtro por estado, y enlace al detalle de cada pedido.

#### Scenario: Cliente navega a Mis Pedidos
- **WHEN** un usuario `CLIENT` autenticado navega a `/mis-pedidos`
- **THEN** la UI muestra una tabla con sus pedidos, paginación, y un selector de filtro por estado

#### Scenario: Cliente no autenticado es redirigido
- **WHEN** un usuario no autenticado navega a `/mis-pedidos`
- **THEN** el sistema redirige a `/login`

### Requirement: Página "Detalle de Pedido"
El frontend SHALL tener una ruta `/pedidos/:id` protegida que muestre: info del pedido, items con precios, timeline de historial, estado del pago, y acciones de avance (si el rol lo permite).

#### Scenario: Cliente ve detalle de pedido
- **WHEN** un usuario autenticado navega a `/pedidos/1`
- **THEN** la UI muestra la información completa del pedido 1

#### Scenario: Página muestra estado del pago
- **WHEN** el pedido tiene un pago asociado
- **THEN** la UI muestra el estado del pago (aprobado, pendiente, rechazado) usando `GET /pagos/{id}/estado`

### Requirement: Página "Gestión de Pedidos" (staff)
El frontend SHALL tener una ruta `/admin/pedidos` protegida con `ProtectedRoute` + `RoleBasedRoute` (roles `GESTOR`, `ADMIN`) que muestre el listado global de pedidos con filtros avanzados (estado, usuario, fecha) y acciones por pedido.

#### Scenario: Gestor accede a gestión de pedidos
- **WHEN** un usuario `GESTOR` navega a `/admin/pedidos`
- **THEN** la UI muestra el listado global de todos los pedidos del sistema con filtros y paginación

#### Scenario: Cliente no puede acceder
- **WHEN** un usuario `CLIENT` navega a `/admin/pedidos`
- **THEN** el sistema redirige a `/unauthorized`


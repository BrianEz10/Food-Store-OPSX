## ADDED Requirements

### Requirement: Resumen KPIs
El sistema SHALL exponer `GET /api/v1/admin/dashboard/resumen` que retorne indicadores clave: `ventas_totales` (suma de total de pedidos no cancelados), `cantidad_pedidos` (total de pedidos), `usuarios_registrados` (total de usuarios activos), `ticket_promedio` (ventas_totales / cantidad_pedidos), `pedidos_hoy` (pedidos creados hoy), `productos_disponibles` (productos activos).

#### Scenario: Admin obtiene resumen de KPIs
- **WHEN** un ADMIN hace `GET /api/v1/admin/dashboard/resumen`
- **THEN** el sistema retorna un objeto JSON con los KPIs calculados en tiempo real sobre la BD

#### Scenario: Resumen excluye pedidos cancelados
- **WHEN** se calculan las ventas totales
- **THEN** los pedidos con estado CANCELADO NO se incluyen en la suma

#### Scenario: Usuario no-admin no puede acceder
- **WHEN** un usuario CLIENT hace `GET /api/v1/admin/dashboard/resumen`
- **THEN** el sistema retorna `403 Forbidden`

### Requirement: Ventas por mes
El sistema SHALL exponer `GET /api/v1/admin/dashboard/ventas-por-mes` que retorne ventas agrupadas por mes para los últimos 12 meses, usando `DATE_TRUNC('month', creado_en)` y excluyendo pedidos cancelados. Cada entrada SHALL incluir `mes` (string YYYY-MM), `ventas` (float), `cantidad_pedidos` (int).

#### Scenario: Admin consulta ventas por mes
- **WHEN** un ADMIN hace `GET /api/v1/admin/dashboard/ventas-por-mes`
- **THEN** el sistema retorna un array con 12 entries, una por mes, ordenadas cronológicamente

### Requirement: Top productos más vendidos
El sistema SHALL exponer `GET /api/v1/admin/dashboard/top-productos` que retorne los productos más vendidos por cantidad total, con `nombre`, `cantidad_vendida`, `ingresos_totales`, ordenados por cantidad descendente. SHALL aceptar `limit` (default 10).

#### Scenario: Admin consulta top productos
- **WHEN** un ADMIN hace `GET /api/v1/admin/dashboard/top-productos?limit=5`
- **THEN** el sistema retorna los 5 productos más vendidos con nombre, cantidad e ingresos

### Requirement: Pedidos por estado
El sistema SHALL exponer `GET /api/v1/admin/dashboard/pedidos-por-estado` que retorne la cantidad de pedidos agrupados por `estado_codigo`. Cada entrada SHALL incluir `estado` (string), `cantidad` (int).

#### Scenario: Admin consulta distribución de estados
- **WHEN** un ADMIN hace `GET /api/v1/admin/dashboard/pedidos-por-estado`
- **THEN** el sistema retorna un array con la cantidad de pedidos en cada estado (PENDIENTE, CONFIRMADO, etc.)

### Requirement: Configuración del sistema
El sistema SHALL exponer `GET /api/v1/admin/configuracion` para listar todas las configuraciones y `PUT /api/v1/admin/configuracion` para actualizar una o varias. Los valores SHALL almacenarse en tabla `configuracion` con campos `clave` (PK string), `valor` (string), `descripcion` (string opcional), `actualizado_en` (timestamp).

#### Scenario: Admin lista configuraciones
- **WHEN** un ADMIN hace `GET /api/v1/admin/configuracion`
- **THEN** el sistema retorna un array de objetos `{ clave, valor, descripcion, actualizado_en }`

#### Scenario: Admin actualiza configuración
- **WHEN** un ADMIN hace `PUT /api/v1/admin/configuracion` con `{ "clave": "costo_envio", "valor": "100" }`
- **THEN** el sistema actualiza o crea (upsert) la configuración y retorna el resultado

### Requirement: Dashboard frontend con KPIs y charts
El frontend SHALL mostrar en `/dashboard` un dashboard con: cards de KPIs en grid (ventas totales, pedidos, usuarios, ticket promedio), LineChart de ventas mensuales, BarChart de top productos, PieChart de distribución por estado, y una sección de configuración.

#### Scenario: Dashboard carga todos los datos
- **WHEN** un usuario ADMIN navega a `/dashboard`
- **THEN** la UI muestra KPIs, charts y configuración con los datos del backend

#### Scenario: Dashboard en loading
- **WHEN** los datos están cargando
- **THEN** la UI muestra skeletons en lugar de cards y charts

#### Scenario: Dashboard en error
- **WHEN** algún endpoint falla
- **THEN** la UI muestra un mensaje de error con opción de reintentar

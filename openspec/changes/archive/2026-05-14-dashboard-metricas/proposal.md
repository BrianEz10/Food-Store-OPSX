## Why

El dashboard actual es un placeholder vacío. Los administradores no tienen visibilidad de las métricas del negocio: ventas, cantidad de pedidos, usuarios registrados, productos más vendidos, ni pueden configurar parámetros del sistema. Sin esto, la gestión del food store es a ciegas.

## What Changes

- **Backend**: Nuevos endpoints en módulo `admin/dashboard`:
  - `GET /admin/dashboard/resumen` — KPIs generales (ventas totales, pedidos, usuarios, ticket promedio)
  - `GET /admin/dashboard/ventas-por-mes` — ventas agrupadas por mes (últimos 12 meses)
  - `GET /admin/dashboard/top-productos` — ranking de productos más vendidos
  - `GET /admin/dashboard/pedidos-por-estado` — distribución de pedidos por estado
  - `GET /admin/configuracion` — listar configuraciones del sistema
  - `PUT /admin/configuracion` — actualizar configuración
  - Queries SQL con SUM, COUNT, GROUP BY, DATE_TRUNC sobre tablas existentes
- **Frontend**: Dashboard real con:
  - KPIs cards (ventas totales, pedidos, usuarios, ticket promedio)
  - LineChart de evolución de ventas mensuales (recharts)
  - BarChart de top productos
  - PieChart de distribución por estado
  - Panel de configuración del sistema (key-value)
- **Dependencia**: Instalar `recharts` en el frontend

## Capabilities

### New Capabilities
- `admin-dashboard`: Dashboard de administración con KPIs, gráficos de ventas, ranking de productos, distribución de pedidos por estado, y configuración del sistema.

### Modified Capabilities
- *(ninguna — los specs existentes no cambian)*

## Impact

- **Backend**: `backend/app/modules/admin/` — nuevos schemas, dashboard service, nuevos endpoints en router. Nueva tabla `configuracion` (o entidad SQLModel).
- **Frontend**: Instalar `recharts`. Nuevo feature `frontend/src/features/dashboard/`. Reemplazar `DashboardPage.tsx` con componentes reales.
- **Router**: La ruta `/dashboard` ya existe y está protegida — solo reemplazar el componente.
- **Nav**: El item "Dashboard" en el menú ya existe para ADMIN/STOCK/PEDIDOS — sin cambios.

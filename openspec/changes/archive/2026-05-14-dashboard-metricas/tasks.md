## 1. Backend — Modelo Configuracion

- [x] 1.1 Crear modelo `Configuracion` (clave: str PK, valor: str, descripcion: str opcional, actualizado_en: datetime) en `backend/app/modules/admin/models.py`
- [x] 1.2 Agregar `ConfiguracionRepository` en `backend/app/modules/admin/repository.py`
- [x] 1.3 Registrar en UnitOfWork para que esté disponible como `uow.configuraciones`

## 2. Backend — Schemas de dashboard

- [x] 2.1 Crear `DashboardResumenResponse` (ventas_totales, cantidad_pedidos, usuarios_registrados, ticket_promedio, pedidos_hoy, productos_disponibles)
- [x] 2.2 Crear `VentasPorMesEntry` (mes: str, ventas: float, cantidad_pedidos: int) y `VentasPorMesResponse` (list)
- [x] 2.3 Crear `TopProductoEntry` (nombre: str, cantidad_vendida: int, ingresos_totales: float) y `TopProductosResponse` (list)
- [x] 2.4 Crear `PedidosPorEstadoEntry` (estado: str, cantidad: int) y `PedidosPorEstadoResponse` (list)
- [x] 2.5 Crear `ConfiguracionResponse` (clave, valor, descripcion, actualizado_en) y `ConfiguracionUpdate` (dict con pares clave-valor)

## 3. Backend — Queries de métricas en PedidoRepository

- [x] 3.1 Agregar `get_resumen_kpis()` que calcula ventas totales, cantidad pedidos, ticket promedio, pedidos hoy con SUM, COUNT, AVG
- [x] 3.2 Agregar `get_ventas_por_mes()` con DATE_TRUNC('month', creado_en), SUM, COUNT, GROUP BY, ORDER BY, últimos 12 meses
- [x] 3.3 Agregar `get_top_productos(limit=10)` con JOIN a detalles_pedido, SUM(cantidad), SUM(subtotal), GROUP BY producto_id
- [x] 3.4 Agregar `get_pedidos_por_estado()` con COUNT y GROUP BY estado_codigo

## 4. Backend — Service y router de dashboard

- [x] 4.1 Crear `DashboardService` con métodos que orquestan las queries de repositorio
- [x] 4.2 Agregar endpoints en `admin/router.py`:
  - `GET /admin/dashboard/resumen`
  - `GET /admin/dashboard/ventas-por-mes`
  - `GET /admin/dashboard/top-productos`
  - `GET /admin/dashboard/pedidos-por-estado`
  - `GET /admin/configuracion`
  - `PUT /admin/configuracion`
- [x] 4.3 Todos los endpoints protegidos con `require_role(["ADMIN", "STOCK", "PEDIDOS"])`

## 5. Frontend — Feature dashboard

- [x] 5.1 Instalar `recharts` como dependencia
- [x] 5.2 Crear `features/dashboard/types.ts` con interfaces de respuesta
- [x] 5.3 Crear `features/dashboard/api.ts` con funciones para cada endpoint
- [x] 5.4 Crear `features/dashboard/queries.ts` con hooks React Query

## 6. Frontend — Componentes de dashboard

- [x] 6.1 Crear `DashboardKPI` componente card que muestra un KPI con ícono, valor, y label
- [x] 6.2 Crear `VentasChart` componente con LineChart de recharts (ventas por mes)
- [x] 6.3 Crear `TopProductosChart` componente con BarChart de recharts (top productos)
- [x] 6.4 Crear `PedidosPorEstadoChart` componente con PieChart de recharts (distribución)
- [x] 6.5 Crear `ConfiguracionPanel` componente con tabla de configuraciones y modal de edición inline

## 7. Frontend — DashboardPage

- [x] 7.1 Reemplazar `DashboardPage.tsx` con grid de KPIs arriba, charts debajo, y sección de configuración
- [x] 7.2 Manejar loading (skeletons para KPIs y charts)
- [x] 7.3 Manejar error (mensaje con retry)
- [x] 7.4 Agregar refresh manual con botón "Actualizar"

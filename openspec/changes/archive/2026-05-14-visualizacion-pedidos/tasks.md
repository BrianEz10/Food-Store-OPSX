## 1. Backend — Endpoints de listado y detalle

- [x] 1.1 Agregar `PedidoListResponse` (data, total, skip, limit) y `PedidoDetailResponse` (pedido + historial + estado_pago) en `schemas.py`
- [x] 1.2 Agregar método `get_by_user_id()` en `repository.py` con paginación (skip/limit), filtro por estado, ORDER BY creado_en DESC, y count total
- [x] 1.3 Agregar método `get_all()` en `repository.py` con los mismos filtros + filtro opcional por usuario_id
- [x] 1.4 Agregar método `get_detail_by_id()` en `repository.py` que traiga pedido + detalles + historial en una sola consulta (con JOINs)
- [x] 1.5 Agregar `get_user_pedidos()` y `get_pedido_detail()` en `service.py` con lógica de permisos (CLIENT ve solo suyo, staff ve todos)
- [x] 1.6 Agregar `GET /` y `GET /{pedido_id}` en `router.py` con dependencias de permisos
- [x] 1.7 Incluir estado del pago en `PedidoDetailResponse` consultando `GET /pagos/{pedido_id}/estado`

## 2. Frontend — Feature pedidos (api + queries + types)

- [x] 2.1 Agregar tipos `PedidoListResponse`, `PedidoDetailResponse`, `HistorialEntry` en `features/pedidos/types.ts`
- [x] 2.2 Agregar `fetchPedidos()` y `fetchPedidoById()` en `features/pedidos/api.ts`
- [x] 2.3 Agregar `usePedidos()` (query con filtros y paginación) y `usePedidoById()` en `features/pedidos/queries.ts`
- [x] 2.4 Agregar `STATUS_COLORS` y `STATUS_LABELS` en `shared/constants/pedidos.ts` con el mapeo de códigos a colores/labels

## 3. Frontend — Componentes compartidos

- [x] 3.1 Crear `StatusBadge` componente que recibe `estado_codigo` y renderiza badge coloreado usando `STATUS_COLORS`
- [x] 3.2 Crear `OrderTimeline` componente que renderiza timeline vertical del historial de estados
- [x] 3.3 Crear `OrderCard` componente para item de listado (ID, fecha, total, estado, acciones)
- [x] 3.4 Crear `CancelOrderModal` con confirmación y campo de motivo obligatorio

## 4. Frontend — Página "Mis Pedidos" (CLIENT)

- [x] 4.1 Crear ruta `/mis-pedidos` en `router.tsx` con `ProtectedRoute`
- [x] 4.2 Crear `MisPedidosPage` con tabla de pedidos, paginación y filtro por estado
- [x] 4.3 Manejar loading (skeleton), empty ("No tienes pedidos"), y error states

## 5. Frontend — Página "Detalle de Pedido"

- [x] 5.1 Crear ruta `/pedidos/:id` en `router.tsx` con `ProtectedRoute`
- [x] 5.2 Crear `PedidoDetailPage` con info del pedido, items, badge de estado, timeline, y estado del pago
- [x] 5.3 Manejar loading (skeleton), not found, y error states

## 6. Frontend — Página "Gestión de Pedidos" (GESTOR/ADMIN)

- [x] 6.1 Crear ruta `/admin/pedidos` en `router.tsx` con `ProtectedRoute` + `RoleBasedRoute` (roles: GESTOR, ADMIN)
- [x] 6.2 Crear `AdminPedidosPage` con listado global, filtros avanzados (estado, usuario, fecha), paginación
- [x] 6.3 Agregar dropdown de acciones de avance de estado por fila (solo transiciones válidas según FSM)
- [x] 6.4 Agregar mutation `useTransitionEstado()` en `features/pedidos/queries.ts`
- [x] 6.5 Manejar loading, empty, y error states

## 7. Integración y pulido

- [x] 7.1 Agregar link a "Mis Pedidos" en el menú de navegación para rol CLIENT
- [x] 7.2 Agregar link a "Gestión de Pedidos" en el menú de navegación para roles GESTOR/ADMIN
- [x] 7.3 Agregar enlace al detalle desde la página de éxito del checkout (`CheckoutSuccessPage`)
- [x] 7.4 Verificar que `npm run dev` del frontend compile sin errores
- [x] 7.5 Verificar que el backend importe correctamente los nuevos endpoints

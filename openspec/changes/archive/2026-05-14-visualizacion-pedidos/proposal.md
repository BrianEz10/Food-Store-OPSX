## Why

Actualmente el sistema permite crear pedidos, pagarlos y transicionar sus estados (FSM), pero **no existe ninguna interfaz** donde los usuarios puedan ver sus pedidos ni donde los gestores puedan gestionarlos. Sin visualización, el ciclo de pedidos está invisible para todos los roles. Este change cierra ese gap agregando los endpoints de listado/detalle y las pantallas de visualización para clientes y staff.

## What Changes

- **Backend**: Nuevos endpoints `GET /pedidos` (listado con filtros y paginación) y `GET /pedidos/{id}` (detalle con items, historial y estado del pago). Los clientes solo ven sus propios pedidos; `GESTOR`/`ADMIN` ven todos.
- **Frontend**: 
  - Página "Mis Pedidos" para rol `CLIENT` — listado con filtros (estado, fecha) y acceso a detalle
  - Página de detalle de pedido — info completa, items, historial de estados (timeline visual), estado del pago
  - Página de gestión para `GESTOR`/`ADMIN` — listado global con acciones de avance de estado
  - Badge de estado con colores por estado
- **Router**: Nuevas rutas `/mis-pedidos`, `/pedidos/:id`, y `/admin/pedidos`

## Capabilities

### New Capabilities
- `order-visualization`: Listado y detalle de pedidos para todos los roles, con filtros, paginación, timeline de historial de estados y acciones de avance para gestores.

### Modified Capabilities
- *(ninguna — los specs existentes no cambian sus requirements)*

## Impact

- **Backend**: `backend/app/modules/pedidos/` — nuevos métodos en repository, service, schemas, router
- **Frontend**: Nuevas páginas en `frontend/src/pages/pedidos/`, nuevas queries/api en `frontend/src/features/pedidos/`, nuevas rutas en `frontend/src/app/router.tsx`
- **Dependencias**: Depende de Change 11a (FSM y endpoints de transición) ✅ ya archivado

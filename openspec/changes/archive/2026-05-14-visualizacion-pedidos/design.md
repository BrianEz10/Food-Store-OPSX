## Context

El Change 11a (FSM backend) está archivado ✅ — los pedidos ya tienen máquina de estados, historial append-only, y endpoints de transición. También existe `GET /pagos/{id}/estado` para consultar el estado del pago. Sin embargo, **no hay endpoints de listado ni detalle**, por lo que el frontend no tiene forma de mostrar pedidos al usuario.

Este change agrega los endpoints faltantes y construye la UI para los 3 roles:
- **CLIENT**: "Mis Pedidos" + detalle + timeline
- **GESTOR**: Listado global + acciones de avance + detalle
- **ADMIN**: Ídem gestor + gestión de usuarios (esto último va en Change 12)

## Goals / Non-Goals

**Goals:**
- Endpoints `GET /pedidos` (listado con paginación, filtros por estado, fecha, usuario_id para staff) y `GET /pedidos/{id}` (detalle con historial y estado del pago)
- Página "Mis Pedidos" para CLIENT con tabla, filtros, paginación
- Página de detalle de pedido con timeline visual de estados
- Página de gestión para GESTOR/ADMIN con listado global y acciones de avance
- Badge de estado con colores por estado

**Non-Goals:**
- Dashboard de métricas (va en Change 13)
- Gestión de usuarios (va en Change 12)
- Notificaciones en tiempo real (fuera de alcance del MVP)
- Exportación de pedidos (fuera de alcance)

## Decisions

### 1. Paginación skip/limit (no cursor)
**Decisión**: Usar `skip`/`limit` con `ORDER BY creado_en DESC`.
**Alternativa**: Cursor-based pagination (más performante en tablas grandes).
**Razón**: skip/limit es suficiente para el volumen esperado de un food store local. Además es consistente con el patrón existente en `ProductListPage` y es más simple de implementar en backend y frontend.

### 2. Listado unificado en un solo endpoint
**Decisión**: Un solo `GET /pedidos` que cambia comportamiento según el rol.
- `CLIENT`: filtra automáticamente por `usuario_id = current_user.id` (ignora query param `usuario_id`)
- `GESTOR`/`ADMIN`: lista todos, acepta `usuario_id` como filtro opcional
**Alternativa**: Endpoints separados `GET /pedidos/mis-pedidos` y `GET /admin/pedidos`.
**Razón**: Menos código duplicado, mismo schema de respuesta. La diferenciación es transparente vía el `get_current_user` en el service.

### 3. Timeline vertical con CSS puro (sin librería)
**Decisión**: Timeline de historial implementado con CSS (pseudo-elementos `::before` con border-left, círculos con `::after`).
**Alternativa**: Usar `react-timeline` o similar.
**Razón**: Es un componente puramente visual, sin estado ni interacción compleja. Una librería externa agrega peso innecesario. CSS puro es más mantenible y personalizable.

### 4. Badge de estado con mapa de colores centralizado
**Decisión**: Un objeto `STATUS_COLORS` exportado desde `shared/constants/pedidos.ts` que mapee `estado_codigo` → clases de Tailwind.
**Alternativa**: Función switch inline en cada componente.
**Razón**: Centralizar los colores evita duplicación y facilita cambios. El componente `StatusBadge` recibe el código y renderiza el badge automágicamente.

### 5. Acciones de avance como dropdown en listado y botones en detalle
**Decisión**: En el listado global (staff), cada fila tiene un dropdown con las transiciones válidas. En el detalle, botones individuales.
**Alternativa**: Solo botones en detalle, ninguna acción desde listado.
**Razón**: Los gestores necesitan avanzar estados rápidamente sin entrar al detalle. El listado con dropdown es más eficiente para operaciones masivas.

## Risks / Trade-offs

- **[Rendimiento]** `SELECT FOR UPDATE` no se usa en los endpoints de listado (solo en transiciones), por lo que no hay riesgo de contención en lecturas
- **[Permisos]** El filtro por `usuario_id` debe ignorarse explícitamente para CLIENT para evitar que un cliente malicioso liste pedidos ajenos → mitigado: el service siempre forza `current_user.id` para CLIENT
- **[Paginación]** skip/limit puede dar resultados inconsistentes si hay inserts concurrentes entre páginas → mitigado: es aceptable para este volumen, no hay paginación infinita
- **[UI]** El timeline CSS puede no alinearse bien con textos largos → mitigado: altura fija por entrada con `min-h` y truncamiento

## Open Questions

- ¿El timeline debe mostrar también el estado del pago como un punto más, o va separado?
  - **Resuelto**: El estado del pago va como badge independiente en el header del detalle, NO en la timeline. La timeline es solo del FSM del pedido.

## Context

El flujo del ciclo de vida del pedido aún no está gobernado por reglas estrictas. Los pedidos se crean en estado `PENDIENTE` y los pagos se pueden aprobar (webhook), pero la transición a los siguientes estados (`CONFIRMADO`, `EN_PREP`, etc.) carece de una Máquina de Estados Finita (FSM) que centralice, valide y registre históricamente el cambio en la tabla `historial_estados_pedido`.

## Goals / Non-Goals

**Goals:**
- Centralizar toda modificación de estado en un único punto (FSM).
- Validar transiciones legales (ej. `PENDIENTE` → `CONFIRMADO` → `EN_PREP` → `EN_CAMINO` → `ENTREGADO`).
- Registrar cada transición en la tabla de `historial_estados_pedido` de forma append-only.
- Exponer endpoints de consulta de historial y cambio manual de estado.
- Manejar la lógica de cancelación (restaurar el stock reservado, solo si estaba confirmado/preparando).

**Non-Goals:**
- Interfaces de usuario para administrar esto (se hará en el Change 11b: `visualizacion-pedidos`).
- Lógica de reembolso real de pago si se cancela un pedido (fuera de scope por ahora, se requeriría interactuar con MercadoPago Refunds).

## Decisions

- **Motor FSM en la capa de Servicio**: 
  - *Decisión*: Implementar una clase/módulo `OrderFSMService` o agregar métodos estáticos al `PedidosService` existente. Usaremos un diccionario/mapa de transiciones en Python para definir qué estado puede ir a cuál.
  - *Alternativa*: Usar una librería externa como `transitions`.
  - *Razón*: El flujo es lo suficientemente simple como para no requerir una dependencia de terceros.
- **Cancelaciones y Stock**:
  - *Decisión*: Al hacer una transición hacia `CANCELADO`, si el pedido venía de un estado en el cual el stock ya estaba reservado y restado del inventario (todos los estados post-PENDIENTE, en realidad el decremento se hace al crear en PENDIENTE según el Change 09a), se debe incrementar el stock de los productos.
  - *Razón*: Mantener la consistencia del inventario de forma asincrónica a la cancelación.
- **Historial Inmutable**:
  - *Decisión*: Cada transición ejecutará un INSERT en `historial_estados_pedido`. Sin UPDATEs ni DELETEs.
  - *Razón*: Facilita auditoría y trazabilidad.

## Risks / Trade-offs

- **[Risk] Transiciones Concurrentes**: Dos requests (webhook + gestor manual) intentan cambiar el estado al mismo tiempo.
  - *Mitigación*: Realizar `SELECT ... FOR UPDATE` al obtener el pedido en el FSM para garantizar aislamiento de transacción.
- **[Risk] Restauración de stock fallida**: Cancelar un pedido falla al incrementar el stock si el producto fue borrado.
  - *Mitigación*: Controlar la cancelación dentro de una misma transacción (UnitOfWork) donde si el producto no se encuentra (aunque sea *soft-delete* no debería borrarse duro), se maneje la excepción haciendo rollback a toda la transición FSM.

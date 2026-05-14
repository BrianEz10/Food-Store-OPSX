## Why

El flujo de compras requiere una gestión rigurosa del estado de los pedidos para garantizar la coherencia de negocio (p. ej. control de stock, pagos, envío y entrega). Actualmente, los pedidos se crean y los pagos se procesan, pero el ciclo de vida del pedido aún no se gestiona de principio a fin. Necesitamos implementar una Máquina de Estados Finita (FSM) que centralice, valide y registre cada transición, evitando cambios de estado arbitrarios e inconsistencias.

## What Changes

- Implementar el mapa de transiciones de estados válidas en `PedidosService` (PENDIENTE → CONFIRMADO → EN_PREP → EN_CAMINO → ENTREGADO).
- Soporte para transiciones automáticas (ej. PENDIENTE → CONFIRMADO activado por el webhook de MercadoPago de Change 10).
- Soporte para transiciones manuales por parte del gestor/admin.
- Funcionalidad de cancelación de pedidos con restauración automática de stock de los productos.
- Registro en `historial_estados_pedido` (append-only table) en cada transición.
- **BREAKING (interno):** Todo cambio en el estado del pedido deberá realizarse estrictamente a través del motor FSM para asegurar la consistencia y el registro en el historial.

## Capabilities

### New Capabilities
- `order-fsm`: Motor de máquina de estados para el ciclo de vida de los pedidos, validación de reglas de transición, restauración de stock al cancelar y guardado en historial append-only.

### Modified Capabilities
- `pedidos-backend`: Se modificará la gestión de pedidos para incorporar endpoints que expongan el historial de estados de un pedido y que permitan la transición manual de estados por parte de gestores.
- `payment-processing`: Integración final del webhook de pago con la FSM para ejecutar la transición a CONFIRMADO en caso de pago exitoso.

## Impact

- **Módulo Pedidos (`backend/app/modules/pedidos/service.py`)**: Centralizará la lógica del FSM.
- **Módulo Pagos (`backend/app/modules/pagos/service.py`)**: Invocará a la FSM al recibir el webhook de pago.
- **Módulo Productos (`backend/app/modules/productos/service.py`)**: Interacción con el FSM para restaurar o decrementar stock si corresponde en cancelaciones.
- **API (`backend/app/modules/pedidos/router.py`)**: Se crearán o modificarán endpoints para consultar el historial y cambiar el estado del pedido.

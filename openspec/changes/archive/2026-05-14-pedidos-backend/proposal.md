## Why

Necesitamos el motor transaccional del backend para procesar la creación de pedidos desde el carrito de compras. Esta funcionalidad es crítica para evitar inconsistencias en el inventario (race conditions) y garantizar que un pedido se registre de forma atómica y auditable (con precios y direcciones inmutables).

## What Changes

- Creación atómica del pedido utilizando el patrón Unit of Work.
- Validación de stock en tiempo real con bloqueos a nivel de fila (`SELECT FOR UPDATE`).
- Captura de snapshots (copia inmutable) de la dirección de entrega seleccionada y el precio unitario del producto al momento de la compra.
- Registro en `pedidos`, `detalles_pedido` y `historial_estados_pedido` (estado inicial `PENDIENTE`) dentro de la misma transacción.
- Soporte para personalización de productos (ej. exclusión de ingredientes) usando arreglos de IDs.

## Capabilities

### New Capabilities
- `pedidos-backend`: Creación atómica de pedidos con control de stock estricto, gestión de transacciones y snapshots inmutables.

### Modified Capabilities

## Impact

- **Nuevos Endpoints**: `POST /api/v1/pedidos` protegido por roles de cliente autenticado.
- **Capa de Datos**: Implementación del Repositorio y Servicio de Pedidos con integración del Unit of Work existente.
- **Base de Datos**: Operaciones en bloque sobre las tablas `pedidos`, `detalles_pedido`, `historial_estados_pedido` y actualización (decremento) concurrente en la tabla `productos` (stock).

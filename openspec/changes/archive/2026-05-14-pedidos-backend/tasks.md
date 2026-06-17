## 1. Unit of Work y Bloqueos

- [x] 1.1 Inyectar Session local o consolidar el `UnitOfWork` para agrupar repositorios dentro de la misma transacción.
- [x] 1.2 Implementar método `get_many_with_lock(ids)` en `ProductoRepository` con ordenamiento por ID y uso de `with_for_update()` en SQLAlchemy.

## 2. Modelos y Schemas

- [x] 2.1 Verificar y/o ajustar modelos SQLAlchemy para `Pedido`, `DetallePedido` e `HistorialEstadoPedido`.
- [x] 2.2 Crear `schemas.py` en módulo `pedidos` para el payload de creación de pedido (`direccion_id`, items con `producto_id`, `cantidad` e `ingredientes_excluidos`).
- [x] 2.3 Crear schemas para la respuesta de creación del pedido.

## 3. Servicio de Pedidos

- [x] 3.1 Crear `PedidosService` con método para la creación atómica de pedido recibiendo el schema y el usuario.
- [x] 3.2 Implementar validación de stock iterando sobre los items bloqueados dentro de la transacción.
- [x] 3.3 Implementar captura de `precio_snapshot` (desde el modelo de producto) y `direccion_snapshot` (consultando el repositorio de direcciones).
- [x] 3.4 Insertar registros de pedido, detalles (incluyendo decremento de stock) y primer estado `PENDIENTE`.

## 4. Endpoints y Router

- [x] 4.1 Crear `router.py` en módulo `pedidos`.
- [x] 4.2 Implementar endpoint `POST /api/v1/pedidos` protegido por JWT (requiere autenticación).
- [x] 4.3 Manejo de excepciones transaccionales (ej. stock insuficiente, dirección no encontrada) devolviendo respuestas HTTP 400.

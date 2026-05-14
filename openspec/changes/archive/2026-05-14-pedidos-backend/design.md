## Context

La creación de pedidos requiere transacciones complejas. Actualmente tenemos un `BaseRepository` y una incipiente estructura de `UnitOfWork`. Al recibir un payload con items y una dirección, debemos asegurar que el inventario esté disponible antes de descontar. Si dos procesos intentan comprar el último item simultáneamente, sin bloqueos a nivel de fila (`FOR UPDATE`), uno sobreescribirá al otro generando stock negativo.

## Goals / Non-Goals

**Goals:**
- Implementar transacciones atómicas garantizando la consistencia de datos entre tablas relacionadas.
- Usar `with_for_update()` en SQLAlchemy para el control de stock concurrente.
- Guardar `precio_snapshot` y `direccion_snapshot` en la base de datos de forma inmutable.

**Non-Goals:**
- No implementar integración con la pasarela de pago (eso corresponde a MercadoPago en el Change 10).
- No implementar el checkout frontend en esta etapa.

## Decisions

1. **Unit of Work (UoW):** Inyectar una dependencia `UoW` en el servicio de Pedidos que exponga repositorios y permita manejar la transacción (commit/rollback).
2. **`SELECT FOR UPDATE`:** Se agregará un método `get_many_with_lock(ids)` en el repositorio de productos para garantizar el bloqueo de las filas en PostgreSQL durante la transacción.
3. **Snapshots:** La `direccion_snapshot` se almacenará en formato JSON dentro de la tabla `pedidos`, y el `precio_snapshot` se almacenará en cada `detalle_pedido`.
4. **Prevención de Deadlocks:** Ordenar los IDs de los productos ascendantemente antes de adquirirlos para asegurar un orden de bloqueo predecible.

## Risks / Trade-offs

- **[Risk]** Deadlocks en base de datos al bloquear múltiples productos concurrentemente.
  → **Mitigación**: Se ordenarán programáticamente los IDs de los productos solicitados de menor a mayor antes de ejecutar la query `SELECT ... FOR UPDATE`, forzando a PostgreSQL a obtener los *locks* de forma secuencial segura.

## 1. FSM Core (Capa de Servicio)

- [x] 1.1 Crear archivo o clase `OrderFSM` dentro del módulo `pedidos` (o agregarlo a `PedidosService`).
- [x] 1.2 Definir el diccionario/mapa estricto de transiciones válidas (`PENDIENTE` -> `CONFIRMADO` o `CANCELADO`, `CONFIRMADO` -> `EN_PREP` o `CANCELADO`, etc.).
- [x] 1.3 Implementar el método principal de transición (ej. `transition_state(pedido_id, nuevo_estado, usuario_id, motivo)`).
- [x] 1.4 Incorporar `SELECT ... FOR UPDATE` al buscar el pedido dentro del método de transición para evitar race conditions.
- [x] 1.5 Implementar inserción append-only en `HistorialEstadoPedido` dentro de la transacción de cambio de estado.

## 2. Lógica de Cancelación y Stock

- [x] 2.1 En el método de transición de estado, agregar un hook o validación especial si el `nuevo_estado` es `CANCELADO`.
- [x] 2.2 Si el pedido se cancela, iterar por `detalles_pedido` para recuperar las cantidades de productos.
- [x] 2.3 Incrementar el `stock_cantidad` de cada producto en la base de datos (con bloqueos correspondientes).
- [x] 2.4 Asegurarse de que si un producto no existe o está eliminado (soft-delete), el incremento no aborte toda la transacción (o bien, validar que se ignore el restore si corresponde).

## 3. Integración con Pagos (Webhook)

- [x] 3.1 Actualizar `PagosService.process_webhook` (en el módulo de pagos).
- [x] 3.2 Modificar el caso donde el estado es `approved`: en lugar de solo actualizar la tabla `pagos`, inyectar o llamar al servicio FSM para ejecutar la transición del pedido de `PENDIENTE` a `CONFIRMADO`.
- [x] 3.3 Pasar "Sistema de Pagos" o `None` como usuario responsable de la transición en el historial.

## 4. Endpoints y Accesos (Router)

- [x] 4.1 Crear un endpoint `GET /api/v1/pedidos/{pedido_id}/historial` en `pedidos/router.py` para devolver los registros de `historial_estados_pedido`.
- [x] 4.2 Crear un endpoint `POST /api/v1/pedidos/{pedido_id}/estado` para permitir a roles `GESTOR` o `ADMIN` solicitar transiciones manuales de estado.
- [x] 4.3 Validar permisos y manejo de error 400 cuando el FSM rechaza la transición (ej. saltar estados o ir de `ENTREGADO` a `EN_PREP`).

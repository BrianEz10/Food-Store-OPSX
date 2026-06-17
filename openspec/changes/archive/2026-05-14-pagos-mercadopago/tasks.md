## 1. Backend: Modelo y Migración

- [x] 1.1 Crear la migración Alembic con la tabla `pagos` (campos: `id` UUID PK, `pedido_id` FK, `mp_payment_id`, `mp_preference_id`, `estado` ENUM, `monto`, `creado_en`, `actualizado_en`).
- [x] 1.2 Definir el modelo SQLAlchemy `Pago` en `backend/app/modules/pagos/model.py`.

## 2. Backend: Schemas y Repository

- [x] 2.1 Crear los schemas Pydantic en `backend/app/modules/pagos/schemas.py` (`PagoCreate`, `PagoResponse`, `WebhookPayload`).
- [x] 2.2 Crear `PagoRepository` en `backend/app/modules/pagos/repository.py` con métodos `create`, `get_by_pedido_id`, `get_by_mp_payment_id`, `update_estado`.

## 3. Backend: Servicio

- [x] 3.1 Crear `PagosService` en `backend/app/modules/pagos/service.py`.
- [x] 3.2 Implementar `create_preference(pedido_id)`: llama a MP API, crea `Pago` en BD con `estado=pending`, devuelve `preference_id` e `init_point`.
- [x] 3.3 Implementar `process_webhook(payload)`: valida firma `x-signature`, consulta estado a MP, aplica lógica de idempotencia (`mp_payment_id` dedup), actualiza `Pago`.
- [x] 3.4 Implementar `get_estado(pedido_id)`: devuelve estado actual del pago y del pedido.
- [x] 3.5 Instalar la librería `mercadopago` en el backend: `pip install mercadopago` y agregar a `requirements.txt`.

## 4. Backend: Router e Integración

- [x] 4.1 Crear `backend/app/modules/pagos/router.py` con los tres endpoints: `POST /api/v1/pagos/{pedido_id}`, `POST /api/v1/pagos/webhook`, `GET /api/v1/pagos/{pedido_id}/estado`.
- [x] 4.2 Registrar el router de pagos en `backend/app/main.py`.
- [x] 4.3 Agregar `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET` y `MP_PUBLIC_KEY` a `.env.example` y al `Settings` de la app.

## 5. Frontend: Servicio y Store

- [x] 5.1 Crear `frontend/src/features/pagos/api.ts` con las funciones de fetch para los endpoints de pagos.
- [x] 5.2 Crear `frontend/src/features/pagos/queries.ts` con `useCreatePago` (mutation) y `usePagoEstado` (query con polling).
- [x] 5.3 Instalar el SDK de MercadoPago: `npm install @mercadopago/sdk-react` en el frontend.

## 6. Frontend: Páginas de Pago

- [x] 6.1 Crear `frontend/src/pages/pago/PagoPage.tsx` que embebe el `CardPayment` Brick de MercadoPago usando el `preference_id` obtenido del backend.
- [x] 6.2 Crear `frontend/src/pages/pago/PagoSuccessPage.tsx` con mensaje de éxito y link al pedido; hace polling al estado hasta confirmar `approved`.
- [x] 6.3 Crear `frontend/src/pages/pago/PagoFailurePage.tsx` con mensaje de fallo y botón "Reintentar pago".
- [x] 6.4 Crear `frontend/src/pages/pago/PagoPendingPage.tsx` con mensaje de pago en proceso y polling de estado.
- [x] 6.5 Agregar `VITE_MP_PUBLIC_KEY` a `.env.example` del frontend.

## 7. Frontend: Rutas

- [x] 7.1 Registrar las rutas `/pago/:pedido_id`, `/pago/success`, `/pago/failure`, `/pago/pending` en `frontend/src/app/router.tsx` (rutas protegidas por autenticación).
- [x] 7.2 Conectar el botón "Proceder al pago" en `CheckoutSuccessPage` o en la vista del pedido para navegar a `/pago/:pedido_id`.

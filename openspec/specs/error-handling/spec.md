## ADDED Requirements

### Requirement: Middleware de errores RFC 7807
El sistema SHALL capturar todas las excepciones no manejadas y retornar respuestas de error siguiendo el estándar RFC 7807 (Problem Details for HTTP APIs).

#### Scenario: Formato de error estándar
- **WHEN** ocurre cualquier error HTTP en la aplicación
- **THEN** la respuesta tiene Content-Type `application/problem+json` y contiene los campos: `type` (URI de referencia o "about:blank"), `title` (descripción corta del error), `status` (código HTTP numérico), `detail` (mensaje específico del error), `instance` (ruta del request que falló)

#### Scenario: Error de validación Pydantic
- **WHEN** un request tiene datos inválidos que Pydantic rechaza
- **THEN** se retorna HTTP 422 con `detail` que incluye los errores por campo en formato `[{"field": "email", "message": "invalid email format"}]`

#### Scenario: Error 500 no expone internals
- **WHEN** ocurre un error interno no manejado
- **THEN** se retorna HTTP 500 con `detail` genérico ("Error interno del servidor") sin exponer stack trace ni detalles de implementación al cliente, y se loguea el error completo en el servidor

### Requirement: Excepciones custom con mapeo a HTTP
El sistema SHALL definir clases de excepción custom que mapean a códigos HTTP específicos, permitiendo lanzar errores semánticos desde cualquier capa.

#### Scenario: Excepciones disponibles
- **WHEN** se consulta las excepciones custom disponibles
- **THEN** existen: `NotFoundError` (404), `ValidationError` (422), `UnauthorizedError` (401), `ForbiddenError` (403), `ConflictError` (409), `RateLimitError` (429)

#### Scenario: Lanzar excepción desde service
- **WHEN** un service lanza `NotFoundError("Producto con id 99 no encontrado")`
- **THEN** el middleware captura la excepción y retorna HTTP 404 con el mensaje como `detail` en formato RFC 7807

### Requirement: Rate limiting en endpoints sensibles
El sistema SHALL implementar rate limiting global con slowapi para proteger endpoints sensibles contra abuso.

#### Scenario: Configuración de slowapi
- **WHEN** la aplicación arranca
- **THEN** slowapi está configurado como middleware global con limiter disponible para decorar endpoints individuales

#### Scenario: Respuesta al exceder límite
- **WHEN** un cliente excede el límite de rate configurado para un endpoint
- **THEN** el servidor responde HTTP 429 Too Many Requests con header `Retry-After` indicando segundos de espera

### Requirement: CORS configurado para desarrollo
El sistema SHALL configurar CORS middleware para permitir requests cross-origin desde el frontend de desarrollo.

#### Scenario: Origen permitido
- **WHEN** un request llega desde `http://localhost:5173` (Vite dev server)
- **THEN** los headers CORS permiten el request (Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Allow-Credentials)

#### Scenario: Orígenes desde variable de entorno
- **WHEN** se configura `CORS_ORIGINS=["http://localhost:5173", "https://midominio.com"]`
- **THEN** ambos orígenes son permitidos por el middleware CORS

### Requirement: Servidor arrancable con documentación automática
El sistema SHALL arrancar con `uvicorn` y generar documentación OpenAPI automáticamente.

#### Scenario: Arranque exitoso
- **WHEN** se ejecuta `uvicorn app.main:app --reload`
- **THEN** el servidor arranca sin errores en el puerto 8000

#### Scenario: Swagger UI accesible
- **WHEN** se accede a `http://localhost:8000/docs`
- **THEN** se muestra Swagger UI con la documentación interactiva de la API

#### Scenario: ReDoc accesible
- **WHEN** se accede a `http://localhost:8000/redoc`
- **THEN** se muestra la documentación en formato ReDoc

### Requirement: ErrorBoundary global en frontend

El sistema SHALL proveer un componente `ErrorBoundary` que capture errores no controlados durante el renderizado de React y muestre una interfaz de fallback.

#### Scenario: Captura de error de renderizado

- **WHEN** un componente hijo lanza un error durante el renderizado
- **THEN** el ErrorBoundary captura el error, lo loguea (console.error), y muestra un fallback UI con mensaje genérico y botón "Recargar página"

#### Scenario: Fallback UI accesible

- **WHEN** el ErrorBoundary está activo
- **THEN** el fallback muestra: icono de error, título "Algo salió mal", descripción "Ocurrió un error inesperado. Recargá la página para continuar.", y botón "Recargar página"

#### Scenario: ErrorBoundary no interfiere con funcionamiento normal

- **WHEN** no hay errores
- **THEN** el ErrorBoundary renderiza sus hijos sin modificar el contenido ni el comportamiento

### Requirement: ToastContainer global

El sistema SHALL proveer un componente `ToastContainer` que renderice las notificaciones del uiStore como overlay global sobre toda la aplicación.

#### Scenario: Toast aparece al invocar addToast

- **WHEN** se invoca `uiStore.addToast({ type: 'success', title: 'Guardado', description: 'Cambios guardados correctamente' })`
- **THEN** el ToastContainer renderiza un toast visible con icono según el tipo, título y descripción

#### Scenario: Toast se auto-descarta

- **WHEN** un toast aparece con `duration: 3000`
- **THEN** el toast se elimina automáticamente después de 3 segundos

#### Scenario: Toast con duración 0 no se auto-descarta

- **WHEN** un toast aparece con `duration: 0`
- **THEN** el toast permanece visible hasta que el usuario lo cierra manualmente

#### Scenario: Cierre manual de toast

- **WHEN** el usuario hace clic en el botón de cerrar de un toast
- **THEN** el toast se elimina inmediatamente

#### Scenario: Variantes visuales de toast

- **WHEN** se crea un toast con `type: 'success'`
- **THEN** el toast usa color verde y icono de check
- **WHEN** se crea un toast con `type: 'error'`
- **THEN** el toast usa color rojo y icono de X
- **WHEN** se crea un toast con `type: 'info'`
- **THEN** el toast usa color azul y icono de información
- **WHEN** se crea un toast con `type: 'warning'`
- **THEN** el toast usa color amarillo y icono de advertencia

#### Scenario: Posición de toasts

- **WHEN** los toasts se muestran
- **THEN** aparecen en la esquina superior derecha de la pantalla, apilados verticalmente con separación

#### Scenario: ToastContainer no bloquea interacción

- **WHEN** hay toasts visibles
- **THEN** el usuario puede interactuar con el contenido debajo (los toasts son overlays no-modales)

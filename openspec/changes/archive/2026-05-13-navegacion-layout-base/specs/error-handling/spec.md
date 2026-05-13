## ADDED Requirements

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

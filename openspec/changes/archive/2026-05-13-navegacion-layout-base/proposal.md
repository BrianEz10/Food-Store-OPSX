## Why

Actualmente la aplicación frontend no tiene un layout compartido — cada página renderiza su propio contenido sin navbar, sidebar ni header persistentes. Esto significa que los usuarios autenticados no tienen navegación visible entre secciones, no hay menú adaptado por rol, y no existe manejo global de errores ni notificaciones. Sin este cambio, la experiencia de navegación es inviable para un e-commerce funcional.

## What Changes

- **Nuevo `AppLayout`**: Layout principal con sidebar (desktop) y bottom nav (mobile), header con información del usuario autenticado y botón de logout
- **Menú de navegación adaptado por rol**: Cada rol (CLIENT, STOCK, PEDIDOS, ADMIN, anónimo) ve sólo las secciones que le corresponden
- **Integración de rutas existentes**: Todas las páginas actuales se envuelven en el layout compartido
- **`ErrorBoundary` global**: Componente que captura errores de React y muestra un fallback limpio con opción de recargar
- **Sistema de notificaciones Toast**: Componente `ToastContainer` que renderiza los toasts del `uiStore` con auto-dismiss, animaciones y tipos (success, error, info, warning)
- **Nuevas rutas**: `/unauthorized`, `*` (404 not-found)
- **Extracción de placeholders**: `PlaceholderHome` y `PlaceholderDashboard` se mueven a páginas reales
- **Theme toggle**: Botón de cambio de tema (light/dark) en el header, aplicando la clase `dark` al `<html>`

## Capabilities

### New Capabilities

- `app-shell`: Layout principal responsive con sidebar (desktop) / bottom nav (mobile), header con info de usuario, menú de navegación por roles, y estructura de routing que envuelve todas las páginas autenticadas

### Modified Capabilities

- `client-state`: El `uiStore` se extiende para soportar el estado de navegación (`activeRoute`, `sidebarCollapsed`) y el `theme` existente ahora se aplica realmente al DOM
- `error-handling`: Se agrega comportamiento de frontend (ErrorBoundary global con fallback UI) — actualmente esta spec solo cubre backend
- `frontend-foundation`: El `AppRouter` se reestructura para usar el nuevo `AppLayout` como wrapper de rutas autenticadas, y se agregan las rutas `/unauthorized` y `*` (404)

## Impact

- **Frontend**: Cambios en `src/app/` (router, index, providers), nuevo `src/widgets/layout/` (AppLayout, Sidebar, Navbar, Header, BottomNav), nuevo `src/widgets/toast/` (ToastContainer), nuevo `src/widgets/error/` (ErrorBoundary), nuevo `src/pages/home/` (HomePage), nuevo `src/pages/dashboard/` (DashboardPage), nuevo `src/pages/unauthorized/` (UnauthorizedPage), nuevo `src/pages/not-found/` (NotFoundPage)
- **Theme**: Se modifica `index.css` para soportar la clase `.dark`, se implementa el toggle en el header
- **Routing**: Se reorganiza `app/router.tsx` para envolver rutas autenticadas con el layout, se agregan las rutas faltantes
- **No breaking changes**: Todas las páginas existentes mantienen su funcionalidad actual

## 1. Estructura y utilidades base

- [x] 1.1 Crear estructura de carpetas: `src/widgets/layout/`, `src/widgets/toast/`, `src/widgets/error/`, `src/pages/home/`, `src/pages/dashboard/`, `src/pages/unauthorized/`, `src/pages/not-found/`
- [x] 1.2 Crear barrel exports (`index.ts`) en cada nuevo directorio
- [x] 1.3 Definir tipo `NavItem` en `shared/types/ui.ts`: `{ label: string, path: string, icon: LucideIcon, roles: Role[] }`
- [x] 1.4 Definir array `NAV_ITEMS` con todos los items de navegación por rol en `shared/lib/constants.ts`

## 2. Sistema de navegación por roles

- [x] 2.1 Implementar hook `useFilteredNavItems()` que filtra `NAV_ITEMS` según `authStore.user.roles`
- [x] 2.2 Hook retorna items para sidebar (todos los filtrados) y items para bottom nav (máx 5 + "Más")

## 3. Sidebar (desktop)

- [x] 3.1 Crear `Sidebar.tsx` en `widgets/layout/`: sidebar fija izquierda, ancho completo o colapsado (solo iconos)
- [x] 3.2 Implementar toggle de colapso con botón tipo "hamburger" en el header o dentro de la sidebar
- [x] 3.3 Cada item de navegación es un `NavLink` de React Router con icono + label (expandido) o solo icono + tooltip (colapsado)
- [x] 3.4 Sidebar oculta completamente en viewport < 768px (CSS `hidden lg:flex`)

## 4. Bottom Nav (mobile)

- [x] 4.1 Crear `BottomNav.tsx` en `widgets/layout/`: barra inferior fija, visible solo en mobile (< 768px)
- [x] 4.2 Mostrar máximo 5 items; si hay más, el 5to es "Más" que abre un drawer con el resto
- [x] 4.3 Cada item es un `NavLink` con icono + label corto, con indicador de ruta activa

## 5. Header

- [x] 5.1 Crear `Header.tsx` en `widgets/layout/`: barra superior fija con logo, nombre de la app, y controles
- [x] 5.2 Cuando el usuario está autenticado: mostrar nombre del usuario y botón de logout
- [x] 5.3 Cuando el usuario NO está autenticado: mostrar botones de Login/Register
- [x] 5.4 Incluir botón de theme toggle (light/dark) en el header

## 6. AppLayout

- [x] 6.1 Crear `AppLayout.tsx` en `widgets/layout/`: componente que renderiza Header + Sidebar + `<Outlet />` + BottomNav
- [x] 6.2 Aplicar padding al `<main>` para compensar header fijo (top) y bottom nav (mobile) o sidebar (desktop)
- [x] 6.3 AppLayout se registra como elemento de layout route en el router

## 7. ToastContainer

- [x] 7.1 Crear `ToastContainer.tsx` en `widgets/toast/`: renderiza los toasts de `uiStore.toasts` como overlay en esquina superior derecha
- [x] 7.2 Implementar variantes visuales: success (verde + check), error (rojo + x), info (azul + i), warning (amarillo + alerta)
- [x] 7.3 Implementar auto-dismiss con `setTimeout` y cleanup, animaciones de entrada/salida (fade + slide)
- [x] 7.4 Renderizar `ToastContainer` en `app/index.tsx` fuera del layout

## 8. ErrorBoundary

- [x] 8.1 Crear `ErrorBoundary.tsx` en `widgets/error/` como class component con `componentDidCatch`
- [x] 8.2 Implementar fallback UI: icono de error, título, descripción, botón "Recargar página"
- [x] 8.3 Envolver el `<AppRouter />` con `ErrorBoundary` en `app/providers.tsx`

## 9. Páginas nuevas

- [x] 9.1 Crear `HomePage.tsx` en `pages/home/`: bienvenida genérica al sistema
- [x] 9.2 Crear `DashboardPage.tsx` en `pages/dashboard/`: placeholder para futuros cambios (Change 13)
- [x] 9.3 Crear `UnauthorizedPage.tsx` en `pages/unauthorized/`: mensaje "No tenés permisos" con botón volver al inicio
- [x] 9.4 Crear `NotFoundPage.tsx` en `pages/not-found/`: mensaje "Página no encontrada" con botón volver al inicio

## 10. Reestructuración del router

- [x] 10.1 Reemplazar `PlaceholderHome` inline por import de `HomePage`
- [x] 10.2 Reemplazar `PlaceholderDashboard` inline por import de `DashboardPage`
- [x] 10.3 Organizar rutas en grupos: públicas (sin layout), con `AppLayout`, y de error
- [x] 10.4 Agregar ruta `/unauthorized` → `UnauthorizedPage`
- [x] 10.5 Agregar ruta `*` → `NotFoundPage`
- [x] 10.6 Mantener todos los `ProtectedRoute` y `RoleBasedRoute` existentes en las rutas autenticadas

## 11. Theme toggle

- [x] 11.1 Implementar hook `useTheme()` que aplica la clase `dark` al `<html>` según `uiStore.theme`
- [x] 11.2 Ejecutar el hook en `app/index.tsx` al inicio
- [x] 11.3 Asegurar que el tema se aplica antes del primer render (evitar flash) mediante un script inline en `index.html`

## 12. Verificación

- [x] 12.1 Verificar que el proyecto compila sin errores (`npx tsc --noEmit`) — ✅ 0 errores
- [x] 12.2 Verificar que `npm run dev` arranca correctamente — ✅ Vite ready en 336ms
- [x] 12.3 Verificar navegación completa en desktop — ✅ verificado manualmente
- [x] 12.4 Verificar navegación completa en mobile — ✅ verificado manualmente
- [x] 12.5 Verificar rutas con layout — ✅ verificado manualmente
- [x] 12.6 Verificar theme toggle — ✅ verificado manualmente
- [x] 12.7 Verificar toasts — ✅ verificado manualmente
- [x] 12.8 Verificar ErrorBoundary — ✅ verificado manualmente

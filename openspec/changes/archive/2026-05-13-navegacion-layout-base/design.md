## Context

Actualmente la aplicación frontend de Food Store carece de un sistema de layout compartido. Cada página se renderiza de forma independiente sin navbar, sidebar, header ni footer persistente. El router (`app/router.tsx`) define rutas para páginas públicas (login, register) y protegidas (perfil, direcciones, admin), pero no existe un componente `AppLayout` que las envuelva.

El estado de navegación está parcialmente preparado: el `uiStore` ya tiene `sidebarOpen`, `theme`, `toasts` y `activeModal`, pero estos no tienen componentes asociados que los rendericen. Los guards `ProtectedRoute` y `RoleBasedRoute` existen y funcionan correctamente.

Sin este cambio, no hay forma de que los usuarios naveguen entre secciones, ni hay manejo global de errores o notificaciones.

## Goals / Non-Goals

**Goals:**
- Layout responsive: sidebar en desktop (≥768px) y bottom nav en mobile (<768px)
- Header con logo, nombre del usuario autenticado y botón de logout
- Menú de navegación que se adapta por rol (CLIENT, STOCK, PEDIDOS, ADMIN, anónimo)
- `ErrorBoundary` global que captura errores de React con fallback UI
- `ToastContainer` que renderiza las notificaciones del `uiStore`
- Aplicación del theme (light/dark) al DOM mediante la clase `dark` en `<html>`
- Nuevas rutas: `/unauthorized` (acceso denegado) y `*` (404 not found)
- Extracción de `PlaceholderHome` y `PlaceholderDashboard` a páginas reales
- Todas las páginas existentes se integran sin cambios en su lógica interna

**Non-Goals:**
- Diseño visual detallado de cada página (cada página mantiene su propio contenido)
- Funcionalidad del dashboard (solo placeholder)
- Página de inicio con contenido real (solo placeholder)
- Animaciones complejas de transición entre rutas
- Breadcrumbs ni navegación secundaria

## Decisions

### 1. Layout Routes de React Router v7 (Outlet pattern)

**Decisión**: Usar layout routes de React Router v7 para envolver todas las rutas autenticadas con `<AppLayout />`.

```
<Route element={<AppLayout />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
  ...
</Route>
```

**Rationale**: React Router v7 soporta nativamente el patrón de layouts compartidos mediante `<Outlet />`. Las rutas públicas (login, register) quedan fuera del layout. Esto evita tener que agregar el layout manualmente en cada página y permite que el layout tenga su propio lifecycle.

**Alternativa descartada**: Envolver cada página individualmente con un HOC `withLayout` — más boilerplate, menos mantenible, no aprovecha el sistema de rutas anidadas.

### 2. Sidebar en desktop, Bottom Nav en mobile (responsive por breakpoint)

**Decisión**: El layout muestra una sidebar colapsable en desktop (≥768px) y un bottom navigation bar en mobile (<768px). Nunca se muestran ambos simultáneamente.

**Rationale**: Las sidebars son eficientes en desktop para acceder a muchas secciones. Las bottom navs son el estándar de Material Design para mobile (máx 5 items). Food Store tiene 4 roles con entre 3 y 8 secciones cada uno, lo que hace que la sidebar sea necesaria en desktop para roles como ADMIN (muchas secciones) mientras que bottom nav con un menú "Más" es suficiente en mobile.

**Alternativa descartada**: Sidebar en todos los tamaños — ocupa demasiado espacio en mobile y compite con el contenido. Drawer lateral (hamburger) en mobile — requiere un paso extra para ver la navegación, peor UX que bottom nav.

### 3. Menú dinámico por rol con estructura de datos declarativa

**Decisión**: Definir un array de items de navegación con `{ label, path, icon, roles[] }` y filtrar según los roles del usuario autenticado.

```typescript
const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', path: '/', icon: HomeIcon, roles: ['*'] },
  { label: 'Mi Perfil', path: '/perfil', icon: UserIcon, roles: ['CLIENT'] },
  { label: 'Categorías', path: '/admin/categorias', icon: FolderIcon, roles: ['STOCK', 'ADMIN'] },
  // ...
]
```

**Rationale**: Un único source of truth para la navegación. Agregar una sección nueva es tan simple como agregar un item al array. El filtrado por rol es determinista y fácil de testear.

**Alternativa descartada**: Menú hardcodeado por rol en cada componente — duplicación de lógica, propenso a errores cuando se agregan nuevas secciones.

### 4. ErrorBoundary como class component en `widgets/error/`

**Decisión**: Implementar `ErrorBoundary` como class component de React (requisito de React: `componentDidCatch` solo existe en clases) en `src/widgets/error/ErrorBoundary.tsx`.

**Rationale**: React no soporta Error Boundaries con hooks. El class component envuelve todo el árbol de rutas y captura errores no controlados. Muestra un fallback UI con el mensaje de error y un botón "Recargar página".

### 5. ToastContainer como portal en el root del DOM

**Decisión**: `ToastContainer` se renderiza en `app/index.tsx` fuera del layout, usando un portal a `<body>` o simplemente como hermano del layout en el árbol.

**Rationale**: Los toasts deben flotar sobre toda la UI, incluyendo modales y el layout mismo. Renderizarlos fuera del layout evita problemas de z-index y clipping.

### 6. Theme toggle con clase `dark` en `<html>`

**Decisión**: El botón de theme toggle en el header modifica `uiStore.theme`, y un `useEffect` en `app/index.tsx` aplica/remueve la clase `dark` del `<html>` según el valor.

**Rationale**: Tailwind CSS v3 usa la clase `dark` para activar variantes `dark:`. Los tokens de color ya están definidos en `index.css` con variables CSS. El `uiStore` ya persiste el theme en localStorage.

**Alternativa descartada**: `prefers-color-scheme` solo — no permite al usuario elegir explícitamente, y el store ya soporta 'light' | 'dark' | 'system'.

## Risks / Trade-offs

- **[Riesgo] Bottom nav limitada a 5 items** → Para roles con más de 5 secciones (ADMIN, STOCK), se agrega un item "Más" que abre un menú expandible o un drawer. Mitigación: diseñar el bottom nav con un slot de overflow.

- **[Riesgo] Sidebar colapsada en desktop** → En pantallas muy angostas de desktop (1024px), la sidebar puede ocupar demasiado espacio. Mitigación: sidebar colapsable a iconos mediante toggle, con tooltips para los labels.

- **[Trade-off] Layout routes cambian la estructura del router** → Todas las rutas existentes se mueven dentro del `<Route element={<AppLayout />}>`. Las URLs no cambian, solo la estructura del JSX. Las pruebas manuales deben verificar que cada ruta funciona correctamente dentro del layout.

- **[Riesgo] ErrorBoundary no captura errores de async/await ni event handlers** → Los Error Boundaries de React solo capturan errores durante el renderizado. Errores en callbacks asíncronos necesitan manejo explícito. Mitigación: el ErrorBoundary se complementa con el manejo de errores HTTP existente en el interceptor de Axios.

## Migration Plan

1. Crear estructura de carpetas en `widgets/layout/`, `widgets/toast/`, `widgets/error/`
2. Implementar `AppLayout` con sidebar y bottom nav responsive
3. Implementar el sistema de navegación por roles
4. Crear `ToastContainer` y conectarlo al `uiStore`
5. Crear `ErrorBoundary` y envolver la app
6. Crear páginas: `HomePage`, `DashboardPage`, `UnauthorizedPage`, `NotFoundPage`
7. Reestructurar `app/router.tsx` con layout routes
8. Implementar theme toggle y aplicación de clase `dark`
9. Verificar cada ruta existente dentro del nuevo layout

**Rollback**: Revertir el commit y restaurar `app/router.tsx` a su versión anterior. Los nuevos archivos en `widgets/` son aditivos y no afectan a las páginas existentes.

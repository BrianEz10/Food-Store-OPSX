## ADDED Requirements

### Requirement: AppRouter con layout routes

El sistema SHALL reestructurar `app/router.tsx` para usar layout routes de React Router v7, envolviendo las rutas autenticadas en `<AppLayout>` y dejando las rutas públicas fuera.

#### Scenario: Estructura de routing organizada

- **WHEN** se inspecciona `app/router.tsx`
- **THEN** las rutas están organizadas en: rutas públicas sin layout (`/login`, `/register`), rutas con layout (`/`, `/perfil`, `/mis-direcciones`, `/admin/*`, `/dashboard`), y rutas de error (`/unauthorized`, `*`)

#### Scenario: Páginas extraídas a componentes dedicados

- **WHEN** se inspecciona `app/router.tsx`
- **THEN** los placeholders inline `PlaceholderHome` y `PlaceholderDashboard` han sido reemplazados por imports de `HomePage` y `DashboardPage` desde `src/pages/`

#### Scenario: Rutas protegidas mantienen guards

- **WHEN** se inspeccionan las rutas autenticadas
- **THEN** las rutas que requieren autenticación están envueltas en `<ProtectedRoute>` y las que requieren roles específicos usan `<RoleBasedRoute>`

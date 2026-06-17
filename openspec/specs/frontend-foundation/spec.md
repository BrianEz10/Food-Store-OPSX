## Purpose
Definir las bases estructurales del frontend del Food Store, incluyendo herramientas de bundling, layouts base, sistema de estilos y tipografía.
## Requirements
### Requirement: Scaffolding Vite + React + TypeScript
El sistema SHALL proveer un proyecto Vite funcional con React 18+ y TypeScript en modo strict como base del frontend de Food Store.

#### Scenario: Proyecto arranca correctamente
- **WHEN** se ejecuta `npm run dev` dentro del directorio `frontend/`
- **THEN** el servidor de desarrollo Vite arranca sin errores y es accesible en `http://localhost:5173`

#### Scenario: TypeScript strict mode habilitado
- **WHEN** se compila el proyecto con `npx tsc --noEmit`
- **THEN** la compilación pasa sin errores con `strict: true` habilitado en tsconfig

#### Scenario: Path aliases funcionales
- **WHEN** un archivo importa usando `@/shared/api`
- **THEN** el import se resuelve correctamente tanto en TypeScript (type checking) como en Vite (bundling)

### Requirement: Estructura FSD completa
El sistema SHALL organizar el código fuente del frontend según Feature-Sliced Design con 6 capas horizontales y dependencia unidireccional.

#### Scenario: Capas FSD presentes
- **WHEN** se inspecciona `src/`
- **THEN** existen las carpetas: `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/` con sus archivos `index.ts` de barril

#### Scenario: Dependencia unidireccional
- **WHEN** un módulo de la capa `shared` necesita código
- **THEN** solo puede importar de `shared` o de dependencias externas, NUNCA de `entities`, `features`, `widgets`, `pages` o `app`

#### Scenario: Shared subdirectorios
- **WHEN** se inspecciona `src/shared/`
- **THEN** existen los subdirectorios: `api/`, `stores/`, `types/`, `lib/` con sus archivos de barril

### Requirement: Tailwind CSS configurado con tema base
El sistema SHALL incluir Tailwind CSS v3 con PostCSS, un tema personalizado basado en "Vivid Modernity", y tipografía moderna cargada desde Google Fonts.

#### Scenario: Utilidades Tailwind disponibles
- **WHEN** un componente usa clases como `bg-primary` o `text-lg`
- **THEN** los estilos se aplican correctamente en el navegador respetando la paleta Vivid Modernity

#### Scenario: Tema personalizado
- **WHEN** se inspecciona `tailwind.config.js`
- **THEN** el tema sobrescribe (overwrite) colores para forzar el uso estricto de la paleta Vivid Modernity (primary: #b3193d, secondary: #6d4e9f, tertiary: #006a42, surface: #fff8f7, error: #ba1a1a) y tipografías (Outfit e Inter)

#### Scenario: Google Fonts cargadas
- **WHEN** la app se renderiza en el navegador
- **THEN** las fuentes Inter y Outfit están disponibles (importadas via CDN o link tag en `index.html`)

### Requirement: Variables de entorno Vite
El sistema SHALL documentar todas las variables de entorno necesarias en `.env.example` con prefijo `VITE_`.

#### Scenario: Variables documentadas
- **WHEN** un desarrollador inspecciona `.env.example`
- **THEN** encuentra al menos: `VITE_API_URL`, `VITE_MP_PUBLIC_KEY` con valores de ejemplo

#### Scenario: Variables accesibles en runtime
- **WHEN** el código accede a `import.meta.env.VITE_API_URL`
- **THEN** el valor se resuelve correctamente en desarrollo y producción

### Requirement: Tipos compartidos base
El sistema SHALL definir tipos TypeScript compartidos para comunicación con la API en `shared/types/`.

#### Scenario: ApiError tipado
- **WHEN** la API retorna un error RFC 7807
- **THEN** el tipo `ApiError` modela los campos: `type`, `title`, `status`, `detail`, `instance`

#### Scenario: PaginatedResponse genérico
- **WHEN** la API retorna una lista paginada
- **THEN** el tipo `PaginatedResponse<T>` modela: `items: T[]`, `total: number`, `page: number`, `pageSize: number`, `totalPages: number`

#### Scenario: Tipos de dominio base
- **WHEN** se necesitan tipos para auth, cart, payment o UI
- **THEN** existen archivos separados: `auth.ts`, `cart.ts`, `payment.ts`, `ui.ts` en `shared/types/`

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


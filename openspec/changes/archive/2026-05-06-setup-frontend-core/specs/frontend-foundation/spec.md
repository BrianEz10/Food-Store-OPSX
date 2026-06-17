## ADDED Requirements

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
El sistema SHALL incluir Tailwind CSS v3 con PostCSS, un tema personalizado, y tipografía moderna cargada desde Google Fonts.

#### Scenario: Utilidades Tailwind disponibles
- **WHEN** un componente usa clases como `bg-primary-500` o `text-lg`
- **THEN** los estilos se aplican correctamente en el navegador

#### Scenario: Tema personalizado
- **WHEN** se inspecciona `tailwind.config.js`
- **THEN** el tema extiende colores (`primary`, `secondary`, `surface`, `danger`, `success`, `warning`), familias de fuente (`sans: Inter`, `display: Outfit`), y conserva los defaults de Tailwind

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

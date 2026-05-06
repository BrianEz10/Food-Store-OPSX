## Why

El backend (Change 01) ya está archivado con los 16 modelos SQLModel, migraciones, seed data, y los patrones base (UoW, BaseRepository, dependencias de seguridad). Sin embargo, **el frontend está vacío** — solo tiene `.gitkeep` y `.env.example`. Para que los changes posteriores (auth, navegación, catálogo, carrito, pedidos, pagos) puedan implementar funcionalidad de usuario, necesitamos la fundación del frontend: la app React, el sistema de estado, la comunicación HTTP con el backend, y la estructura de carpetas FSD.

Este change es **independiente del backend** y se puede desarrollar en paralelo. Ningún endpoint se consume aún — solo se preparan las piezas que los changes 03-13 ensamblarán.

## What Changes

- **Scaffolding Vite + React + TypeScript** con `strict: true` y configuración optimizada para desarrollo
- **Tailwind CSS v3** con PostCSS, reset de estilos, y tema base alineado con la identidad visual de Food Store
- **Instancia Axios centralizada** con interceptores para inyección automática de JWT y refresh transparente de tokens
- **TanStack Query (React Query v5)** provider configurado con defaults sensatos (stale time, retry, error handling)
- **4 stores Zustand** con sus interfaces tipadas:
  - `authStore`: tokens, usuario, login/logout, hasRole()
  - `cartStore`: items, agregar/modificar/eliminar, persistencia localStorage
  - `paymentStore`: estado de checkout, forma de pago seleccionada
  - `uiStore`: sidebar, modales, toasts, theme
- **Estructura FSD completa** con carpetas `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/` y sus archivos index de barril
- **`.env.example`** actualizado con variables Vite necesarias
- **Tipos compartidos base** (`ApiError`, `PaginatedResponse<T>`, `ApiResponse<T>`) en `shared/types/`

## Capabilities

### New Capabilities
- `frontend-foundation`: Scaffolding Vite + React + TypeScript, estructura FSD, configuración de Tailwind CSS, y archivos de entrada de la aplicación
- `http-client`: Instancia Axios centralizada con interceptores JWT y configuración de TanStack Query como capa de estado del servidor
- `client-state`: Los 4 stores Zustand (auth, cart, payment, ui) con interfaces tipadas y persistencia donde corresponde

### Modified Capabilities
_(ninguna — no existen specs frontend previas)_

## Impact

- **Directorio `frontend/`**: Pasa de vacío a un proyecto React funcional con `npm run dev` operativo
- **Dependencias**: Se agregan ~15 paquetes npm (react, react-dom, typescript, vite, tailwindcss, axios, zustand, @tanstack/react-query, react-router-dom, etc.)
- **Configuración**: `tsconfig.json` con `strict: true` y path aliases (`@/` → `src/`), `vite.config.ts` con proxy al backend, `tailwind.config.js` con tema personalizado
- **Contrato con el backend**: La instancia de Axios apunta a `VITE_API_URL` (default `http://localhost:8000`). Los interceptores preparan la renovación automática de tokens que Change 03 activará
- **Cambios que dependen de este**: Change 03 (auth), Change 05 (navegación/layout), y todos los changes con UI

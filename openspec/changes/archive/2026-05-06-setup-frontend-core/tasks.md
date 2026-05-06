## 1. Scaffolding Vite + React + TypeScript

- [x] 1.1 Inicializar proyecto Vite con template `react-ts` dentro de `frontend/` (`npm create vite@latest ./ -- --template react-ts`)
- [x] 1.2 Instalar dependencias del proyecto: `react-router-dom`, `axios`, `zustand`, `@tanstack/react-query`, `@tanstack/react-query-devtools`
- [x] 1.3 Instalar dependencias de desarrollo: `tailwindcss@3`, `postcss`, `autoprefixer`, `@types/node`
- [x] 1.4 Configurar `tsconfig.json` y `tsconfig.app.json` con `strict: true` y path alias `@/*` → `./src/*`
- [x] 1.5 Configurar `vite.config.ts` con resolve alias `@` → `./src`, proxy de `/api` al backend (port 8000), y server port 5173

## 2. Tailwind CSS + Estilos base

- [x] 2.1 Inicializar Tailwind (`npx tailwindcss init -p`), configurar `content` en `tailwind.config.js`
- [x] 2.2 Extender tema en `tailwind.config.js`: colores (`primary`, `secondary`, `surface`, `danger`, `success`, `warning`), fontFamily (`sans: Inter`, `display: Outfit`)
- [x] 2.3 Configurar `src/index.css` con directivas Tailwind (`@tailwind base/components/utilities`) y CSS custom properties para variables de tema
- [x] 2.4 Agregar import de Google Fonts (Inter + Outfit) en `index.html` via `<link>` tags
- [x] 2.5 Limpiar archivos de template Vite innecesarios (`App.css`, `assets/react.svg`, contenido de ejemplo en `App.tsx`)

## 3. Estructura FSD

- [x] 3.1 Crear estructura de carpetas FSD en `src/`: `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/` con archivos `index.ts` de barril vacíos
- [x] 3.2 Crear subcarpetas de `shared/`: `api/`, `stores/`, `types/`, `lib/` con sus archivos `index.ts` de barril
- [x] 3.3 Crear `src/app/index.tsx` (App component), `src/app/providers.tsx` (provider tree), `src/app/router.tsx` (placeholder router)
- [x] 3.4 Actualizar `src/main.tsx` para importar App desde `@/app` y montar con `ReactDOM.createRoot`

## 4. Tipos compartidos

- [x] 4.1 Crear `src/shared/types/api.ts` con tipos: `ApiError` (RFC 7807: type, title, status, detail, instance), `PaginatedResponse<T>` (items, total, page, pageSize, totalPages), `ApiResponse<T>` (wrapper genérico)
- [x] 4.2 Crear `src/shared/types/auth.ts` con tipos: `User` (id, nombre, apellido, email, telefono, roles), `Role` (type alias de string literal union), `LoginCredentials`, `RegisterData`, `TokenPair`
- [x] 4.3 Crear `src/shared/types/cart.ts` con tipos: `CartItem` (productId, nombre, precio, cantidad, imagenUrl, personalizacion), `CartState`
- [x] 4.4 Crear `src/shared/types/payment.ts` con tipos: `PaymentMethod`, `PaymentState`, `CheckoutStep`
- [x] 4.5 Crear `src/shared/types/ui.ts` con tipos: `Toast` (id, type, message, duration), `ModalState`, `Theme`
- [x] 4.6 Crear `src/shared/types/index.ts` que re-exporte todos los tipos

## 5. Constantes y utilidades

- [x] 5.1 Crear `src/shared/lib/constants.ts` con: `API_ROUTES` (objeto con paths base de la API), `QUERY_KEYS` (claves para TanStack Query), `STORAGE_KEYS` (claves de localStorage)
- [x] 5.2 Crear `src/shared/lib/index.ts` con re-exports

## 6. Instancia Axios + TanStack Query

- [x] 6.1 Crear `src/shared/api/axios-instance.ts` con: instancia Axios (`baseURL` desde env, timeout 15s, content-type JSON), interceptor de request que inyecta JWT desde authStore, interceptor de response que detecta 401 e intenta refresh (skeleton — función `refreshAccessToken` placeholder que hace `Promise.reject()` por ahora)
- [x] 6.2 Crear `src/shared/api/query-client.ts` con QueryClient configurado: staleTime 5min, gcTime 10min, retry 1, refetchOnWindowFocus false, mutations retry 0
- [x] 6.3 Crear `src/shared/api/index.ts` que re-exporte `api` (instancia Axios) y `queryClient`

## 7. Stores Zustand

- [x] 7.1 Crear `src/shared/stores/auth-store.ts` con `useAuthStore`: estado (accessToken, refreshToken, user, isAuthenticated), acciones (setTokens, setUser, logout, hasRole). Sin persistencia localStorage
- [x] 7.2 Crear `src/shared/stores/cart-store.ts` con `useCartStore`: estado (items, total, itemCount), acciones (addItem con merge de duplicados, removeItem, updateQuantity, clearCart). CON persistencia localStorage via `zustand/middleware`
- [x] 7.3 Crear `src/shared/stores/payment-store.ts` con `usePaymentStore`: estado (selectedPaymentMethod, checkoutStep, isProcessing), acciones (setPaymentMethod, setCheckoutStep, setProcessing, resetCheckout). Sin persistencia
- [x] 7.4 Crear `src/shared/stores/ui-store.ts` con `useUIStore`: estado (sidebarOpen, theme, toasts, activeModal), acciones (toggleSidebar, setTheme, addToast con UUID, removeToast, openModal, closeModal). Persistencia parcial (solo theme)
- [x] 7.5 Crear `src/shared/stores/index.ts` que re-exporte los 4 stores

## 8. Provider tree y App component

- [x] 8.1 Crear `src/app/providers.tsx` con `AppProviders` que envuelve children con: `QueryClientProvider` (con queryClient de shared/api) y `BrowserRouter`
- [x] 8.2 Crear `src/app/router.tsx` con router placeholder: ruta `/` que muestra un componente "Food Store — Frontend Ready" con styling Tailwind básico
- [x] 8.3 Crear `src/app/index.tsx` con `App` component que compone `AppProviders` + `AppRouter`

## 9. Variables de entorno

- [x] 9.1 Actualizar `frontend/.env.example` con todas las variables Vite: `VITE_API_URL=http://localhost:8000`, `VITE_MP_PUBLIC_KEY=TEST-tu-public-key-de-mercadopago`
- [x] 9.2 Actualizar `src/vite-env.d.ts` con las interfaces de `ImportMetaEnv` para type-safety de variables de entorno

## 10. Verificación final

- [x] 10.1 Verificar que `npm install` se ejecuta sin errores ni warnings críticos
- [x] 10.2 Verificar que `npx tsc --noEmit` compila sin errores de tipos
- [x] 10.3 Verificar que `npm run dev` arranca el servidor de desarrollo en `http://localhost:5173`
- [x] 10.4 Verificar que la página placeholder se renderiza con estilos Tailwind aplicados
- [x] 10.5 Verificar que los path aliases (`@/shared/...`) resuelven correctamente

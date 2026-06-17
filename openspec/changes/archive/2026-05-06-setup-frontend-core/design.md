## Context

Food Store es un e-commerce de alimentos con stack React + TypeScript (frontend) + FastAPI + PostgreSQL (backend). El backend (Change 01) ya está archivado con los 16 modelos, migraciones, seed data y patrones base. El directorio `frontend/` está vacío — solo `.gitkeep` y `.env.example`. Este change establece toda la infraestructura frontend sobre la cual se construirán los 11 changes restantes.

El frontend debe seguir la arquitectura **Feature-Sliced Design (FSD)** con capas horizontales de dependencia unidireccional: `shared` → `entities` → `features` → `widgets` → `pages` → `app`. Los stores de estado se dividen en 4 dominios: auth, cart, payment, ui. La comunicación con el backend usa Axios con interceptores JWT + TanStack Query como capa de cache/estado del servidor.

**Restricciones clave del proyecto:**
- React 18+ con TypeScript strict
- Vite como bundler (no CRA, no Next.js)
- Tailwind CSS v3 para estilos (requerido por el proyecto)
- Zustand para estado del cliente (4 stores separados)
- TanStack Query v5 para estado del servidor
- React Router v6+ para navegación SPA
- Axios para HTTP (no fetch nativo — necesitamos interceptores)

## Goals / Non-Goals

**Goals:**
- Proyecto Vite + React + TypeScript funcional con `npm run dev`
- Estructura de carpetas FSD completa con archivos de barril
- Tailwind CSS configurado con tema base (colores, tipografía, breakpoints)
- Instancia Axios centralizada con interceptores JWT preparados (refresh token skeleton)
- TanStack Query provider con configuración de defaults
- 4 stores Zustand tipados con sus interfaces
- Path aliases (`@/` → `src/`) configurados en TypeScript y Vite
- Tipos compartidos base (`ApiError`, `PaginatedResponse<T>`)
- `.env.example` con variables Vite documentadas
- App arrancable con una página placeholder que confirme que todo funciona

**Non-Goals:**
- Componentes UI reales (botones, cards, etc.) — eso viene en changes posteriores
- Páginas funcionales — solo placeholder de "Hello Food Store"
- Consumo de endpoints del backend — no hay endpoints funcionales aún
- Configuración de tests — se agregará como bonus
- Integración con MercadoPago.js — eso es Change 10
- Layout, navegación, sidebar — eso es Change 05

## Decisions

### D1: Scaffolding con Vite + React + TypeScript

Se usa `npm create vite@latest` con template `react-ts` como base. Luego se reorganiza para FSD.

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── src/
    ├── main.tsx               # Entry point: ReactDOM.createRoot
    ├── index.css              # Tailwind directives + CSS custom properties
    ├── vite-env.d.ts          # Vite type declarations
    └── ...                    # FSD structure (see D2)
```

**Rationale:** Vite es el bundler requerido por el proyecto. El template `react-ts` proporciona la configuración base de TypeScript que luego endurecemos con `strict: true`.

### D2: Estructura FSD — Feature-Sliced Design

```
src/
├── app/                       # Capa app: providers, routing, estilos globales
│   ├── index.tsx             # App component con providers
│   ├── providers.tsx         # QueryClientProvider + otros providers
│   └── router.tsx            # BrowserRouter + Routes (placeholder)
│
├── pages/                     # Capa pages: 1 componente por ruta
│   └── index.ts              # Re-exports (vacío por ahora)
│
├── widgets/                   # Capa widgets: bloques UI compuestos
│   └── index.ts
│
├── features/                  # Capa features: interacciones de usuario
│   └── index.ts
│
├── entities/                  # Capa entities: modelos de dominio + API base
│   └── index.ts
│
└── shared/                    # Capa shared: utilidades transversales
    ├── api/
    │   ├── axios-instance.ts  # Instancia Axios + interceptores
    │   ├── query-client.ts    # QueryClient configurado
    │   └── index.ts
    ├── stores/
    │   ├── auth-store.ts      # Estado de autenticación
    │   ├── cart-store.ts      # Estado del carrito
    │   ├── payment-store.ts   # Estado de checkout/pagos
    │   ├── ui-store.ts        # Estado de UI (sidebar, modales, theme)
    │   └── index.ts
    ├── types/
    │   ├── api.ts             # ApiError, PaginatedResponse, ApiResponse
    │   ├── auth.ts            # User, LoginCredentials, TokenPair, Role
    │   ├── cart.ts            # CartItem, CartState
    │   ├── payment.ts         # PaymentState, PaymentMethod
    │   ├── ui.ts              # ToastType, ModalState, Theme
    │   └── index.ts
    ├── lib/
    │   ├── constants.ts       # API_ROUTES, QUERY_KEYS, STORAGE_KEYS
    │   └── index.ts
    └── index.ts
```

**Rationale:** FSD es la arquitectura definida en AGENTS.md. Las dependencias fluyen de abajo hacia arriba: `shared` no importa de ninguna otra capa, `entities` solo de `shared`, etc. Cada capa tiene un `index.ts` de barril para re-exports limpios.

### D3: Instancia Axios con interceptores JWT

```typescript
// shared/api/axios-instance.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: inyecta access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: refresh transparente en 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
```

**Rationale:** El interceptor de request inyecta el token automáticamente en cada llamada. El interceptor de response detecta 401, intenta refresh transparente, y si falla, hace logout. Esto evita que cada componente maneje la renovación de tokens manualmente. La función `refreshAccessToken()` queda como skeleton — Change 03 la implementará.

### D4: TanStack Query — Configuración global

```typescript
// shared/api/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutos antes de considerar stale
      gcTime: 10 * 60 * 1000,           // 10 minutos de cache (ex cacheTime)
      retry: 1,                          // 1 reintento en error
      refetchOnWindowFocus: false,       // No re-fetch al cambiar de pestaña
    },
    mutations: {
      retry: 0,                          // No reintentar mutations
    },
  },
});
```

**Rationale:** Defaults conservadores para un e-commerce: datos de catálogo cambian poco (5min staleTime), pero no queremos fetches agresivos que sobrecarguen al backend. Las mutations no se reintentan para evitar operaciones duplicadas (ej: crear un pedido dos veces).

### D5: Stores Zustand — 4 dominios tipados

Cada store sigue el patrón: interfaz de estado + interfaz de acciones, combinados en un tipo de store.

**authStore:**
```typescript
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  hasRole: (role: Role) => boolean;
}
```
Sin persistencia en localStorage — los tokens se manejan en memoria y se restauran con refresh token al iniciar.

**cartStore:**
```typescript
interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartActions {
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}
```
Con persistencia en localStorage via `zustand/middleware/persist`.

**paymentStore:**
```typescript
interface PaymentState {
  selectedPaymentMethod: string | null;
  checkoutStep: 'address' | 'summary' | 'payment' | 'confirmation' | null;
  isProcessing: boolean;
}

interface PaymentActions {
  setPaymentMethod: (method: string) => void;
  setCheckoutStep: (step: PaymentState['checkoutStep']) => void;
  setProcessing: (value: boolean) => void;
  resetCheckout: () => void;
}
```
Sin persistencia — el estado de checkout es efímero.

**uiStore:**
```typescript
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toasts: Toast[];
  activeModal: string | null;
}

interface UIActions {
  toggleSidebar: () => void;
  setTheme: (theme: UIState['theme']) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}
```
Con persistencia parcial (solo `theme` en localStorage).

**Rationale:** 4 stores separados es una decisión de AGENTS.md. Cada uno tiene un dominio claro y escala independientemente. Zustand es minimalista (sin boilerplate) y permite acceso fuera de React (útil para interceptores Axios).

### D6: Tailwind CSS — Tema base

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { /* paleta principal food store */ },
        secondary: { /* acentos */ },
        surface: { /* backgrounds */ },
        danger: { /* errores, estados cancelados */ },
        success: { /* confirmaciones, estados completados */ },
        warning: { /* alertas, estados pendientes */ },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

**Rationale:** Tailwind es requerido por el proyecto. El tema extiende los defaults con colores del dominio food y tipografía moderna (Inter para texto, Outfit para headings).

### D7: Path aliases

```json
// tsconfig.app.json (paths)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

```typescript
// vite.config.ts (resolve.alias)
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

**Rationale:** `@/shared/api` es más legible y refactorable que `../../../shared/api`. Los aliases se configuran en ambos lados (TS para el type checker, Vite para el bundler).

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| TanStack Query v5 tiene breaking changes vs v4 | Usamos v5 desde el inicio — no habrá migración. La API de hooks es estable |
| Zustand sin persist puede perder tokens en refresh | Es intencional: los tokens se restauran via refresh token al iniciar la app (Change 03) |
| Tailwind genera CSS grande en desarrollo | Tree-shaking de Tailwind en producción elimina clases no usadas. En dev no importa el tamaño |
| FSD puede sentirse over-engineered para 2-3 carpetas iniciales | Las capas vacías se llenarán orgánicamente en los changes siguientes. Mejor tener la estructura desde el inicio que reorganizar después |
| Path aliases requieren configuración dual (TS + Vite) | Se configura una vez y no cambia. Jest/Vitest también necesitará si se agregan tests |

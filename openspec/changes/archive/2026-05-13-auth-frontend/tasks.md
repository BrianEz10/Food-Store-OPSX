## 1. Configuración de API y Estado

- [x] 1.1 Crear funciones API de autenticación en `src/features/auth/api.ts` (`loginFn`, `registerFn`, `logoutFn`, `refreshFn`).
- [x] 1.2 Actualizar `src/shared/stores/authStore.ts` para gestionar `accessToken`, `user`, e `isAuthenticated` con sus respectivas acciones (login, logout, etc).
- [x] 1.3 Configurar *Request Interceptor* en `src/shared/api/axios.ts` para adjuntar el JWT del `authStore` en las llamadas.
- [x] 1.4 Configurar *Response Interceptor* en `src/shared/api/axios.ts` para manejar el refresco de token transparente ante errores 401.

## 2. Desarrollo de Formularios (UI)

- [x] 2.1 Crear el componente de formulario de inicio de sesión (`src/pages/auth/LoginPage.tsx`) usando TanStack Form.
- [x] 2.2 Crear el componente de formulario de registro (`src/pages/auth/RegisterPage.tsx`) usando TanStack Form con validación de contraseñas seguras.
- [x] 2.3 Implementar feedback visual (loaders, manejo de errores) en ambos formularios utilizando el `uiStore` o estado local.

## 3. Integración de Routing y Protección

- [x] 3.1 Registrar rutas `/login` y `/register` en el enrutador (`src/app/routes/AppRouter.tsx`).
- [x] 3.2 Crear componente `ProtectedRoute` (`src/shared/components/ProtectedRoute.tsx`) para proteger rutas privadas.
- [x] 3.3 Crear componente `RoleBasedRoute` (`src/shared/components/RoleBasedRoute.tsx`) para proteger rutas basadas en roles.
- [x] 3.4 Implementar lógica de redirección post-login: redirigir a `/` si el rol es solo CLIENTE, o a `/dashboard` si tiene roles administrativos (ADMIN, STOCK, PEDIDOS).

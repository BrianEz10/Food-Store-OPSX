## Context

El proyecto "Food Store" requiere autenticación para que clientes y administradores operen. El backend ya provee los endpoints necesarios (`/login`, `/register`, `/refresh`, `/logout`), basados en JWT y cookies/hashing seguros. Actualmente el frontend (en `FRONTEND/src`) posee un scaffolding inicial y Zustand instalado. Ahora, se debe integrar el frontend con la API para dar acceso seguro a los usuarios, manteniendo la arquitectura Feature-Sliced Design (FSD).

## Goals / Non-Goals

**Goals:**
- Proveer interfaces de Login y Registro funcionales y amigables.
- Implementar la gestión del estado global de sesión mediante `Zustand` (`authStore`).
- Configurar interceptores HTTP (`Axios`) para adjuntar automáticamente el JWT y realizar _silent refreshes_ al recibir un error `401`.
- Redireccionar usuarios según su rol tras un login exitoso.

**Non-Goals:**
- Implementar la gestión de perfiles de usuario o direcciones en este paso (eso pertenece al Change 06).
- Implementar Recuperación/Reset de contraseñas.
- Cambiar la estructura de la API backend (ya fue definida e implementada en el change previo).

## Decisions

1. **Gestión de Estado (Zustand)**
   - **Por qué:** `Zustand` es ligero y no requiere envolver la app en Context Providers pesados.
   - **Decisión:** El `authStore` guardará `isAuthenticated`, `user` (datos básicos y roles), y el `accessToken`. El `refreshToken` debe ser gestionado vía cookie HttpOnly por el backend para seguridad, o si es enviado en el response, almacenado en memoria temporal, pero preferiblemente el frontend delegará el refresh al endpoint `/api/v1/auth/refresh`.
   - **Alternativa:** Usar Context API o Redux. Rechazado por complejidad y boilerplate.

2. **Interceptores de Axios**
   - **Por qué:** Evita inyectar el token en cada llamada manualmente.
   - **Decisión:** 
     - *Request Interceptor*: Añade `Authorization: Bearer <token>`.
     - *Response Interceptor*: Si hay un `401 Unauthorized`, realiza una llamada al endpoint de `/refresh`. Si tiene éxito, reintenta la solicitud original. Si falla, despacha el `logout` de `authStore` y redirige al login.
   - **Alternativa:** Controlar el token expirado en cada componente usando React Query `onError`. Rechazado porque viola el principio DRY y es menos robusto frente a múltiples llamadas simultáneas.

3. **Formularios con TanStack Form**
   - **Por qué:** Especificado en las reglas de arquitectura del proyecto (`.agents/AGENTS.md`).
   - **Decisión:** Utilizar `useForm` de `@tanstack/react-form` para manejar la validación del lado del cliente en los componentes de Login y Register.

4. **Redirección Basada en Roles**
   - **Por qué:** Diferentes tipos de usuario entran a la plataforma para hacer cosas distintas.
   - **Decisión:** Una vez hecho el login, se verifica el listado de roles del usuario. Si incluye `ADMIN`, `STOCK` o `PEDIDOS`, se enviará al dashboard/panel de control correspondiente. Si es sólo `CLIENT`, irá al catálogo/home.

## Risks / Trade-offs

- **Risk:** Condición de carrera en el Response Interceptor si múltiples requests fallan con 401 simultáneamente.
  - **Mitigation:** Implementar un mecanismo de "cola de requests pendientes" o semáforo durante la ejecución del request de `/refresh` para que todos los requests bloqueados esperen al nuevo token antes de reintentarse o fallar.
- **Risk:** Token almacenado en `localStorage` (XSS vulnerability).
  - **Mitigation:** El backend implementó el refresh token en base de datos. El Access Token se mantiene en el store de Zustand (memoria) o temporalmente. Se ajustará la arquitectura para mantener un equilibrio entre usabilidad y seguridad.

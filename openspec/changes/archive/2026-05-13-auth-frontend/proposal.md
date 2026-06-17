## Why

El backend de autenticación (`auth-backend`) ya fue implementado exitosamente, proveyendo los endpoints seguros para registro, login y refresco de tokens. Ahora es el momento de implementar la interfaz de usuario para que los clientes y administradores puedan autenticarse e interactuar con la plataforma. Esto desbloquea el flujo principal del e-commerce y protege las rutas privadas.

## What Changes

- Creación de la página de Login con validación de formulario.
- Creación de la página de Registro con validación de formulario.
- Integración de los endpoints de autenticación con el `authStore` de Zustand existente.
- Implementación de interceptores en Axios para enviar automáticamente el token JWT y manejar la renovación (refresh token) de forma transparente.
- Redirección automática post-login basada en el rol del usuario.

## Capabilities

### New Capabilities
- `frontend-auth-flow`: Define los flujos de usuario en el cliente para login, registro y redirecciones basadas en roles, así como el manejo de formularios.

### Modified Capabilities
- `client-state`: Se actualizará para detallar cómo el `authStore` maneja específicamente el login, logout y la sincronización con el servidor.
- `http-client`: Se actualizará para incorporar las reglas del interceptor JWT (adjuntar token en headers y refrescar transparentemente en caso de 401).
- `user-auth`: Se amplía para cubrir las reglas de negocio del frontend (ej. validaciones de campos en el cliente).

## Impact

- Frontend: Nuevas rutas públicas (`/login`, `/register`).
- Frontend: `src/shared/api/axios.ts` será modificado para incluir los interceptores.
- Frontend: `src/shared/stores/authStore.ts` será integrado con la API real.
- Frontend: Se utilizará `TanStack Form` para los formularios.

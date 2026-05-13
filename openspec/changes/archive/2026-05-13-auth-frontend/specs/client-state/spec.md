## MODIFIED Requirements

### Requirement: authStore — Estado de autenticación
El sistema SHALL proveer un store Zustand `authStore` que gestione el estado de autenticación del usuario. El store interactuará con Axios para acciones como el logout.

#### Scenario: Estado inicial
- **WHEN** la app inicia sin sesión previa
- **THEN** el authStore tiene: `accessToken: null`, `refreshToken: null`, `user: null`, `isAuthenticated: false`

#### Scenario: Login exitoso
- **WHEN** se invoca `setTokens(access, refresh)` y `setUser(user)`
- **THEN** el store actualiza los tokens, el usuario, y `isAuthenticated` se vuelve `true`

#### Scenario: Verificación de rol
- **WHEN** se invoca `hasRole('ADMIN')` y el usuario tiene rol ADMIN
- **THEN** retorna `true`

#### Scenario: Logout
- **WHEN** se invoca `logout()`
- **THEN** realiza opcionalmente la petición de logout al backend, todos los campos se resetean a su estado inicial y `isAuthenticated` se vuelve `false`.

#### Scenario: Inicialización de sesión al cargar app
- **WHEN** se invoca `initialize()` al iniciar la app
- **THEN** si hay tokens guardados (ej. en memoria o temporales antes del refresco automático), intenta recuperar el usuario.

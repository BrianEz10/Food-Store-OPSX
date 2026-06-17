## ADDED Requirements

### Requirement: Instancia Axios centralizada
El sistema SHALL proveer una única instancia Axios configurada como punto central de comunicación HTTP con el backend.

#### Scenario: Base URL desde variables de entorno
- **WHEN** se crea la instancia Axios
- **THEN** el `baseURL` se obtiene de `import.meta.env.VITE_API_URL` (default: `http://localhost:8000`)

#### Scenario: Timeout configurado
- **WHEN** un request tarda más de 15 segundos
- **THEN** Axios aborta el request con un error de timeout

#### Scenario: Content-Type por defecto
- **WHEN** se envía un request sin headers explícitos
- **THEN** el header `Content-Type` es `application/json`

### Requirement: Interceptor de request — inyección JWT
El sistema SHALL inyectar automáticamente el access token en cada request HTTP saliente.

#### Scenario: Token disponible
- **WHEN** el authStore contiene un `accessToken`
- **THEN** cada request incluye el header `Authorization: Bearer <token>`

#### Scenario: Token no disponible
- **WHEN** el authStore NO tiene un `accessToken` (usuario no autenticado)
- **THEN** el request se envía sin header Authorization

### Requirement: Interceptor de response — refresh transparente
El sistema SHALL intentar renovar el access token automáticamente cuando el backend responde con 401.

#### Scenario: Primer 401 con refresh token disponible
- **WHEN** un request recibe 401 y existe un refresh token en authStore
- **THEN** se intenta renovar el access token y se reenvía el request original con el nuevo token

#### Scenario: Refresh exitoso
- **WHEN** la renovación del token tiene éxito
- **THEN** el authStore se actualiza con el nuevo access token y el request original se completa transparentemente

#### Scenario: Refresh fallido
- **WHEN** la renovación del token falla (refresh expirado, revocado, etc.)
- **THEN** se ejecuta `authStore.logout()` y el error se propaga al caller

#### Scenario: Prevención de loops infinitos
- **WHEN** un request ya fue reintentado una vez (flag `_retry`)
- **THEN** NO se intenta renovar de nuevo — el error se propaga directamente

### Requirement: TanStack Query — QueryClient global
El sistema SHALL configurar un QueryClient global con defaults sensatos para un e-commerce.

#### Scenario: Stale time configurado
- **WHEN** se ejecuta un query
- **THEN** los datos se consideran frescos (no stale) por 5 minutos antes de re-fetchar

#### Scenario: Cache time configurado
- **WHEN** un query no tiene observers activos (ningún componente lo usa)
- **THEN** los datos permanecen en cache por 10 minutos antes de ser garbage collected

#### Scenario: Retry conservativo
- **WHEN** un query falla
- **THEN** se reintenta máximo 1 vez (no se reintentan mutations)

#### Scenario: No refetch on focus
- **WHEN** el usuario cambia de pestaña y vuelve
- **THEN** los datos NO se refetchan automáticamente (evita load innecesario)

#### Scenario: Provider global
- **WHEN** la app se renderiza
- **THEN** el `QueryClientProvider` envuelve toda la app y está disponible para todos los componentes

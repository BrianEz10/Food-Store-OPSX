# Tasks: auth-backend

## 1. Schemas (Pydantic V2)

- [x] 1.1 Crear `app/modules/auth/schemas.py` con modelos de request/response
- [x] 1.2 `UserRegisterRequest`: email (EmailStr), password (str, min 8), nombre, apellido
- [x] 1.3 `UserLoginRequest`: email, password
- [x] 1.4 `TokenResponse`: access_token, refresh_token, token_type, expires_in
- [x] 1.5 `TokenRefreshRequest`: refresh_token
- [x] 1.6 `UserResponse`: id, email, nombre, apellido, roles (lista)
- [x] 1.7 `MessageResponse`: detail (para logout y errores)

## 2. Repository (CRUD Layer)

- [x] 2.1 Implementar `app/modules/auth/repository.py`
- [x] 2.2 `get_user_by_email`: busca usuario por email activo (eliminado_en is null)
- [x] 2.3 `create_user`: crea nuevo usuario con password_hash
- [x] 2.4 `get_refresh_token`: obtiene refresh token válido por token string
- [x] 2.5 `create_refresh_token`: crea nuevo refresh token vinculado al usuario
- [x] 2.6 `mark_refresh_token_used`: marca token como usado (rotación)
- [x] 2.7 `get_user_with_roles`: obtiene usuario con roles cargados

## 3. Service (Business Logic)

- [x] 3.1 Implementar `app/modules/auth/service.py`
- [x] 3.2 `register`: valida email único, hashea password, crea usuario, asigna rol CLIENT
- [x] 3.3 `authenticate`: verifica credenciales, retorna usuario si es válido
- [x] 3.4 `create_tokens`: genera access token (JWT) y refresh token
- [x] 3.5 `refresh_access_token`: valida refresh token, genera nuevos tokens, rota el anterior
- [x] 3.6 `logout`: marca refresh token como usado
- [x] 3.7 `get_user_roles`: obtiene lista de roles del usuario

## 4. Router (API Endpoints)

- [x] 4.1 Implementar `app/modules/auth/router.py`
- [x] 4.2 `POST /register`: endpoint de registro con validación de schemas
- [x] 4.3 `POST /login`: endpoint de login con autenticación y retorno de tokens
- [x] 4.4 `POST /refresh`: endpoint de renovación con rotación
- [x] 4.5 `POST /logout`: endpoint de cierre de sesión (requiere auth)
- [x] 4.6 Registrar router en `app/main.py` bajo `/api/v1/auth`
- [x] 4.7 Agregar tags=["auth"] al router

## 5. Rate Limiting

- [x] 5.1 Configurar slowapi en `app/main.py`
- [x] 5.2 Agregar limitador: 5 requests por 15 minutos en `/login`
- [x] 5.3 Custom exception handler para RateLimitExceeded
- [x] 5.4 Retornar 429 con header Retry-After y mensaje claro

## 6. Integration & Verification

- [x] 6.1 Importar y usar el módulo de auth en `app/main.py`
- [x] 6.2 Verificar que endpoints aparecen en `/docs` (OpenAPI)
- [x] 6.3 Probar registro con curl/postman: email nuevo debe retornar 201
- [x] 6.4 Probar registro con email duplicado: debe retornar 409
- [x] 6.5 Probar login con credenciales correctas: debe retornar tokens
- [x] 6.6 Probar login con password incorrecto: debe retornar 401
- [x] 6.7 Probar refresh token: debe retornar nuevos tokens
- [x] 6.8 Probar logout: debe invalidar el refresh token
- [x] 6.9 Probar rate limiting: 6to intento debe retornar 429
- [x] 6.10 Ejecutar pytest si existen tests existentes
# Proposal: auth-backend

## Why

El sistema Food Store necesita un módulo de autenticación robusto para permitir que los usuarios se registren, inicien sesión y mantengan sesiones seguras. Sin autenticación, no es posible implementar el resto de las funcionalidades del sistema (carrito, pedidos, pagos, etc.). El change 03a del roadmap establece que este es el primer paso crítico después del setup-backend-core, y depende directamente de los modelos de Usuario, Rol y RefreshToken creados en dicho change.

## What Changes

- **Nuevo módulo `auth/`** completo con schemas, repository, service y router
- **Endpoint `POST /api/v1/auth/register`**: registro de nuevos usuarios con validación de email único y hash bcrypt (cost factor ≥ 12)
- **Endpoint `POST /api/v1/auth/login`**: autenticación con email/password, retorna access token + refresh token, aplica rate limiting (5 intentos / 15 min)
- **Endpoint `POST /api/v1/auth/refresh`**: renovación de access token usando refresh token válido con rotación en BD
- **Endpoint `POST /api/v1/auth/logout`**: invalida el refresh token actual del usuario
- **Sistema de roles** basado en RBAC: CLIENT (default), STOCK, PEDIDOS, ADMIN
- **JWT con expiración configurable** via settings (HS256)
- **Refresh tokens almacenados en BD** con rotación: cada refresh genera un nuevo token y revierte el anterior
- **Rate limiting** en `/login` con slowapi: 5 intentos máximos por IP en 15 minutos

## Capabilities

### New Capabilities

- `user-auth`: Gestión completa de autenticación y autorización con JWT, incluyendo register, login, logout y refresh token con rotación en base de datos. Expone endpoints protegidos por roles.
- `rate-limiting`: Protección contra ataques de fuerza bruta en endpoints de autenticación, específicamente en `/login` con límites de 5 intentos por IP cada 15 minutos.

### Modified Capabilities

- Ninguna. Este change no modifica requisitos de capabilities existentes.

## Impact

- **Backend**: Nuevo directorio `app/modules/auth/` con archivos `model.py` (ya existe estructura), `schemas.py`, `repository.py`, `service.py`, `router.py`
- **Configuración**: Se utilizan las variables `ACCESS_TOKEN_EXPIRE_MINUTES`, `REFRESH_TOKEN_EXPIRE_DAYS`, `SECRET_KEY` y `ALGORITHM` ya definidas en `app/core/config.py`
- **Dependencias**: Requiere `python-jose[cryptography]` para JWT, `passlib[bcrypt]` para hashing, y `slowapi` para rate limiting (ya incluidas en requirements del setup-backend-core)
- **Database**: Sin nuevas tablas — utiliza las tablas `usuarios`, `roles`, `usuarios_roles` y `refresh_tokens` del change 01
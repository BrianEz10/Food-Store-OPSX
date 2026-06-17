# Design: auth-backend

## Context

Este change implementa el módulo de autenticación completo para Food Store. El change 01 (setup-backend-core) ya proveyó:
- Modelos: `Usuario`, `Rol`, `UsuarioRol`, `RefreshToken`
- Código base: `app/core/security.py` (hash_password, verify_password, create_access_token, create_refresh_token, decode_access_token)
- Código base: `app/core/dependencies.py` (get_current_user, require_role)
- Configuración: ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS, SECRET_KEY, ALGORITHM

El change 03a requiere completar los archivos vacíos en `app/modules/auth/` y añadir la lógica de negocio completa.

## Goals / Non-Goals

**Goals:**
- Implementar registro de usuarios con hash bcrypt (cost factor >= 12)
- Implementar login con JWT (access + refresh token) y rotación en BD
- Implementar logout que invalida el refresh token
- Implementar refresh token con rotación automática
- Proteger endpoints con RBAC usando `require_role`
- Proteger endpoint `/login` con rate limiting (5 intentos/15min por IP)

**Non-Goals:**
- No implementar autenticación OAuth2 (Google, Facebook, etc.) — queda fuera del alcance de este change
- No implementar recuperación de contraseña — será un change futuro
- No implementar verificación de email — será un change futuro
- No modificar el schema de la base de datos — se usa lo existente

## Decisions

### D1: JWT symmetric (HS256) en lugar de asymmetric (RS256)

**Decisión:** Usar JWT con algoritmo HS256 (simétrico) usando SECRET_KEY del config.

**Alternativas consideradas:**
- RS256 (asimétrico): Mayor seguridad, pero requiere infraestructura de keys más compleja, no necesaria para un e-commercemono-repo.

**Rationale:** El proyecto es un mono-repo con backend y frontend en el mismo dominio. HS256 es suficiente para este caso de uso y simplifica la implementación manteniendo seguridad adecuada con una clave segura (256 bits mínimo).

---

### D2: Rotación de refresh tokens en base de datos

**Decisión:** Al hacer refresh, generar un nuevo refresh token y marcar el anterior como usado.

**Alternativas consideradas:**
- No rotar: Mantener el mismo refresh token hasta que expire. Mayor riesgo si es robado.
- Blacklist: Mantener lista de tokens revocados. Overhead de storage a largo plazo.

**Rationale:** La rotación previene el uso de tokens robados. Al generar un nuevo token con cada refresh, cualquier token anterior queda inválido. El modelo `RefreshToken` ya existe con campo `usado` para esto.

---

### D3: Rate limiting con slowapi (Redis-backend opcional)

**Decisión:** Usar slowapi para rate limiting con limitador en memoria por defecto, con opción de migrar a Redis si hay múltiples instancias.

**Alternativas consideradas:**
- Custom con Redis: Más complejo de implementar, pero necesario para múltiples instancias.
-第三方 (Cloudflare, AWS WAF): Costoso, overkill para este proyecto.

**Rationale:** slowapi proporciona una solución simple y efectiva para el caso de una sola instancia. El límite de 5 intentos/15min es suficientemente restrictivo para prevenir ataques de fuerza bruta básicos.

---

### D4: Password hashing con bcrypt cost factor 12

**Decisión:** Usar bcrypt con default (12) en lugar de valores menores.

**Alternativas consideradas:**
- Cost factor 10: Más rápido, menos seguro.
- Cost factor 14: Más seguro, pero puede afectar UX en móviles.

**Rationale:** Cost factor 12 es el balance recomendado por OWASP para 2024. El overhead en velocidad es aceptable (aproximadamente 250ms por hash) y proporciona protección adecuada contra rainbow tables y ataques de fuerza bruta.

---

### D5: Estructura del módulo auth

**Decisión:** Seguir la estructura feature-first del proyecto: `model.py`, `schemas.py`, `repository.py`, `service.py`, `router.py`.

**Rationale:** Mantiene consistencia con el resto de los módulos del proyecto (usuarios, productos, pedidos, etc.). El archivo model.py ya existe aunque está vacío.

## Implementation Notes

### Endpoints

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/api/v1/auth/register` | POST | Registro de usuario | No |
| `/api/v1/auth/login` | POST | Login (con rate limit) | No |
| `/api/v1/auth/refresh` | POST | Renovación de access token | No (refresh token) |
| `/api/v1/auth/logout` | POST | Cerrar sesión | Sí (access token) |

### Estructura de archivos

```
backend/app/modules/auth/
├── __init__.py
├── model.py       # Ya existe, vacío
├── schemas.py     # Pydantic models para request/response
├── repository.py  # CRUD de usuarios y refresh tokens
├── service.py     # Lógica de negocio (authenticate, register, refresh)
└── router.py      # Endpoints FastAPI
```

### Dependencias del sistema

- **Request validation**: Pydantic V2 (model_config, field_validator)
- **Database**: SQLAlchemy async con el BaseRepository existente
- **Security**: passlib[bcrypt], python-jose[cryptography]
- **Rate limiting**: slowapi

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| **R1**: Token robado durante transmisión | → Usar HTTPS en producción; el access token es de corta duración (15 min) |
| **R2**: Rate limiting se resetea al reiniciar servidor | → Para producción, usar slowapi con backend Redis |
| **R3**: Usuario no puede hacer logout desde otro dispositivo | → El logout solo invalida el refresh token actual; otros dispositivos mantienen acceso hasta que su token expire |
| **R4**: Race condition en refresh token rotation | → Usar SELECT FOR UPDATE en la query del refresh token |

## Open Questions

1. ¿Se requiere implementar verificación de email antes de que el usuario pueda hacer login? (Pendiente, potentially change futuro)
2. ¿El admin puede crear usuarios directamente sin verificación de email?
3. ¿Cuántos refresh tokens simultáneos por usuario se permiten? (Por defecto: 1, el último usado)

## Migration Plan

1. **Setup**: Asegurar que las tablas `usuarios`, `roles`, `usuarios_roles`, `refresh_tokens` existan (del change 01)
2. **Deploy**: Desplegar el nuevo módulo `auth/` en el backend
3. **Test**: Verificar que los endpoints funcione correctamente en `/docs`
4. **Rollback**: Si hay errores, el cambio es backwards-compatible ya que no modifica tablas existentes
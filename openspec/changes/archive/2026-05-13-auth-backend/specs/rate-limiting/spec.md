# Spec: rate-limiting

## Overview

Protección contra ataques de fuerza bruta en endpoints de autenticación. Específicamente, el endpoint de `/login` debe tener límites de intentos por IP en un período de tiempo configurable, retornando errores 429 cuando se exceda el límite.

## ADDED Requirements

### Requirement: Rate limiting en endpoint de login

The system MUST limit the number of login attempts per IP address to prevent brute force attacks. When the limit is exceeded, the system MUST return HTTP 429 Too Many Requests.

#### Scenario: Login dentro del límite de intentos
- **WHEN** el usuario envía POST /api/v1/auth/login desde una IP con menos de 5 intentos en los últimos 15 minutos
- **THEN** el sistema procesa la solicitud normalmente y retorna el resultado del login

#### Scenario: Login excede el límite de intentos
- **WHEN** el usuario envía POST /api/v1/auth/login desde una IP que ya realizó 5 intentos fallidos en los últimos 15 minutos
- **THEN** el sistema retorna 429 Too Many Requests con header Retry-After indicando el tiempo restante

#### Scenario: Contador se reinicia después del período
- **WHEN** pasan 15 minutos desde el último intento fallido de login desde una IP
- **THEN** el contador de intentos para esa IP se reinicia a 0

#### Scenario: Login exitoso no reinicia el contador de intentos fallidos
- **WHEN** el usuario envía POST /api/v1/auth/login con credenciales válidas (login exitoso)
- **THEN** el sistema permite el acceso y el contador de intentos fallidos de esa IP permanece sin cambios

---

### Requirement: Rate limiting retorna información clara

The system MUST return clear information in rate limiting responses so the client can handle the situation appropriately.

#### Scenario: Respuesta de rate limit
- **WHEN** una IP excede el límite de intentos de login
- **THEN** el sistema retorna:
  - Código HTTP 429
  - Header `Retry-After` con los segundos restantes
  - Body con detalle "Demasiados intentos. Intenta de nuevo en X segundos"
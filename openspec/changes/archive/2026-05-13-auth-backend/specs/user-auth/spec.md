# Spec: user-auth

## Overview

Gestión completa de autenticación y autorización con JWT, incluyendo registro de usuarios, login, logout y renovación de access token con rotación de refresh tokens en base de datos. Expone endpoints protegidos por roles del sistema (CLIENT, STOCK, PEDIDOS, ADMIN).

## ADDED Requirements

### Requirement: Usuario puede registrarse en el sistema

The system MUST allow new users to register providing unique email, password, name and surname. The password MUST be hashed with bcrypt before storage. By default, the user will receive the CLIENT role.

#### Scenario: Registro exitoso con datos válidos
- **WHEN** el usuario envía POST /api/v1/auth/register con email válido, password de al menos 8 caracteres, nombre y apellido
- **THEN** el sistema crea el usuario en la base de datos con password hasheado, asigna rol CLIENT por defecto, y retorna 201 con los datos del usuario (sin password_hash)

#### Scenario: Registro con email duplicado
- **WHEN** el usuario envía POST /api/v1/auth/register con un email que ya existe en el sistema
- **THEN** el sistema retorna 409 Conflict con detalle "Email ya registrado"

#### Scenario: Registro con password débil
- **WHEN** el usuario envía POST /api/v1/auth/register con password de menos de 8 caracteres
- **THEN** el sistema retorna 422 Unprocessable Entity con error de validación en el campo password

#### Scenario: Registro con email inválido
- **WHEN** el usuario envía POST /api/v1/auth/register con formato de email inválido
- **THEN** el sistema retorna 422 Unprocessable Entity con error de validación en el campo email

---

### Requirement: Usuario puede iniciar sesión

The system MUST allow authenticated users to obtain an access token and refresh token via valid email and password. The system MUST verify the password using bcrypt.

#### Scenario: Login exitoso con credenciales correctas
- **WHEN** el usuario envía POST /api/v1/auth/login con email y password correctos
- **THEN** el sistema retorna 200 con access_token (JWT), refresh_token, token_type "bearer" y expires_in

#### Scenario: Login con password incorrecto
- **WHEN** el usuario envía POST /api/v1/auth/login con email válido pero password incorrecto
- **THEN** el sistema retorna 401 Unauthorized con detalle "Credenciales inválidas"

#### Scenario: Login con email inexistente
- **WHEN** el usuario envía POST /api/v1/auth/login con email que no existe en el sistema
- **THEN** el sistema retorna 401 Unauthorized con detalle "Credenciales inválidas"

#### Scenario: Login con usuario eliminado (soft delete)
- **WHEN** el usuario envía POST /api/v1/auth/login con email de usuario que tiene eliminado_en != NULL
- **THEN** el sistema retorna 401 Unauthorized con detalle "Credenciales inválidas"

---

### Requirement: Usuario puede renovar access token

The system MUST allow users with a valid refresh token to obtain a new access token without re-authentication. The system MUST implement refresh token rotation.

#### Scenario: Refresh exitoso con token válido
- **WHEN** el usuario envía POST /api/v1/auth/refresh con un refresh token válido
- **THEN** el sistema retorna un nuevo access_token, un nuevo refresh_token, y marca el token anterior como usado (rotación)

#### Scenario: Refresh con token expirado
- **WHEN** el usuario envía POST /api/v1/auth/refresh con un refresh token expirado
- **THEN** el sistema retorna 401 Unauthorized con detalle "Refresh token expirado"

#### Scenario: Refresh con tokenRevocado
- **WHEN** el usuario envía POST /api/v1/auth/refresh con un refresh token que fue marcado como usado o revocado
- **THEN** el sistema retorna 401 Unauthorized con detalle "Refresh token inválido"

---

### Requirement: Usuario puede cerrar sesión

The system MUST allow authenticated users to invalidate their current refresh token, effectively closing the session.

#### Scenario: Logout exitoso
- **WHEN** el usuario autenticado envía POST /api/v1/auth/logout con el refresh token actual
- **THEN** el sistema marca el refresh token como usado/revocado y retorna 200 OK

#### Scenario: Logout sin token
- **WHEN** el usuario autenticado envía POST /api/v1/auth/logout sin proporcionar refresh token
- **THEN** el sistema retorna 400 Bad Request con detalle "Refresh token requerido"

---

### Requirement: Endpoints pueden requerir roles específicos

The system MUST allow endpoints to require specific user roles for access, implementing RBAC (Role-Based Access Control).

#### Scenario: Acceso a endpoint protegido con rol correcto
- **WHEN** el usuario con rol STOCK accede a un endpoint que requiere rol STOCK
- **THEN** el sistema permite el acceso y ejecuta el endpoint

#### Scenario: Acceso a endpoint protegido sin rol requerido
- **WHEN** el usuario con rol CLIENT intenta acceder a un endpoint que requiere rol ADMIN
- **THEN** el sistema retorna 403 Forbidden con detalle "Se requiere uno de los roles: ADMIN"

#### Scenario: Acceso a endpoint protegido sin autenticación
- **WHEN** un usuario no autenticado intenta acceder a un endpoint protegido
- **THEN** el sistema retorna 401 Unauthorized con detalle "No autenticado"

---

### Requirement: Access token contiene información del usuario

The access token MUST include in its payload the user_id, user roles and a unique identifier (jti) for tracking.

#### Scenario: Decodificación de access token
- **WHEN** se decodifica un access token válido
- **THEN** el payload contiene: sub (user_id), roles (lista de roles), jti (UUID único), exp (expiración)

---

### Requirement: Contraseña almacenada de forma segura

The system MUST store passwords using bcrypt with a cost factor of at least 12.

#### Scenario: Hash de password con bcrypt
- **WHEN** el sistema crea un hash de password
- **THEN** el hash utiliza bcrypt con cost factor >= 12
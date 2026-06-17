## User Profile

**Capability:** User Profile Management  
**Introduced in:** Change 06 — perfil-y-direcciones  
**Endpoints:** `GET /api/v1/usuarios/me`, `PATCH /api/v1/usuarios/me`, `PATCH /api/v1/usuarios/me/password`

---

## Requirements

### Requirement: Usuario puede ver su propio perfil

The system SHALL allow an authenticated user to retrieve their own profile data via `GET /api/v1/usuarios/me`. The response MUST include: id, nombre, apellido, email, roles, and creado_en. The password_hash MUST NOT be included in the response.

#### Scenario: Ver perfil con token válido
- **WHEN** el usuario autenticado envía GET /api/v1/usuarios/me con un access token válido
- **THEN** el sistema retorna 200 con los campos: id, nombre, apellido, email, roles (lista de strings), creado_en

#### Scenario: Ver perfil sin autenticación
- **WHEN** una petición anónima envía GET /api/v1/usuarios/me sin Authorization header
- **THEN** el sistema retorna 401 Unauthorized con detalle "No autenticado"

---

### Requirement: Usuario puede editar su propio perfil

The system SHALL allow an authenticated user to update their nombre and/or apellido via `PATCH /api/v1/usuarios/me`. All fields are optional (partial update). The email MUST NOT be modifiable through this endpoint.

#### Scenario: Edición parcial exitosa de nombre
- **WHEN** el usuario autenticado envía PATCH /api/v1/usuarios/me con body `{"nombre": "NuevoNombre"}`
- **THEN** el sistema actualiza solo el campo nombre y retorna 200 con el perfil actualizado completo

#### Scenario: Edición con body vacío
- **WHEN** el usuario autenticado envía PATCH /api/v1/usuarios/me con body `{}`
- **THEN** el sistema retorna 200 con el perfil sin cambios (operación no-op válida)

#### Scenario: Intento de editar email
- **WHEN** el usuario autenticado envía PATCH /api/v1/usuarios/me con body `{"email": "nuevo@email.com"}`
- **THEN** el sistema ignora el campo email y solo procesa campos permitidos (nombre, apellido)

---

### Requirement: Usuario puede cambiar su contraseña

The system SHALL allow an authenticated user to change their password via `PATCH /api/v1/usuarios/me/password`. The request MUST include the current_password for verification. The new password MUST be at least 8 characters. The new password MUST be hashed with bcrypt (cost factor ≥ 12) before storage.

#### Scenario: Cambio de contraseña exitoso
- **WHEN** el usuario autenticado envía PATCH /api/v1/usuarios/me/password con current_password correcto y new_password de al menos 8 caracteres
- **THEN** el sistema verifica el hash de current_password, hashea new_password con bcrypt cost ≥ 12, actualiza la BD, y retorna 200 con mensaje de confirmación

#### Scenario: Cambio de contraseña con current_password incorrecto
- **WHEN** el usuario autenticado envía PATCH /api/v1/usuarios/me/password con current_password que no coincide con el hash almacenado
- **THEN** el sistema retorna 400 Bad Request con detalle "Contraseña actual incorrecta"

#### Scenario: Cambio de contraseña con new_password débil
- **WHEN** el usuario autenticado envía PATCH /api/v1/usuarios/me/password con new_password de menos de 8 caracteres
- **THEN** el sistema retorna 422 Unprocessable Entity con error de validación en el campo new_password

#### Scenario: Cambio de contraseña sin autenticación
- **WHEN** una petición anónima envía PATCH /api/v1/usuarios/me/password
- **THEN** el sistema retorna 401 Unauthorized con detalle "No autenticado"

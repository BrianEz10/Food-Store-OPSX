# admin-user-management Specification

## Purpose
TBD - created by archiving change admin-usuarios-y-catalogo. Update Purpose after archive.
## Requirements
### Requirement: Listado de usuarios (admin)
El sistema SHALL exponer `GET /api/v1/admin/usuarios` que retorne un listado paginado de todos los usuarios. SHALL soportar filtro por rol (query param `rol`), búsqueda por nombre/apellido/email (query param `q`), paginación (`skip`/`limit`), y opción de incluir usuarios eliminados (`incluir_eliminados`). La respuesta SHALL incluir `data`, `total`, `skip`, `limit`.

#### Scenario: Admin lista usuarios sin filtros
- **WHEN** un usuario con rol ADMIN hace `GET /api/v1/admin/usuarios`
- **THEN** el sistema retorna los primeros 20 usuarios activos (no eliminados) ordenados por `creado_en` descendente

#### Scenario: Admin busca usuarios por texto
- **WHEN** un usuario ADMIN hace `GET /api/v1/admin/usuarios?q=john`
- **THEN** el sistema retorna usuarios cuyo nombre, apellido o email contengan "john" (LIKE insensitive)

#### Scenario: Admin filtra por rol
- **WHEN** un usuario ADMIN hace `GET /api/v1/admin/usuarios?rol=STOCK`
- **THEN** el sistema retorna solo usuarios que tengan el rol STOCK asignado

#### Scenario: Admin incluye usuarios eliminados
- **WHEN** un usuario ADMIN hace `GET /api/v1/admin/usuarios?incluir_eliminados=true`
- **THEN** el sistema retorna tanto usuarios activos como eliminados (soft-delete)

#### Scenario: Usuario no-admin no puede listar usuarios
- **WHEN** un usuario con rol CLIENT hace `GET /api/v1/admin/usuarios`
- **THEN** el sistema retorna `403 Forbidden`

### Requirement: Detalle de usuario (admin)
El sistema SHALL exponer `GET /api/v1/admin/usuarios/{id}` que retorne el detalle de un usuario con sus roles, fecha de creación, y estado (activo/eliminado).

#### Scenario: Admin ve detalle de usuario
- **WHEN** un ADMIN hace `GET /api/v1/admin/usuarios/5`
- **THEN** el sistema retorna `AdminUsuarioDetailResponse` con datos del usuario, roles, estado y auditoría

#### Scenario: Usuario inexistente
- **WHEN** un ADMIN hace `GET /api/v1/admin/usuarios/99999`
- **THEN** el sistema retorna `404 Not Found`

### Requirement: Editar usuario (admin)
El sistema SHALL exponer `PUT /api/v1/admin/usuarios/{id}` que permita modificar nombre, apellido, email y roles de un usuario.

#### Scenario: Admin asigna roles a un usuario
- **WHEN** un ADMIN hace `PUT /api/v1/admin/usuarios/5` con `{ "roles": ["STOCK", "PEDIDOS"] }`
- **THEN** el sistema actualiza los roles del usuario 5, asigna solo los roles indicados (reemplaza los anteriores), registra `asignado_por_id` con el ID del admin, e invalida sus refresh tokens

#### Scenario: Admin no puede quitarse el último rol ADMIN
- **WHEN** un ADMIN hace `PUT /api/v1/admin/usuarios/1` siendo el usuario 1 el único ADMIN y el payload excluye `ADMIN` de los roles
- **THEN** el sistema retorna `400 Bad Request` con mensaje "No puedes quitar el último rol ADMIN del sistema"

#### Scenario: Admin edita datos básicos
- **WHEN** un ADMIN hace `PUT /api/v1/admin/usuarios/5` con `{ "nombre": "Nuevo", "apellido": "Nombre", "email": "nuevo@test.com" }`
- **THEN** el sistema actualiza nombre, apellido y email del usuario 5

### Requirement: Activar/Desactivar usuario (admin)
El sistema SHALL exponer `PATCH /api/v1/admin/usuarios/{id}/estado` que permita activar (restaurar) o desactivar (soft-delete) un usuario. Al desactivar, SHALL invalidar todos sus refresh tokens.

#### Scenario: Admin desactiva un usuario
- **WHEN** un ADMIN hace `PATCH /api/v1/admin/usuarios/5/estado` con `{ "activo": false }`
- **THEN** el sistema marca al usuario 5 como eliminado (soft-delete) e invalida todos sus refresh tokens

#### Scenario: Admin restaura un usuario
- **WHEN** un ADMIN hace `PATCH /api/v1/admin/usuarios/5/estado` con `{ "activo": true }` y el usuario 5 estaba eliminado
- **THEN** el sistema restaura al usuario 5 (setea `eliminado_en` a NULL)

#### Scenario: Admin no puede desactivarse a sí mismo
- **WHEN** un ADMIN hace `PATCH /api/v1/admin/usuarios/1/estado` con `{ "activo": false }` siendo el usuario 1 el mismo admin autenticado
- **THEN** el sistema retorna `400 Bad Request` con mensaje "No puedes desactivar tu propio usuario"

### Requirement: Invalidación de refresh tokens
El sistema SHALL invalidar (revocar) todos los refresh tokens activos de un usuario cuando sus roles cambien o cuando sea desactivado. SHALL usar `UPDATE refresh_tokens SET revoked_at = NOW() WHERE usuario_id = :id AND revoked_at IS NULL`.

#### Scenario: Refresh tokens invalidados al cambiar rol
- **WHEN** un ADMIN cambia los roles de un usuario vía `PUT /api/v1/admin/usuarios/{id}`
- **THEN** el sistema revoca todos los refresh tokens activos de ese usuario

#### Scenario: Refresh tokens invalidados al desactivar
- **WHEN** un ADMIN desactiva un usuario vía `PATCH /api/v1/admin/usuarios/{id}/estado`
- **THEN** el sistema revoca todos los refresh tokens activos de ese usuario

### Requirement: Frontend — Página de gestión de usuarios (admin)
El frontend SHALL tener una ruta `/admin/usuarios` protegida con `ProtectedRoute` + `RoleBasedRoute` (rol `ADMIN`) que muestre una tabla de usuarios con búsqueda, filtro por rol, paginación, y modal de edición.

#### Scenario: Admin ve listado de usuarios
- **WHEN** un usuario ADMIN navega a `/admin/usuarios`
- **THEN** la UI muestra una tabla con columnas: ID, Nombre, Email, Roles (badges), Estado (activo/inactivo), Acciones

#### Scenario: Admin busca usuarios
- **WHEN** un ADMIN escribe en el campo de búsqueda
- **THEN** la UI aplica debounce de 400ms y actualiza los resultados filtrando por nombre, apellido o email

#### Scenario: Admin filtra por rol
- **WHEN** un ADMIN selecciona un rol del filtro
- **THEN** la UI muestra solo usuarios con ese rol

#### Scenario: Admin edita un usuario
- **WHEN** un ADMIN hace clic en "Editar" en una fila
- **THEN** se abre un modal con los datos del usuario y checkboxes de roles, donde puede modificar datos y roles

#### Scenario: Admin desactiva un usuario desde el listado
- **WHEN** un ADMIN hace clic en "Desactivar" en una fila
- **THEN** se muestra un modal de confirmación y al confirmar se desactiva al usuario

#### Scenario: Usuario no-admin no puede acceder
- **WHEN** un usuario CLIENT navega a `/admin/usuarios`
- **THEN** el sistema redirige a `/unauthorized`


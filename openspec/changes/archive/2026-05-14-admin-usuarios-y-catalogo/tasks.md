## 1. Backend — Schemas admin

- [x] 1.1 Crear `AdminUsuarioResponse` (id, nombre, apellido, email, telefono, roles: list[str], activo: bool, creado_en) en `admin/schemas.py`
- [x] 1.2 Crear `AdminUsuarioListResponse` (data, total, skip, limit) en `admin/schemas.py`
- [x] 1.3 Crear `AdminUsuarioUpdate` (nombre, apellido, email, roles) con todos opcionales en `admin/schemas.py`
- [x] 1.4 Crear `AdminUsuarioEstadoUpdate` (activo: bool) en `admin/schemas.py`
- [x] 1.5 Crear `AdminUsuarioDetailResponse` (hereda de AdminUsuarioResponse + asignado_por_id, actualizado_en) en `admin/schemas.py`

## 2. Backend — Service admin

- [x] 2.1 Crear `AdminService.listar_usuarios()` con búsqueda (ILIKE), filtro por rol, paginación, incluir_eliminados
- [x] 2.2 Crear `AdminService.get_usuario_detail()` con detalle completo del usuario
- [x] 2.3 Crear `AdminService.update_usuario()` que actualiza datos y roles, con validación de último ADMIN
- [x] 2.4 Crear `AdminService.toggle_usuario_estado()` que activa/desactiva con validación de auto-desactivación
- [x] 2.5 Agregar método `revoke_all_user_tokens()` en `auth/repository.py` que revoca todos los refresh tokens activos de un usuario
- [x] 2.6 Integrar `revoke_all_user_tokens()` en service al cambiar roles o desactivar

## 3. Backend — Router admin

- [x] 3.1 Crear `admin/router.py` con endpoints protegidos `require_role(["ADMIN"])`:
  - `GET /admin/usuarios` → listar
  - `GET /admin/usuarios/{id}` → detalle
  - `PUT /admin/usuarios/{id}` → editar
  - `PATCH /admin/usuarios/{id}/estado` → activar/desactivar
- [x] 3.2 Montar admin_router en `main.py` con `prefix="/api/v1"`

## 4. Frontend — Feature admin (api + queries + types)

- [x] 4.1 Crear carpeta `features/admin/` con `types.ts` (AdminUsuarioResponse, AdminUsuarioListResponse, AdminUsuarioUpdate, AdminUsuarioEstadoUpdate)
- [x] 4.2 Crear `features/admin/api.ts` con `fetchAdminUsuarios()`, `fetchAdminUsuario()`, `updateAdminUsuario()`, `toggleAdminUsuarioEstado()`
- [x] 4.3 Crear `features/admin/queries.ts` con `useAdminUsuarios()` (query con filtros y paginación), `useAdminUsuario()`, `useUpdateAdminUsuario()` (mutation), `useToggleUsuarioEstado()` (mutation)

## 5. Frontend — Componentes

- [x] 5.1 Crear `UserEditModal` con formulario de datos personales y checkboxes de roles (ADMIN, STOCK, PEDIDOS, CLIENT)
- [x] 5.2 Crear `UserStatusBadge` que muestre "Activo"/"Inactivo" con colores verde/rojo
- [x] 5.3 Crear `RoleBadges` que muestre los roles como badges coloreados (ADMIN=rojo, STOCK=azul, PEDIDOS=ámbar, CLIENT=verde)
- [x] 5.4 Crear `ConfirmToggleModal` para confirmar activación/desactivación con advertencia

## 6. Frontend — Página AdminUsuariosPage

- [x] 6.1 Crear `pages/admin/usuarios/AdminUsuariosPage.tsx` con tabla de usuarios, búsqueda con debounce, filtro por rol, paginación
- [x] 6.2 Integrar `UserEditModal` en la página para editar usuarios
- [x] 6.3 Integrar `ConfirmToggleModal` para activar/desactivar
- [x] 6.4 Manejar loading (skeleton), empty ("No hay usuarios"), y error states
- [x] 6.5 Crear ruta `/admin/usuarios` en `router.tsx` con `ProtectedRoute` + `RoleBasedRoute` (rol: ADMIN)

## 7. Validación y seguridad

- [x] 7.1 Verificar que un ADMIN no pueda sacarse el último rol ADMIN (test en service)
- [x] 7.2 Verificar que un ADMIN no pueda desactivarse a sí mismo (test en service)
- [x] 7.3 Verificar que al cambiar roles se invaliden los refresh tokens
- [x] 7.4 Verificar que al desactivar se invaliden los refresh tokens

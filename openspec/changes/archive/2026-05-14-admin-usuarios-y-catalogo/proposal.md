## Why

Actualmente no existe una interfaz de administración de usuarios. El admin no puede listar usuarios, cambiar roles ni desactivar cuentas. Tampoco existe protección contra auto-degradación del último administrador ni invalidación de sesiones al cambiar permisos. Sin esto, la gestión del sistema es insegura e incompleta. El catálogo y pedidos ya aceptan rol ADMIN, pero falta la UI de gestión de usuarios.

## What Changes

- **Backend**: Nuevo módulo `admin/` con endpoints para:
  - `GET /api/v1/admin/usuarios` — listado paginado con búsqueda, filtro por rol, opción de incluir eliminados
  - `GET /api/v1/admin/usuarios/{id}` — detalle de usuario con roles
  - `PUT /api/v1/admin/usuarios/{id}` — editar datos y roles
  - `PATCH /api/v1/admin/usuarios/{id}/estado` — activar/desactivar (soft delete/restore)
  - Invalidación de refresh tokens al cambiar rol o desactivar
  - Protección: admin no puede quitarse el último rol ADMIN
- **Frontend**: Nueva página `/admin/usuarios` con tabla de usuarios, búsqueda, filtro por rol, y modal de edición con asignación de roles
- **Router**: Registrar ruta `/admin/usuarios` (ya existe el nav item en sidebar)

## Capabilities

### New Capabilities
- `admin-user-management`: Gestión de usuarios del sistema (listar, buscar, editar roles, activar/desactivar) con invalidación de sesiones y protección del último ADMIN.

### Modified Capabilities
- *(ninguna — user-auth y user-profile no cambian sus requirements)*

## Impact

- **Backend**: `backend/app/modules/admin/` — nuevo router, schemas, service. `backend/app/main.py` — montar admin router. Auth repository — invalidación de refresh tokens.
- **Frontend**: Nueva página `frontend/src/pages/admin/usuarios/`, feature `frontend/src/features/admin/` (o reutilizar `features/admin/usuarios`), nueva ruta en `router.tsx`
- **Seguridad**: Endpoints protegidos con `require_role(["ADMIN"])`

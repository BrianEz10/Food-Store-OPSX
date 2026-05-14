## Context

El módulo admin no existe (archivos vacíos). El módulo usuarios solo tiene endpoints de perfil propio. Los refresh tokens se manejan en auth con rotación y revocación individual. La navegación ya tiene el item "Usuarios" en el sidebar apuntando a `/admin/usuarios`, pero la ruta no existe.

## Goals / Non-Goals

**Goals:**
- Endpoints admin de usuarios: listado con búsqueda/filtros, detalle, edición de roles, activar/desactivar
- Invalidación de refresh tokens al cambiar roles o desactivar
- Protección del último ADMIN (no auto-degradación)
- Página frontend `/admin/usuarios` con tabla, búsqueda, filtro, y modal de edición

**Non-Goals:**
- Dashboard de métricas (va en Change 13)
- Gestión de configuraciones del sistema (va en Change 13)
- Notificaciones push/email (fuera de alcance)
- Roles personalizados (solo los 4 existentes: ADMIN, STOCK, PEDIDOS, CLIENT)

## Decisions

### 1. Endpoints admin en módulo separado
**Decisión**: Crear router, schemas y service dentro de `backend/app/modules/admin/usuarios/` y montarlo como `prefix="/api/v1/admin"`.
**Alternativa**: Agregar endpoints admin al módulo `usuarios/` existente.
**Razón**: Separación de concerns — los endpoints de admin son un concern transversal (usuarios, pedidos, métricas) y merecen su propio módulo. Consistente con la estructura FSD del proyecto.

### 2. Búsqueda con ILIKE en backend (no FTS)
**Decisión**: Usar `ILIKE` con `%query%` para búsqueda sobre nombre, apellido y email.
**Alternativa**: Full-text search con PostgreSQL.
**Razón**: Volumen pequeño de usuarios (< 1000), ILIKE es suficiente, no justifica complejidad de FTS. El rendimiento es aceptable con índices en las columnas.

### 3. Reemplazo completo de roles (no adición/remoción individual)
**Decisión**: El endpoint `PUT /admin/usuarios/{id}` recibe un array completo de roles y reemplaza todos los existentes.
**Alternativa**: Endpoints separados `POST /roles` y `DELETE /roles`.
**Razón**: Más simple, evita estados inconsistentes, el frontend puede mandar el set completo fácilmente.

### 4. Invalidación de refresh tokens vía SQL masivo
**Decisión**: Al cambiar rol o desactivar, ejecutar `UPDATE refresh_tokens SET revoked_at = NOW() WHERE usuario_id = X AND revoked_at IS NULL`.
**Alternativa**: Invalidar uno por uno desde el repositorio.
**Razón**: Una sola query, atómica, eficiente. No necesita iterar.

### 5. Frontend con React Query + Zustand (no solo store)
**Decisión**: Usar React Query para data fetching (listado, detalle) y Zustand solo si hay estado compartido entre componentes.
**Alternativa**: Zustand store como categorías.
**Razón**: El patrón de admin pages existente es inconsistente (categorías usa store, productos usa api directo). React Query es superior para data fetching con cache, refetch y loading states. Consistente con el patrón de `pedidos/queries.ts`.

### 6. Modal de edición (no página separada)
**Decisión**: Edición de usuarios en modal, no en página separada.
**Alternativa**: Página de edición como `ProductFormPage`.
**Razón**: Consistente con `CategoryFormModal` e `IngredientFormModal`. La edición de usuario es simple (formulario + roles), no justifica una navegación separada.

## Risks / Trade-offs

- **[Seguridad]** La invalidación de refresh tokens al cambiar roles es crítica — si falla, el usuario mantiene acceso con permisos viejos → mitigado: la invalidez ocurre en la misma transacción que el cambio de roles
- **[UX]** Si un admin se cambia los roles a sí mismo y se saca ADMIN, su sesión actual sigue activa hasta que expire el access token (30 min). El refresh token se invalida, pero el access token sigue siendo válido → mitigado: es aceptable, el access token expira en 30 min como máximo
- **[Rendimiento]** La búsqueda con ILIKE `%query%` no usa índices tradicionales → mitigado: volumen pequeño de usuarios, se puede agregar índice trigram si es necesario
- **[Último ADMIN]** Si hay un solo ADMIN y se intenta sacar el rol, se bloquea. Pero si hay varios ADMIN y uno se saca su propio rol, se permite (porque no es el último) → riesgo: podría quedar como CLIENT sin poder recuperarse → mitigado: es intencional, hay al menos otro ADMIN que puede re-asignarlo

## Migration Plan

1. Crear schemas de admin en `admin/schemas.py`
2. Crear service con lógica de negocio en `admin/service.py`
3. Agregar método `revoke_all_user_tokens()` en auth/repository
4. Crear router admin en `admin/router.py`
5. Montar router en `main.py`
6. Frontend: feature admin con api + queries
7. Frontend: página AdminUsuariosPage
8. Registrar ruta en router.tsx

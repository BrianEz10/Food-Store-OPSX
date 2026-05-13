## Context

El sistema cuenta con modelos `Usuario`, `Direccion` y la infraestructura de autenticación JWT operativa (Change 03a). Los modelos ya están definidos en el ERD y sus tablas existen en la BD. Los usuarios pueden registrarse y autenticarse, pero aún no pueden ver ni editar su información personal ni gestionar sus direcciones de entrega, que son datos críticos para el flujo de checkout (Change 09a).

## Goals / Non-Goals

**Goals:**
- Exponer endpoints CRUD para perfil (`/api/v1/usuarios/me`) y direcciones (`/api/v1/direcciones`) bajo autenticación JWT
- Implementar cambio de contraseña con verificación de contraseña actual
- Garantizar ownership de direcciones: un usuario sólo puede ver y modificar sus propias direcciones
- Soporte de dirección predeterminada con invariante: si es la única, no puede eliminarse
- Frontend: páginas de Perfil y Gestión de Direcciones funcionales e integradas con el store de auth

**Non-Goals:**
- Verificación de email / confirmación de cuenta (fuera de scope)
- Gestión de usuarios por parte del admin (Change 12)
- Upload de foto de perfil / avatar
- Validación de direcciones con servicios externos de geocodificación

## Decisions

### 1. Módulo `usuarios/` separado de `auth/`

**Decisión**: Crear un módulo `usuarios/` independiente de `auth/` para gestión de perfil.

**Rationale**: `auth/` tiene responsabilidad única (emisión y validación de tokens). La gestión de perfil es una preocupación distinta. Seguir el patrón ya establecido de módulo por dominio (Change 01).

**Alternativa descartada**: Agregar endpoints de perfil dentro de `auth/router.py` — viola Single Responsibility y hace el módulo de auth más difícil de mantener.

### 2. Ownership de direcciones validado en la capa de servicio

**Decisión**: La capa de servicio verifica que `direccion.usuario_id == current_user.id` antes de cualquier operación de lectura/modificación/borrado.

**Rationale**: No depender del ORM ni de filtros de query para la seguridad — la verificación explícita en servicio es auditable y testeable de forma aislada. Retorna 404 (no 403) para no revelar existencia de recursos ajenos.

**Alternativa descartada**: Filtrar siempre por `usuario_id` en la query — correcto para listados, pero insuficiente para operaciones individuales donde el atacante conoce el ID.

### 3. Invariante de dirección predeterminada

**Decisión**: Al eliminar una dirección: si es predeterminada y es la única, rechazar con 409. Si es predeterminada pero hay otras, promover automáticamente la más reciente como predeterminada.

**Rationale**: El checkout requiere siempre una dirección disponible. La promoción automática evita que el usuario quede sin dirección predeterminada sin acción explícita.

### 4. Cambio de contraseña requiere contraseña actual

**Decisión**: El endpoint `PATCH /api/v1/usuarios/me/password` requiere `current_password` + `new_password`. Se verifica el hash de la contraseña actual antes de actualizar.

**Rationale**: Protección contra session hijacking — incluso con el JWT robado, el atacante no puede cambiar la contraseña sin conocer la actual.

### 5. No se modifica el JWT al editar el perfil

**Decisión**: Al editar nombre/email, el JWT en circulación no se invalida ni se renueva automáticamente.

**Rationale**: Los datos de perfil editables (nombre, email) no afectan a los permisos (roles). Invalidar todos los tokens al editar el email sería costoso y disruptivo. El frontend actualiza el `authStore` local desde la respuesta del endpoint.

**Trade-off asumido**: Si el email cambia, el JWT en circulación aún contiene el email viejo hasta que expire. Aceptable dado el TTL corto del access token (15 min).

## Risks / Trade-offs

- **[Riesgo] Conflicto de email único al editar** → Si el usuario intenta cambiar su email a uno ya registrado, la BD lanzará un constraint violation. El servicio MUST capturarlo y retornar 409. Mitigación: verificación previa en la capa de servicio antes del UPDATE.

- **[Riesgo] Dirección predeterminada en condición de carrera** → Dos peticiones simultáneas de `set_default` podrían dejar dos direcciones marcadas. Mitigación: usar una única transacción que primero limpia el flag `es_predeterminada` de todas las direcciones del usuario y luego setea la elegida (`UPDATE ... WHERE usuario_id = X SET es_predeterminada = false; UPDATE ... WHERE id = Y SET es_predeterminada = true`).

- **[Trade-off] Frontend actualiza authStore sin re-login** → Tras editar el perfil, el authStore se actualiza con los datos devueltos por la API. Si el JWT no se renueva, los datos en el token pueden quedar desactualizados hasta la próxima renovación (máx. 15 min). Aceptable para datos no-críticos de seguridad (nombre, email).

## Migration Plan

Sin migraciones de base de datos — los modelos `Usuario` y `Direccion` ya existen (Change 01). Solo se agregan nuevos módulos Python y nuevas rutas al router principal de FastAPI.

**Rollback**: Los nuevos módulos son aditivos. En caso de rollback, eliminar el import de los routers en `main.py`.

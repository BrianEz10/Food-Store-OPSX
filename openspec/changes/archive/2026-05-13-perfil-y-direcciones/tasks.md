## 1. Backend — Módulo `usuarios/` (Perfil)

- [x] 1.1 Crear estructura de módulo: `app/usuarios/__init__.py`, `schemas.py`, `repository.py`, `service.py`, `router.py`
- [x] 1.2 Definir schemas Pydantic: `PerfilResponse` (id, nombre, apellido, email, roles, creado_en), `PerfilUpdate` (nombre?, apellido?), `CambioPasswordRequest` (current_password, new_password ≥ 8 chars)
- [x] 1.3 Implementar `UsuarioRepository`: método `get_by_id(usuario_id)` y `update_perfil(usuario_id, data)` y `update_password(usuario_id, new_hash)`
- [x] 1.4 Implementar `UsuarioService.get_perfil(current_user)` → retorna perfil sin password_hash
- [x] 1.5 Implementar `UsuarioService.update_perfil(current_user, data)` → actualización parcial, ignora campos no permitidos
- [x] 1.6 Implementar `UsuarioService.cambiar_password(current_user, current_password, new_password)` → verificar bcrypt del current, hashear new con cost ≥ 12, actualizar
- [x] 1.7 Implementar router con endpoints: `GET /api/v1/usuarios/me`, `PATCH /api/v1/usuarios/me`, `PATCH /api/v1/usuarios/me/password` — todos protegidos con `get_current_user`
- [x] 1.8 Registrar `usuarios.router` en `app/main.py` con prefijo `/api/v1`

## 2. Backend — Módulo `direcciones/` (CRUD)

- [x] 2.1 Crear estructura de módulo: `app/direcciones/__init__.py`, `schemas.py`, `repository.py`, `service.py`, `router.py`
- [x] 2.2 Definir schemas Pydantic: `DireccionResponse` (id, calle, numero, piso, depto, ciudad, provincia, codigo_postal, es_predeterminada), `DireccionCreate` (calle requerido, resto opcional, es_predeterminada default False), `DireccionUpdate` (todos opcionales)
- [x] 2.3 Implementar `DireccionRepository`: `list_by_user(usuario_id)`, `get_by_id(id)`, `create(usuario_id, data)`, `update(id, data)`, `delete(id)` (soft-delete: setea eliminado_en), `unset_all_default(usuario_id)`, `set_default(id)`
- [x] 2.4 Implementar `DireccionService.list_direcciones(current_user)` → retorna lista del usuario
- [x] 2.5 Implementar `DireccionService.create_direccion(current_user, data)` → si es primera dirección, forzar es_predeterminada=True; si es_predeterminada=True, unset anterior en misma transacción (UoW)
- [x] 2.6 Implementar `DireccionService.get_direccion(current_user, id)` → verifica ownership, retorna 404 si no es del usuario
- [x] 2.7 Implementar `DireccionService.update_direccion(current_user, id, data)` → verifica ownership, maneja invariante de es_predeterminada
- [x] 2.8 Implementar `DireccionService.delete_direccion(current_user, id)` → verifica ownership; si es predeterminada y única → 409; si es predeterminada y hay otras → promueve la más reciente; soft-delete
- [x] 2.9 Implementar `DireccionService.set_predeterminada(current_user, id)` → verifica ownership, unset todas + set nueva en misma transacción; idempotente si ya es predeterminada
- [x] 2.10 Implementar router con endpoints: `GET /api/v1/direcciones`, `POST /api/v1/direcciones`, `GET /api/v1/direcciones/{id}`, `PATCH /api/v1/direcciones/{id}`, `DELETE /api/v1/direcciones/{id}`, `POST /api/v1/direcciones/{id}/predeterminada` — todos protegidos con `get_current_user`
- [x] 2.11 Registrar `direcciones.router` en `app/main.py` con prefijo `/api/v1`

## 3. Backend — Tests y Verificación

- [ ] 3.1 Verificar manualmente todos los endpoints con Swagger UI (`/docs`): flujo completo de perfil (GET, PATCH nombre, PATCH password)
- [ ] 3.2 Verificar manualmente todos los endpoints de direcciones: crear primera (auto-default), crear segunda, marcar como predeterminada, editar, eliminar predeterminada con otras disponibles, intentar eliminar única dirección (debe dar 409)
- [ ] 3.3 Verificar que ownership funciona: un usuario no puede acceder ni modificar direcciones de otro (debe recibir 404)

## 4. Frontend — Página de Perfil

- [x] 4.1 Crear `src/pages/profile/ProfilePage.tsx` con estructura FSD bajo `src/pages/`
- [x] 4.2 Implementar sección "Datos personales" con TanStack Form: campos nombre y apellido, validación de no-vacío, submit llama `PATCH /api/v1/usuarios/me`
- [x] 4.3 Implementar sección "Cambiar contraseña" con TanStack Form: campos current_password, new_password, confirm_password (validación de coincidencia en cliente), submit llama `PATCH /api/v1/usuarios/me/password`
- [x] 4.4 Al guardar perfil exitosamente: actualizar `authStore` con datos nuevos (nombre, apellido) desde la respuesta de la API
- [x] 4.5 Mostrar toast/notificación de éxito o error en cada sección
- [x] 4.6 Mostrar datos actuales del usuario en los campos al cargar la página (pre-populate desde `authStore` o fetch de `GET /api/v1/usuarios/me`)

## 5. Frontend — Página de Gestión de Direcciones

- [x] 5.1 Crear `src/pages/addresses/AddressesPage.tsx` con listado de tarjetas de direcciones
- [x] 5.2 Implementar fetch de `GET /api/v1/direcciones` via TanStack Query con loading skeleton y estado de lista vacía
- [x] 5.3 Implementar modal/formulario de creación de dirección con TanStack Form: campos calle (requerido), numero, piso, depto, ciudad, provincia, codigo_postal, es_predeterminada (checkbox)
- [x] 5.4 Implementar modal/formulario de edición de dirección (pre-populated con datos existentes)
- [x] 5.5 Implementar botón "Marcar como predeterminada" en cada tarjeta (deshabilitar si ya es predeterminada)
- [x] 5.6 Implementar confirmación de eliminación: dialog de confirmación antes del DELETE; mostrar mensaje de error 409 si es la única dirección predeterminada
- [x] 5.7 Invalidar cache de TanStack Query (`queryClient.invalidateQueries`) después de cada mutación (create, update, delete, set-default)

## 6. Frontend — Integración y Enrutamiento

- [x] 6.1 Agregar rutas en el router: `/perfil` → `ProfilePage`, `/mis-direcciones` → `AddressesPage`, ambas protegidas (requieren autenticación)
- [ ] 6.2 Verificar flujo completo en el navegador: editar perfil, cambiar contraseña (con error de contraseña incorrecta), gestión completa de direcciones

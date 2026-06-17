## ADDED Requirements

### Requirement: Usuario puede listar sus direcciones de entrega

The system SHALL allow an authenticated user to retrieve all their delivery addresses via `GET /api/v1/direcciones`. The response MUST only include addresses that belong to the requesting user (ownership enforced by JWT). Soft-deleted addresses MUST NOT appear.

#### Scenario: Listado de direcciones propias
- **WHEN** el usuario autenticado envía GET /api/v1/direcciones
- **THEN** el sistema retorna 200 con la lista de sus direcciones (puede ser vacía), cada una con: id, calle, numero, piso, depto, ciudad, provincia, codigo_postal, es_predeterminada

#### Scenario: Listado sin autenticación
- **WHEN** una petición anónima envía GET /api/v1/direcciones
- **THEN** el sistema retorna 401 Unauthorized con detalle "No autenticado"

---

### Requirement: Usuario puede crear una dirección de entrega

The system SHALL allow an authenticated user to create a new delivery address via `POST /api/v1/direcciones`. If the user has no addresses yet, the first created address MUST automatically be set as the default. If the user already has addresses and `es_predeterminada: true` is sent, the system MUST unset the previous default.

#### Scenario: Crear primera dirección (auto-predeterminada)
- **WHEN** el usuario sin direcciones envía POST /api/v1/direcciones con datos válidos
- **THEN** el sistema crea la dirección con es_predeterminada=true y retorna 201 con la dirección creada

#### Scenario: Crear dirección adicional sin marcarla como predeterminada
- **WHEN** el usuario con al menos una dirección envía POST /api/v1/direcciones con es_predeterminada=false (o sin el campo)
- **THEN** el sistema crea la dirección con es_predeterminada=false y la predeterminada anterior no cambia

#### Scenario: Crear dirección marcándola como nueva predeterminada
- **WHEN** el usuario con al menos una dirección envía POST /api/v1/direcciones con es_predeterminada=true
- **THEN** el sistema crea la dirección como predeterminada y actualiza la anterior a es_predeterminada=false en la misma transacción

#### Scenario: Crear dirección con datos inválidos
- **WHEN** el usuario envía POST /api/v1/direcciones sin el campo obligatorio calle
- **THEN** el sistema retorna 422 Unprocessable Entity con error de validación en el campo calle

---

### Requirement: Usuario puede actualizar una dirección de entrega

The system SHALL allow an authenticated user to update their own delivery address via `PATCH /api/v1/direcciones/{id}`. The system MUST verify ownership before applying changes. All fields are optional (partial update). If `es_predeterminada: true` is set, the previous default MUST be unset in the same transaction.

#### Scenario: Actualización parcial exitosa
- **WHEN** el usuario autenticado envía PATCH /api/v1/direcciones/{id} con body `{"ciudad": "Rosario"}` para una dirección propia
- **THEN** el sistema actualiza solo el campo ciudad y retorna 200 con la dirección actualizada completa

#### Scenario: Marcar como predeterminada via update
- **WHEN** el usuario autenticado envía PATCH /api/v1/direcciones/{id} con body `{"es_predeterminada": true}` para una dirección propia no predeterminada
- **THEN** el sistema setea es_predeterminada=true para esta dirección y es_predeterminada=false para todas las demás del usuario en la misma transacción

#### Scenario: Intento de actualizar dirección ajena
- **WHEN** el usuario autenticado envía PATCH /api/v1/direcciones/{id} donde el id pertenece a otro usuario
- **THEN** el sistema retorna 404 Not Found (sin revelar que el recurso existe)

---

### Requirement: Usuario puede eliminar una dirección de entrega

The system SHALL allow an authenticated user to delete their own delivery address via `DELETE /api/v1/direcciones/{id}`. The system MUST verify ownership. If the address is the default AND the only one for the user, deletion MUST be rejected. If the address is the default but there are other addresses, the system MUST promote the most recently created remaining address as the new default.

#### Scenario: Eliminar dirección no predeterminada
- **WHEN** el usuario autenticado envía DELETE /api/v1/direcciones/{id} para una dirección propia que no es la predeterminada
- **THEN** el sistema elimina la dirección (soft delete: setea eliminado_en) y retorna 204 No Content

#### Scenario: Eliminar dirección predeterminada con otras disponibles
- **WHEN** el usuario autenticado envía DELETE /api/v1/direcciones/{id} para su dirección predeterminada y tiene al menos otra dirección
- **THEN** el sistema elimina la dirección y promueve automáticamente la dirección más recientemente creada entre las restantes como predeterminada, retorna 204 No Content

#### Scenario: Intento de eliminar única dirección predeterminada
- **WHEN** el usuario autenticado envía DELETE /api/v1/direcciones/{id} para su única dirección (que también es la predeterminada)
- **THEN** el sistema retorna 409 Conflict con detalle "No se puede eliminar la única dirección predeterminada"

#### Scenario: Intento de eliminar dirección ajena
- **WHEN** el usuario autenticado envía DELETE /api/v1/direcciones/{id} donde el id pertenece a otro usuario
- **THEN** el sistema retorna 404 Not Found (sin revelar que el recurso existe)

---

### Requirement: Usuario puede marcar una dirección como predeterminada

The system SHALL allow an authenticated user to set a specific address as default via `POST /api/v1/direcciones/{id}/predeterminada`. The system MUST unset the previous default in the same transaction. Only the owner of the address can perform this action.

#### Scenario: Marcar dirección como predeterminada exitosamente
- **WHEN** el usuario autenticado envía POST /api/v1/direcciones/{id}/predeterminada para una dirección propia
- **THEN** el sistema setea es_predeterminada=true para la dirección indicada y es_predeterminada=false para todas las demás del usuario en la misma transacción, retorna 200 con la dirección actualizada

#### Scenario: Marcar como predeterminada una dirección ya predeterminada
- **WHEN** el usuario autenticado envía POST /api/v1/direcciones/{id}/predeterminada para su dirección que ya es la predeterminada
- **THEN** el sistema retorna 200 con la dirección (operación idempotente)

#### Scenario: Intento de marcar como predeterminada una dirección ajena
- **WHEN** el usuario autenticado envía POST /api/v1/direcciones/{id}/predeterminada donde el id pertenece a otro usuario
- **THEN** el sistema retorna 404 Not Found (sin revelar que el recurso existe)

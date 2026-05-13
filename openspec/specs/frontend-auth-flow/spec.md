# frontend-auth-flow Specification

## Purpose
TBD - created by archiving change auth-frontend. Update Purpose after archive.
## Requirements
### Requirement: Flujo de inicio de sesión en frontend
El sistema SHALL proveer un formulario de inicio de sesión manejado por TanStack Form que se comunique con el endpoint de autenticación.

#### Scenario: Login exitoso
- **WHEN** el usuario envía credenciales válidas
- **THEN** se invoca el endpoint de login, se actualiza el `authStore` y se redirige al usuario a la página inicial o dashboard según corresponda.

#### Scenario: Error de credenciales
- **WHEN** el endpoint de login retorna 401
- **THEN** el formulario muestra un mensaje de error global indicando "Credenciales inválidas".

#### Scenario: Validación del formulario
- **WHEN** el usuario intenta enviar el formulario sin email o contraseña
- **THEN** TanStack Form previene el envío y muestra mensajes de error en los campos requeridos.

### Requirement: Flujo de registro en frontend
El sistema SHALL proveer un formulario de registro manejado por TanStack Form para nuevos usuarios.

#### Scenario: Registro exitoso
- **WHEN** el usuario envía datos de registro válidos
- **THEN** se invoca el endpoint de registro y tras el éxito se muestra un mensaje de confirmación o se redirige a la pantalla de login.

#### Scenario: Validación de contraseña en cliente
- **WHEN** el usuario ingresa una contraseña menor a 8 caracteres
- **THEN** el formulario muestra un error de validación en tiempo real indicando los requisitos mínimos.

### Requirement: Redirección basada en roles
El sistema SHALL redirigir a los usuarios tras un login exitoso al área apropiada según su rol.

#### Scenario: Redirección de Cliente
- **WHEN** el usuario tiene solo el rol CLIENT y hace login
- **THEN** es redirigido a `/` (catálogo principal).

#### Scenario: Redirección de Administrador o Gestor
- **WHEN** el usuario tiene roles ADMIN, STOCK o PEDIDOS y hace login
- **THEN** es redirigido a `/dashboard`.


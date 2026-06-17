# frontend-auth-flow Specification

## Purpose
TBD - created by archiving change auth-frontend. Update Purpose after archive.
## Requirements
### Requirement: Flujo de inicio de sesión en frontend
El sistema SHALL proveer un formulario de inicio de sesión manejado por TanStack Form que se comunique con el endpoint de autenticación. Este formulario MUST presentarse en una interfaz standalone (sin header ni sidebar del layout base general) a pantalla completa (full-screen) con layout perfectamente centrado. 

La presentación visual MUST cumplir estrictamente con los tokens del sistema de diseño **Vivid Modernity**:
- **Fondo de pantalla**: Color de superficie suave (`#fff8f7`).
- **Contenedor del formulario**: Tarjeta con fondo blanco, bordes redondeados `rounded-card` (8px) y sombra violet-tinted ultra-suave.
- **Tipografía**: Outfit para títulos principales y headers, e Inter para las etiquetas (`label`), inputs, placeholders y mensajes de error.
- **Campos de entrada (inputs)**: Bordes redondeados `rounded-input` (8px), color de borde `outline` (`#8e7071`) y cambios de color dinámicos en el foco.
- **Botón de acción**: Botón de tipo primary con fondo rojo (`#b3193d`), bordes redondeados y tipografía Outfit.
- **Enlaces**: Links secundarios en color violeta (`#6d4e9f`) para la navegación hacia el registro.

#### Scenario: Login exitoso
- **WHEN** el usuario envía credenciales válidas
- **THEN** se invoca el endpoint de login, se actualiza el `authStore` y se redirige al usuario a la página inicial o dashboard según corresponda.

#### Scenario: Error de credenciales
- **WHEN** el endpoint de login retorna 401
- **THEN** el formulario muestra un mensaje de error global indicando "Credenciales inválidas" utilizando el color de error de la paleta (`#ba1a1a`).

#### Scenario: Validación del formulario
- **WHEN** el usuario intenta enviar el formulario sin email o contraseña
- **THEN** TanStack Form previene el envío y muestra mensajes de error en los campos requeridos en color rojo de error (`#ba1a1a`), resaltando el borde del input con el mismo color.

#### Scenario: Visualización Standalone Centrada
- **WHEN** el usuario navega a la página de login
- **THEN** se renderiza la vista centrada full-screen sin la barra de navegación superior (header) ni el menú lateral (sidebar).

### Requirement: Flujo de registro en frontend
El sistema SHALL proveer un formulario de registro manejado por TanStack Form para nuevos usuarios. Este formulario MUST presentarse en una interfaz standalone (sin header ni sidebar del layout base general) a pantalla completa con layout perfectamente centrado.

La presentación visual MUST cumplir estrictamente con los tokens del sistema de diseño **Vivid Modernity**:
- **Fondo de pantalla**: Color de superficie suave (`#fff8f7`).
- **Contenedor del formulario**: Tarjeta con fondo blanco, bordes redondeados `rounded-card` (8px) y sombra violet-tinted ultra-suave.
- **Campos requeridos**: Nombre, Apellido, Email, Teléfono, Contraseña y Confirmar Contraseña.
- **Tipografía**: Outfit para títulos principales y headers, e Inter para las etiquetas, inputs y mensajes de error.
- **Campos de entrada (inputs)**: Bordes redondeados `rounded-input` (8px), color de borde `outline` (`#8e7071`) y cambios de color dinámicos en el foco o en estado de error (`#ba1a1a`).
- **Botón de acción**: Botón de tipo primary con fondo rojo (`#b3193d`), bordes redondeados y tipografía Outfit para enviar el registro.
- **Enlaces**: Links secundarios en color violeta (`#6d4e9f`) para la navegación hacia el login.

#### Scenario: Registro exitoso
- **WHEN** el usuario envía datos de registro válidos
- **THEN** se invoca el endpoint de registro y tras el éxito se muestra un mensaje de confirmación o se redirige a la pantalla de login.

#### Scenario: Validación de contraseña en cliente
- **WHEN** el usuario ingresa una contraseña menor a 8 caracteres
- **THEN** el formulario muestra un error de validación en tiempo real en color rojo de error (`#ba1a1a`) indicando los requisitos mínimos y resaltando el input correspondiente.

#### Scenario: Campos de formulario completos en registro
- **WHEN** el usuario ve el formulario de registro
- **THEN** los inputs de Nombre, Apellido, Email, Teléfono, Contraseña y Confirmación de Contraseña están visibles con etiquetas claras.

#### Scenario: Registro Standalone Centrado
- **WHEN** el usuario navega a la página de registro
- **THEN** se renderiza la vista centrada full-screen sin la barra de navegación superior ni el menú lateral.

### Requirement: Redirección basada en roles
El sistema SHALL redirigir a los usuarios tras un login exitoso al área apropiada según su rol.

#### Scenario: Redirección de Cliente
- **WHEN** el usuario tiene solo el rol CLIENT y hace login
- **THEN** es redirigido a `/` (catálogo principal).

#### Scenario: Redirección de Administrador o Gestor
- **WHEN** el usuario tiene roles ADMIN, STOCK o PEDIDOS y hace login
- **THEN** es redirigido a `/dashboard`.


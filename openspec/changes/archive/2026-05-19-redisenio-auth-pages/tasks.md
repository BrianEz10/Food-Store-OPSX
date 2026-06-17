## 1. Backend Integration for Teléfono Support

- [x] 1.1 Extender el esquema UserRegisterRequest en backend/app/modules/auth/schemas.py para incluir el campo opcional telefono
- [x] 1.2 Modificar el servicio de registro en backend/app/modules/auth/service.py para recibir y pasar el campo telefono a la capa de persistencia
- [x] 1.3 Actualizar el repositorio de usuarios en backend/app/modules/auth/repository.py para persistir el telefono al crear un nuevo Usuario

## 2. Frontend Route and Layout Configuration

- [x] 2.1 Ajustar el sistema de rutas del frontend en frontend/src/app/routes.tsx para desacoplar LoginPage y RegisterPage del MainLayout (header/sidebar colapsable) general, permitiendo un renderizado standalone

## 3. Redesign of LoginPage

- [x] 3.1 Rediseñar la estructura de LoginPage en frontend/src/pages/auth/LoginPage.tsx para utilizar un contenedor centrado full-screen con fondo bg-surface y una tarjeta bg-white shadow-soft rounded-card
- [x] 3.2 Implementar el logo de Food Store estilizado y el encabezado en tipografía Outfit
- [x] 3.3 Aplicar estilos de inputs (rounded-input, border-outline) y tipografía Inter a las etiquetas e inputs
- [x] 3.4 Configurar el botón de tipo primary en rojo (#b3193d) con hover estilizado y links secundarios en violeta (#6d4e9f)
- [x] 3.5 Integrar visualización de errores y bordes de input dinámicos usando el color de error de la paleta (#ba1a1a) en TanStack Form

## 4. Redesign of RegisterPage

- [x] 4.1 Rediseñar la estructura de RegisterPage en frontend/src/pages/auth/RegisterPage.tsx aplicando el contenedor centrado full-screen y la tarjeta bg-white shadow-soft rounded-card
- [x] 4.2 Expandir el formulario de registro y el esquema de Typescript de registro para incluir los campos telefono y confirmacion de password
- [x] 4.3 Implementar validación cruzada en TanStack Form para comprobar en tiempo real que las contraseñas coincidan
- [x] 4.4 Aplicar estilos visuales consistentes con la paleta de colores, tipografías Outfit/Inter, rounded-card, rounded-input y bordes dinámicos
- [x] 4.5 Configurar el botón primary rojo para enviar la creación de la cuenta y los mensajes de error en color #ba1a1a

## 5. Verification and Integration Tests

- [x] 5.1 Iniciar el entorno de desarrollo y probar el flujo de Login de extremo a extremo
- [x] 5.2 Probar el flujo de Registro de extremo a extremo, verificando el guardado del número de teléfono en la base de datos
- [x] 5.3 Validar que no existan errores de compilación de Typescript en el frontend ni en el backend

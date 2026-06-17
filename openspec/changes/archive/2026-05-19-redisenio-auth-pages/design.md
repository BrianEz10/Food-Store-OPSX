## Context

El sistema de autenticación actual en el frontend (`LoginPage` y `RegisterPage`) está visualmente integrado dentro del layout base común (`MainLayout`), lo que significa que el header superior y el menú lateral (sidebar) son visibles en todo momento. Esto compromete la experiencia de usuario en flujos críticos como el registro y el login, distrayendo al cliente y reduciendo la conversión de registro.
Además, la interfaz no aprovecha los tokens de color, tipografía y bordes del nuevo sistema de diseño **Vivid Modernity** del Change 14, viéndose genérica. El formulario de registro tampoco expone campos importantes como el `telefono` (que ya existe en la base de datos como columna nullable) ni la confirmación de contraseña en la interfaz.

## Goals / Non-Goals

**Goals:**
- **Layout Standalone Centrado**: Rediseñar las vistas de autenticación para que se rendericen a pantalla completa, eliminando el header y sidebar general de la aplicación.
- **Implementación Vivid Modernity**: Aplicar con precisión absoluta la paleta de colores, tipografías Outfit (encabezados) e Inter (cuerpo/inputs), border-radius `rounded-card` (8px) y `rounded-input` (8px), y sombras violet-tinted.
- **Ampliación del Formulario de Registro**: Agregar los campos `telefono` y `confirmar contraseña` al flujo de registro en frontend.
- **Persistencia de Teléfono**: Extender el endpoint y esquema de registro del backend (`UserRegisterRequest`) para guardar el número de teléfono del usuario en la base de datos.
- **Validación Visual Coherente**: Alinear las validaciones y mensajes de error con los estilos del design system (`#ba1a1a` para errores y `#8e7071` para bordes inactivos).

**Non-Goals:**
- Modificar el flujo de autenticación basado en JWT o la rotación de refresh tokens.
- Agregar soporte para login con OAuth / redes sociales en esta etapa.
- Modificar otros formularios de la aplicación fuera del login y registro.

## Decisions

### 1. Layout Standalone Excluido de `MainLayout`
- **Opción A**: Crear un componente condicional en `MainLayout` que oculte el header/sidebar basándose en la ruta actual (`/login` o `/register`).
- **Opción B**: Reestructurar las rutas en `frontend/src/app/routes.tsx` para agrupar las páginas de auth bajo un layout separado (o directamente renderizarlas sin layout común).
- **Decisión**: **Opción B**. Es mucho más limpia arquitectónicamente. En lugar de ensuciar `MainLayout` con lógica de rutas específicas, las páginas de autenticación se declaran de forma independiente en el router o se envuelven en un `AuthLayout` mínimo de centrado si es necesario. Esto mantiene el principio de responsabilidad única de los layouts.

### 2. Extensión del Backend para Guardar `telefono` en Registro
- **Decisión**: Modificaremos el esquema de validación `UserRegisterRequest` en FastAPI para aceptar un campo opcional `telefono: Optional[str] = None`. Actualizaremos la capa de servicio `register` y la función `create_user` del repositorio para pasar y almacenar el teléfono del usuario en la columna `telefono` de la tabla `usuarios`.
- **Razón**: Agregar campos en el frontend que no se guardan en el backend es un antipatrón ("shortcut") inaceptable. Realizar la integración completa de extremo a extremo garantiza la integridad y utilidad de los datos del cliente.

### 3. Validación y Comparación de Contraseña en Cliente (TanStack Form)
- **Decisión**: Usar las capacidades de validación en tiempo real de TanStack Form para el campo de confirmación de contraseña, validando que sea idéntico al valor del campo `password`.
- **Razón**: Mejora sustancialmente la experiencia de usuario y evita llamadas innecesarias al backend con contraseñas mal tipeadas.

### 4. Estilización mediante Variables y Clases Tailwind del Design System
- **Decisión**: Utilizar de manera estricta los tokens CSS configurados en el Change 14:
  - **Fondo General**: `bg-surface` (`#fff8f7`) con `min-h-screen` y centrado flex.
  - **Tarjeta**: `bg-white shadow-soft rounded-card border border-outline/10`.
  - **Inputs**: `rounded-input border-outline/30 focus:border-primary focus:ring-primary` para estados normales, y `border-error text-error focus:border-error` para estados de validación errónea.
  - **Tipografías**: Clase `font-display` (Outfit) para el logo y títulos, y `font-body` (Inter) para inputs, labels y textos de ayuda.

## Risks / Trade-offs

- **[Riesgo] El backend falla si el teléfono no tiene un formato válido** → *Mitigación*: En el frontend utilizaremos una validación de formato robusta con expresión regular para el teléfono (números opcionalmente precedidos por '+' y con longitud lógica) antes de permitir el envío.
- **[Riesgo] Romper la sesión de algún usuario si se cambian los schemas de base de datos** → *Mitigación*: El campo `telefono` ya existe en el modelo de base de datos `Usuario` y es nullable, por lo que no requiere una migración de base de datos Alembic destructiva.

## Why

El diseño visual actual de las páginas de autenticación (`LoginPage` y `RegisterPage`) no concuerda con la nueva identidad de marca del e-commerce y carece del impacto visual premium del sistema de diseño **Vivid Modernity**. Además, actualmente estas páginas se renderizan dentro del layout base general (con header/aside), lo que distrae al usuario durante el flujo crítico de conversión (registro e inicio de sesión). Este cambio implementa un rediseño completo standalone y centrado full-screen que prioriza la simplicidad, la elegancia y la coherencia visual con la paleta de colores y tipografías establecidas.

## What Changes

- **Páginas Standalone Full-Screen**: Exclusión de `LoginPage` y `RegisterPage` del layout base con header/aside. Se implementa un layout centrado a pantalla completa con fondo suave (`#fff8f7`).
- **Rediseño de LoginPage**: Contenedor centrado tipo tarjeta con el logo de **Food Store**, campos estilizados para email y contraseña, botón primario rojo (`#b3193d`), y un enlace secundario violeta (`#6d4e9f`) para registrarse.
- **Rediseño de RegisterPage**: Contenedor tipo tarjeta con campos estilizados para nombre, apellido, email, teléfono, contraseña y confirmación de contraseña, botón primario rojo para crear la cuenta, y validación visual consistente.
- **Tokens de Diseño Aplicados**:
  - **Colores**: Primary (`#b3193d`), Secondary (`#6d4e9f`), Surface (`#fff8f7`), Error (`#ba1a1a`), y Outline (`#8e7071`).
  - **Tipografía**: Outfit para títulos principales y headers, Inter para etiquetas, inputs y textos de apoyo.
  - **Bordes y Sombras**: Border radius `rounded-input` (8px) en campos de entrada, `rounded-card` (8px) en el contenedor principal, y sombras violet-tinted ultra-suaves.
- **Validación Visual Mejorada**: Inputs con bordes `outline` dinámicos que cambian al foco y al estado de error (`#ba1a1a`) con mensajes informativos claros.

## Capabilities

### New Capabilities
<!-- No se introducen nuevas capacidades de negocio a nivel de backend o lógica, es un cambio puramente de presentación visual y layout en el frontend. -->

### Modified Capabilities
- `frontend-auth-flow`: Rediseño de la presentación visual y estructura de layout de los formularios de Login y Registro, transitando de una visualización integrada en el layout base a páginas standalone full-screen centradas que utilizan los tokens del sistema de diseño Vivid Modernity.

## Impact

- **Archivos de Frontend Modificados**:
  - `frontend/src/pages/auth/LoginPage.tsx`: Rediseño completo de la interfaz de Login, estructura HTML, clases de estilo Tailwind y comportamiento de errores visuales.
  - `frontend/src/pages/auth/RegisterPage.tsx`: Rediseño completo de la interfaz de Registro, campos de entrada adicionales, estructura de layout y validaciones visuales.
  - Modificación del enrutador o layout base en el frontend (si aplica) para asegurar que las páginas de auth no rendericen el header o sidebar común.
- **Dependencias**:
  - Consumo directo de los tokens CSS de la paleta **Vivid Modernity** y tipografías Outfit/Inter configuradas en el Change 14 (`sistema-diseno-visual`).

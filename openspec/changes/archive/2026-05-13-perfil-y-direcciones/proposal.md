## Why

Los usuarios autenticados necesitan gestionar su información personal (perfil, contraseña) y sus direcciones de entrega para poder realizar pedidos. Sin estos datos persistidos, el flujo de checkout (Change 09a) no puede asociar una dirección al pedido ni verificar la identidad del cliente.

## What Changes

- Nuevo módulo backend `usuarios/` con endpoints para ver y editar perfil propio y cambiar contraseña
- Nuevo módulo backend `direcciones/` con CRUD completo, soporte para dirección predeterminada y ownership por JWT
- Nuevas páginas frontend: Perfil del usuario (edición inline) y Gestión de Direcciones (lista, crear, editar, eliminar, marcar predeterminada)
- Validaciones de negocio: no se puede eliminar la dirección predeterminada si es la única, la contraseña actual debe verificarse antes de cambiarla

## Capabilities

### New Capabilities

- `user-profile`: Ver y editar datos personales del usuario autenticado (nombre, email) y cambiar contraseña con verificación de contraseña actual
- `delivery-addresses`: CRUD completo de direcciones de entrega asociadas al usuario; soporte para marcar una como predeterminada; ownership validado por JWT

### Modified Capabilities

- `user-auth`: Se agrega el campo de perfil extendido al token JWT (nombre, email) para que el frontend pueda mostrarlo sin un fetch adicional

## Impact

- **Backend**: Nuevos módulos `app/usuarios/` y `app/direcciones/` con schemas, repositorios, servicios y routers. Integración con el modelo `Usuario` y `Direccion` ya definidos en el ERD (Change 01).
- **Frontend**: Nuevas páginas en `src/pages/profile/` y `src/pages/addresses/`. Consume los nuevos endpoints vía Axios. Actualiza `authStore` con los datos de perfil editados.
- **Dependencias**: Requiere Change 03a archivado (auth-backend operativo, `get_current_user` disponible, roles en JWT). Los modelos `Usuario` y `Direccion` ya existen en BD.
- **APIs**: 5 endpoints nuevos en `/api/v1/usuarios/me` y 5 en `/api/v1/direcciones`.

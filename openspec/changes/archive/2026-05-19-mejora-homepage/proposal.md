## Why

La página de inicio actual del sistema es un simple placeholder con un mensaje de bienvenida básico. Para brindar una experiencia premium y profesional que atraiga al usuario desde el primer momento, es fundamental contar con una interfaz interactiva y rica visualmente que facilite el acceso rápido al catálogo de productos, destaque las ofertas especiales del día y las promociones activas, y respete la identidad visual del sistema de diseño Vivid Modernity.

## What Changes

- **Rediseño completo de la HomePage (`/`)**: Reemplazo del placeholder básico actual por una landing page rica y dinámica para clientes y usuarios anónimos.
- **Sección Hero interactiva**: Una sección principal destacada con el mensaje "¿Qué querés comer hoy?", barra de búsqueda rápida y botón de acción principal (CTA) para ir al catálogo.
- **Carrusel/Grilla de Categorías**: Tarjetas visuales interactivas para las categorías principales (Pizzas, Pastas, Hamburguesas, Postres, Bebidas, Ensaladas) con íconos o imágenes representativas y navegación con filtros pre-cargados al catálogo.
- **Sección de Platos del Día (Platos Destacados)**: Integración de la cuadrícula responsiva usando las `ProductCard` existentes para mostrar platos seleccionados.
- **Sección de Promociones Diarias**: Visualización de ofertas especiales del día usando componentes estilizados con badges de descuento llamativos en color terciario (#006a42).
- **Footer del negocio**: Pie de página institucional que detalla información de contacto, horarios de atención, redes sociales y links de interés, integrado fluidamente en la base de la navegación.

## Capabilities

### New Capabilities
- `homepage-mejora`: Nueva capacidad dedicada a la visualización de banners hero de bienvenida, navegación directa por categorías destacadas y listado de ofertas/platos recomendados del día con integración del diseño Vivid Modernity.

### Modified Capabilities
- `app-shell`: Modificación de la sección de la HomePage para sustituir el placeholder con el nuevo diseño enriquecido, manteniendo la persistencia dentro del `AppLayout` (Header y Aside).

## Impact

- **Frontend (`frontend/src/pages/Home.tsx` o `frontend/src/pages/HomePage.tsx`)**: Reemplazo de la implementación actual del componente de la página de inicio por una estructura rica en secciones.
- **Enrutamiento (`frontend/src/routes/` o `frontend/src/App.tsx`)**: Ningún cambio en las rutas, se mantiene montado bajo `/` dentro del `AppLayout`.
- **Dependencias y Estilos**: Se consumirán los tokens del sistema de diseño (colores primary/secondary/tertiary, surface, shadow, rounded-card, rounded-chip) ya configurados en `tailwind.config.js`.

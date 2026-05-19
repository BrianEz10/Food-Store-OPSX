## 1. Preparación y Estructura Base

- [x] 1.1 Configurar importaciones en `HomePage.tsx` incluyendo componentes del catálogo, hooks de productos e iconos de `lucide-react`.
- [x] 1.2 Limpiar la estructura actual y definir la grilla contenedora principal adaptada al AppLayout con espaciado consistente.

## 2. Implementación de Secciones de HomePage

- [x] 2.1 Desarrollar la sección Hero con buscador interactivo redirigiendo a `/catalogo?search=...` y botón CTA "Explorar Menú".
- [x] 2.2 Diseñar las tarjetas de categorías destacadas (Pizzas, Pastas, Burgers, Postres, Bebidas, Ensaladas) y conectarlas dinámicamente al enrutamiento de categorías.
- [x] 2.3 Integrar la grilla de Platos del Día usando `useProducts` con límite de 4 a 8 productos y reutilizando `ProductCard`.
- [x] 2.4 Construir la sección de Promociones Diarias con badges destacados utilizando el color terciario (#006a42) del design system.
- [x] 2.5 Desarrollar el Footer institucional de Food Store con información, horarios de contacto, redes sociales y links de interés.

## 3. Verificación y Calidad

- [x] 3.1 Comprobar el correcto funcionamiento de la barra de búsqueda y las categorías de la Home redirigiendo y filtrando el catálogo.
- [x] 3.2 Validar la responsividad completa en mobile, tablet y desktop.
- [x] 3.3 Ejecutar verificación estática de TypeScript (`npx tsc --noEmit`) para garantizar consistencia de tipos.

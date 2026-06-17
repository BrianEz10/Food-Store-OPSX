## Context

La página de inicio de Food Store (`/`) es actualmente un componente básico (`HomePage`) que funciona como un simple placeholder. En este cambio, se rediseñará por completo para convertirla en una interfaz premium, atractiva e interactiva que sirva de portal de entrada para los usuarios (autenticados y anónimos). 

El diseño se alineará con el sistema visual **Vivid Modernity** ya integrado, respetando sus tokens de color, bordes, tipografía y sombras.

## Goals / Non-Goals

**Goals:**
- Implementar una sección Hero interactiva con un buscador que redirija a `/catalogo?search=...`.
- Mostrar un set de 6 tarjetas de categorías destacadas (Pizzas, Pastas, Hamburguesas/Burgers, Postres, Bebidas, Ensaladas) que redirijan al catálogo con el filtro pre-cargado.
- Mostrar una grilla responsiva de "Platos del Día" reutilizando las `ProductCard` existentes del catálogo.
- Crear una sección de Promociones Diarias atractiva utilizando el color terciario (`#006a42`) para badges.
- Incluir un Footer institucional del negocio en la parte inferior de la HomePage.
- Respetar completamente la persistencia dentro del `AppLayout` actual (Header y Sidebar).

**Non-Goals:**
- Implementar la lógica de gestión/creación de promociones en el panel de administración (eso corresponde a otro cambio).
- Cambiar la estructura de routing existente.

## Decisions

### 1. Reutilización de `ProductCard` y Fetching Dinámico
- **Decisión:** Para la sección de "Platos del Día", usaremos el hook `useProducts` de `@/entities/product` limitando a 4 u 8 productos destacados.
- **Alternativa considerada:** Hardcodear los productos recomendados. Se descartó porque no reflejaría cambios de stock o precios reales de la base de datos.
- **Razón:** Mantener la consistencia del catálogo y que el botón de "Agregar" funcione directamente con el estado global del carrito ya integrado en `ProductCard`.

### 2. Mapeo Dinámico de Categorías
- **Decisión:** Obtener la lista de categorías desde `GET /api/v1/categorias` y emparejarlas por nombre con iconos representativos (por ejemplo, usando `lucide-react` como `Pizza`, `Coffee`, `Beef`, etc.). Al hacer clic, navegar a `/catalogo?categoria_id=<id>`.
- **Alternativa considerada:** Hardcodear los IDs de las categorías directamente. Se descartó porque si la base de datos cambia de IDs en producción, rompería el enrutamiento.
- **Razón:** Robustez ante cambios de base de datos.

### 3. Integración Estética Vivid Modernity
- **Decisión:** Usar el color principal `#b3193d` para llamados a la acción principales (CTA en Hero), el color secundario `#6d4e9f` para acentos visuales y el terciario `#006a42` para badges de promociones destacadas. Los contenedores usarán `rounded-card` y sombras violetas suaves (`shadow-violet-100`).

## Risks / Trade-offs

- **[Riesgo] Carga lenta del catálogo en HomePage** → *Mitigación:* Se usarán los skeletons ya definidos en `ProductGrid` para que la página sea interactiva inmediatamente mientras se cargan los productos de fondo.
- **[Riesgo] Falta de iconos específicos en Lucide** → *Mitigación:* Se utilizarán íconos alternativos genéricos estilizados de `lucide-react` para asegurar consistencia estética.

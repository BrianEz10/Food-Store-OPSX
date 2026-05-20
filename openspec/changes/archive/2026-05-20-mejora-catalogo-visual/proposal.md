## Why

El catálogo de productos es la página principal de exploración para los clientes, pero actualmente tiene un diseño plano y genérico que no refleja la identidad visual Vivid Modernity. Carece de badges visuales (stock, descuento), filtros con iconos, estados vacíos atractivos y uso consistente de los design tokens definidos en el sistema de diseño. Rediseñarlo mejora la experiencia de navegación, la percepción de calidad y la tasa de conversión.

## What Changes

- Rediseñar **ProductCard** con badges visuales (stock disponible, descuento, nuevo), mejor jerarquía tipográfica y uso de design tokens (rounded-card, border-outline/10, font-display)
- Rediseñar **CatalogFilters** con iconos por categoría y estilo rounded-chip activo con los colores primary/secondary del design system
- Rediseñar **ProductGrid** con skeletons usando `bg-surface-container` y animaciones mejoradas
- Rediseñar **SearchBar** con los tokens de borde (`rounded-input`, `border-outline/10`) y focus ring primary
- Rediseñar **Pagination** con los colores primary y rounded-lg consistentes
- Mejorar **estados vacío y error** del grid con iconografía y mensajes más claros
- Aplicar design tokens Vivid Modernity en todos los componentes (colores primary, secondary, tertiary; rounded-card, rounded-chip, font-display, text-on-surface, surface-container, outline)
- NO hay cambios en la lógica de negocio, endpoints, ni datos — solo presentación visual

## Capabilities

### New Capabilities
- `catalogo-visual`: Rediseño visual del catálogo manteniendo la funcionalidad existente

### Modified Capabilities
<!-- No hay cambios en requirements — solo presentación visual -->

## Impact

- **frontend/src/widgets/product-card/ProductCard.tsx**: Rediseño completo con badges y design tokens
- **frontend/src/widgets/catalog-filters/CatalogFilters.tsx**: Rediseño con iconos y tokens
- **frontend/src/widgets/product-grid/ProductGrid.tsx**: Skeletons y estados con tokens
- **frontend/src/widgets/search-bar/SearchBar.tsx**: Tokens de borde y focus
- **frontend/src/widgets/pagination/Pagination.tsx**: Tokens de color
- **frontend/src/pages/catalogo/CatalogPage.tsx**: Layout general con tokens
- NO hay cambios en API, base de datos, dependencias npm, ni lógica de negocio

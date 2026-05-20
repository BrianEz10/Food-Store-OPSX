# catalogo-visual

## Overview
Rediseño visual del catálogo de productos aplicando el sistema de diseño Vivid Modernity. Cambios exclusivamente de presentación — no se modifica comportamiento ni lógica de negocio.

## ADDED Requirements

### Requirement: ProductCard con badges visuales
La ProductCard DEBE mostrar badges según el estado del producto: "Nuevo" si fue creado en los últimos 7 días, y badge de disponibilidad (Disponible / Sin stock).

#### Scenario: Badge "Nuevo" en producto reciente
- **WHEN** un producto tiene `creado_en` con fecha menor a 7 días desde la fecha actual
- **THEN** se DEBE mostrar un badge "Nuevo" con color primary en la esquina superior de la imagen

#### Scenario: Badge de stock disponible
- **WHEN** un producto tiene `disponible = true` o `stock_cantidad > 0`
- **THEN** se DEBE mostrar un badge "Disponible" con color tertiary

#### Scenario: Badge de sin stock
- **WHEN** un producto tiene `disponible = false` o `stock_cantidad = 0`
- **THEN** se DEBE mostrar un badge "Sin stock" con color error

### Requirement: Design tokens Vivid Modernity en todos los componentes
Todos los componentes del catálogo DEBEN usar los tokens de color, border-radius y tipografía definidos en tailwind.config.js.

#### Scenario: ProductCard usa tokens
- **WHEN** se renderiza una ProductCard
- **THEN** DEBE usar `rounded-card`, `border-outline/10`, `font-display` para el nombre, y `text-on-surface` / `text-[#b3193d]` (primary) para el precio

#### Scenario: CatalogFilters usa rounded-chip
- **WHEN** se renderizan los botones de filtro por categoría
- **THEN** DEBEN usar `rounded-chip` (9999px), y el activo DEBE usar `bg-[#b3193d] text-white`

#### Scenario: SearchBar usa design tokens
- **WHEN** se renderiza el input de búsqueda
- **THEN** DEBE usar `rounded-input`, `border-outline/10`, y focus ring con primary

#### Scenario: Pagination usa primary
- **WHEN** se renderiza la paginación
- **THEN** la página activa DEBE usar `bg-[#b3193d] text-white` y `rounded-lg`

### Requirement: CatalogFilters con iconos por categoría
Los filtros de categoría DEBEN mostrar un icono de lucide-react junto al nombre de cada categoría.

#### Scenario: Filtro con icono
- **WHEN** se renderiza un filtro de categoría
- **THEN** DEBE mostrar un icono representativo (utensilio, pizza, café, etc.) a la izquierda del nombre
- **THEN** SI el nombre de la categoría no tiene un icono mapeado, DEBE usar un icono por defecto (Tag)

### Requirement: Skeletons con surface-container
Los skeletons de carga del grid DEBEN usar `bg-surface-container` para diferenciarse del fondo.

#### Scenario: Skeleton en carga
- **WHEN** el catálogo está cargando productos
- **THEN** los skeletons DEBEN usar `bg-[#ffe9e9]` (surface-container) con animación `animate-pulse`

### Requirement: Estados vacío/error atractivos
Los estados vacío y error del grid DEBEN tener un diseño visual agradable y consistente con el design system.

#### Scenario: Estado vacío
- **WHEN** no hay productos que coincidan con los filtros
- **THEN** se DEBE mostrar un icono grande, un mensaje claro y sugerencia de acción

#### Scenario: Estado de error
- **WHEN** falla la carga de productos
- **THEN** se DEBE mostrar un icono grande, mensaje de error y botón de reintento con color primary

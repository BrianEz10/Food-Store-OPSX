## Context

El catálogo actual es funcional pero visualmente genérico. Usa colores slate/gray de Tailwind en lugar de los tokens Vivid Modernity (primary #b3193d, secondary #6d4e9f, tertiary #006a42). Las ProductCards no tienen badges, los filtros no tienen iconos, los skeletons no usan los colores surface-container, y la paginación usa primary-500 en vez del primary DEFAULT. Todos los componentes existen como widgets separados y se comunican via props + URL searchParams — esa arquitectura no se toca.

## Goals / Non-Goals

**Goals:**
- Aplicar design tokens Vivid Modernity en todos los componentes del catálogo (ProductCard, CatalogFilters, ProductGrid, SearchBar, Pagination, CatalogPage)
- Agregar badges visuales a ProductCard: badge de disponible/no-disponible, badge de "Nuevo" para productos recientes
- Rediseñar CatalogFilters con iconos lucide-react por categoría y estilo rounded-chip
- Mejorar skeletons con surface-container y animación de pulso más sutil
- Mejorar estados vacío/error con diseño atractivo y consistente
- NO romper ninguna funcionalidad existente (búsqueda, filtros, paginación, add-to-cart)

**Non-Goals:**
- No se cambia la lógica de negocio ni los queries
- No se agregan nuevos endpoints
- No se modifica la entidad Product ni sus tipos
- No se agregan dependencias npm nuevas
- No se rediseña la página de detalle de producto (/producto/:id)

## Decisions

### 1. Badge de "Nuevo" basado en creado_en
Usamos `Date.parse(product.creado_en)` para determinar si un producto se creó en los últimos 7 días. Alternativa considerada: campo `es_nuevo` en la API — pero eso requeriría cambios en el backend. Usar la fecha existing es más simple y no requiere cambios en API.

### 2. Iconos por categoría con función getCategoryIcon
Replicamos el patrón de HomePage: una función `getCategoryIcon(nombre: string)` que mapea nombres a iconos de lucide-react. Esto evita tener que modificar la API de categorías para incluir un campo `icono`.

### 3. Badge de stock con color condicional
- stock_cantidad > 0 → badge verde/tertiary "Disponible"
- stock_cantidad === 0 → badge rojo/error "Sin stock"
- Si no hay stock_cantidad en ProductListItem (no está en el type), usamos `disponible` booleano

### 4. Design tokens consistentes
Todos los componentes usan los tokens definidos en tailwind.config.js:
- `rounded-card` para cards y contenedores
- `rounded-chip` (9999px) para filtros
- `border-outline/10` para bordes suaves
- `bg-surface-container` para skeletons y fondos alternos
- `font-display` para títulos
- `text-on-surface` para texto principal
- Paleta primary/secondary/tertiary con DEFAULT, hover, light

### 5. No se crean componentes nuevos
Todo el rediseño se hace modificando los componentes existentes. No se crean nuevos archivos ni carpetas.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Badge "Nuevo" basado en fecha puede incluir productos que no son realmente nuevos | El threshold de 7 días es razonable para un catálogo de alimentos. Ajustable cambiando la constante. |
| ProductListItem no expone `disponible`? | Verificar type. Si no está, usamos stock_cantidad > 0. Si tampoco está stock_cantidad, omitimos badge de stock. |
| Iconos de categoría hardcodeados pueden no cubrir todas las categorías | getCategoryIcon tiene un default (Tag) para categorías no mapeadas. |
| Los cambios son puramente visuales pero tocan 6 archivos | Se hace incremental: primero ProductCard, luego CatalogFilters, luego ProductGrid, luego SearchBar, luego Pagination, finalmente CatalogPage. Cada paso se verifica con tsc. |

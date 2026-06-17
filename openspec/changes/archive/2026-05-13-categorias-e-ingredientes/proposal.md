# Proposal: categorias-e-ingredientes

## Why

Food Store necesita un sistema de gestión de categorías jerárquicas e ingredientes que permita:

1. **Categorías jerárquicas**: Los productos se organizan en categorías con estructura de árbol (ej: Bebidas → Gaseosas → Cola). Esto es esencial para la navegación del catálogo y la organización interna del stock.

2. **Ingredientes con alérgenos**: Cada producto tiene ingredientes asociados, y algunos son alérgenos (frutos secos, lacteos, gluten). Los clientes necesitan filtrar productos por alérgenos para compras seguras.

3. **Dependencia crítica**: Los cambios posteriores (07a productos-crud-backend, 07b catalogo-publico, 07c gestion-productos-stock) dependen de que categorías e ingredientes existan primero.

## What Changes

### Backend (FastAPI)

1. **Módulo `categorias/`**
   - CRUD completo con jerarquía padre-hijo
   - CTE recursivo para consultar árbol completo de categorías
   - Validación de ciclos al crear/editar (una categoría no puede ser ancestro de sí misma)
   - Soft delete: no se elimina si hay productos asociados
   - Endpoints protegidos por rol STOCK/ADMIN

2. **Módulo `ingredientes/`**
   - CRUD completo con flag `es_alergeno`
   - Soft delete validando productos asociados
   - Endpoints protegidos por rol STOCK/ADMIN

### Frontend (React)

1. **Vistas de gestión (STOCK/ADMIN)**
   - Listado de categorías con tree view
   - Formulario CRUD de categorías (modal o página)
   - Listado de ingredientes con filtro de alérgenos
   - Formulario CRUD de ingredientes

2. **Catálogo público**
   - Componente de tree view de categorías para navegación
   - Filtro de productos por alérgenos (integrado en Change 07b)

## Dependencies

- **Requires**: Change 03a (`auth-backend`) — para protección de rutas con roles STOCK/ADMIN
- **Required by**: Changes 07a, 07b, 07c — gestión de productos y catálogo

## Scope

- **Out of Scope**: Asociación de productos con categorías/ingredientes (Change 07a)
- **Out of Scope**: Filtro de alérgenos en el frontend del catálogo (Change 07b)

## Risks

1. **Validación de ciclos en jerarquía**: Usar CTE para detectar ciclos antes de guardar
2. **Soft delete cascade**: Validar que al eliminar categoría no queden productos huérfanos
3. **CTE recursivo en PostgreSQL**: Asegurar que las queries con profundidad >10 funcionen bien
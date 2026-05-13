# Design: categorias-e-ingredientes

## Architecture Overview

```
Backend (FastAPI)
├── app/api/v1/
│   ├── categorias/     # CRUD categorías jerárquicas
│   └── ingredientes/   # CRUD ingredientes con alérgenos
├── app/models/         # SQLAlchemy models (ya existen)
└── app/services/       # Lógica de negocio

Frontend (React)
├── src/features/
│   ├── categorias/     # Gestión de categorías
│   └── ingredientes/  # Gestión de ingredientes
└── src/shared/
    └── components/    # TreeView, DataTable, Forms
```

## Data Models

### Category (ya existe en models)
- `id`: UUID (PK)
- `nombre`: String(100) NOT NULL
- `descripcion`: String(500) nullable
- `categoria_padre_id`: UUID (FK nullable → self)
- `orden`: Integer default 0
- `activo`: Boolean default true
- `fecha_creacion`: DateTime
- `fecha_actualizacion`: DateTime

### Ingredient (ya existe en models)
- `id`: UUID (PK)
- `nombre`: String(100) NOT NULL
- `descripcion`: String(500) nullable
- `es_alergeno`: Boolean default false
- `activo`: Boolean default true
- `fecha_creacion`: DateTime
- `fecha_actualizacion`: DateTime

### Relationships
- Category 1:N Category (self-referential)
- Product N:M Category (tabla intermedia)
- Product N:M Ingredient (tabla intermedia)

## API Design

### Endpoints: Categorías

| Method | Endpoint | Rol | Descripción |
|--------|----------|-----|-------------|
| GET | `/api/v1/categorias` | ANY | Listar todas las categorías (tree flattened) |
| GET | `/api/v1/categorias/{id}` | ANY | Ver una categoría con sus hijos |
| GET | `/api/v1/categorias/arbol` | ANY | Árbol completo jerárquico |
| POST | `/api/v1/categorias` | STOCK, ADMIN | Crear categoría |
| PUT | `/api/v1/categorias/{id}` | STOCK, ADMIN | Editar categoría |
| DELETE | `/api/v1/categorias/{id}` | STOCK, ADMIN | Soft delete (validar productos) |

### Endpoints: Ingredientes

| Method | Endpoint | Rol | Descripción |
|--------|----------|-----|-------------|
| GET | `/api/v1/ingredientes` | ANY | Listar ingredientes |
| GET | `/api/v1/ingredientes/alergenos` | ANY | Listar solo alérgenos |
| GET | `/api/v1/ingredientes/{id}` | ANY | Ver ingrediente |
| POST | `/api/v1/ingredientes` | STOCK, ADMIN | Crear ingrediente |
| PUT | `/api/v1/ingredientes/{id}` | STOCK, ADMIN | Editar ingrediente |
| DELETE | `/api/v1/ingredientes/{id}` | STOCK, ADMIN | Soft delete |

## Business Logic

### Categorías

1. **CTE Recursivo para árbol**
   ```sql
   WITH RECURSIVE categoria_tree AS (
     SELECT id, nombre, categoria_padre_id, 0 as nivel
     FROM categorias WHERE activa = true AND categoria_padre_id IS NULL
     UNION ALL
     SELECT c.id, c.nombre, c.categoria_padre_id, ct.nivel + 1
     FROM categorias c
     INNER JOIN categoria_tree ct ON c.categoria_padre_id = ct.id
   )
   ```

2. **Validación de ciclos**
   - Antes de crear/editar, verificar que la categoría no sea ancestro de sí misma
   - Query recursiva ascendente desde el padre propuesto

3. **Soft delete con validación**
   - Verificar si hay productos activos asociados antes de eliminar
   - Si hay productos, retornar error 409 con mensaje

### Ingredientes

1. **Flag de alérgeno**
   - Boolean simple, consulted por el frontend para filtros
   - En el catálogo, mostrar badge "🔴 Alérgeno" en productos que contengan ingredientes marcados

## Frontend Components

### CategoryTree
- Mostrar jerarquía visual con indentación
- Expandir/colapsar nodos
- Click para seleccionar (para asociación en productos)

### CategoryForm
- Campos: nombre, descripción, padre (select), orden
- Validación: nombre único en mismo nivel

### IngredientList
- Tabla con columnas: nombre, descripción, es_alergeno (badge), acciones
- Filtro toggle: "Solo alérgenos"

### IngredientForm
- Campos: nombre, descripción, checkbox es_alérgeno

## Integration Points

1. **Change 07a (productos)**: Los módulos de categorías e ingredientes deben estar listos para que productos pueda hacer las asociaciones M2M
2. **Change 07b (catálogo)**: El tree de categorías se usará para navegación, el filtro de alérgenos consultará `/ingredientes/alergenos`

## Security

- Todos los endpoints POST/PUT/DELETE requieren rol STOCK o ADMIN
- GET público para catálogos
- Validar ownership implícito por JWT en endpoints de gestión
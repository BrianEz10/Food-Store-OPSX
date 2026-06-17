# Spec: Frontend - Categorías e Ingredientes

## Resumen

Componentes React para gestión de categorías jerárquicas e ingredientes.

## User Stories Cubiertas

- US-007: Ver listado de categorías (cliente - catálogo)
- US-008: Ver árbol de categorías (cliente - catálogo)
- US-009: Crear categoría (admin/stock)
- US-010: Editar categoría (admin/stock)
- US-011: Eliminar categoría (admin/stock)
- US-013: Gestionar ingredientes (admin/stock)
- US-014: Flag de alérgenos

## Componentes Requeridos

### CategoryTree
- Props: `categories: CategoryTree[]`, `onSelect?: (id) => void`
- Renderiza jerarquía con indentation y arrows de expandir/colapsar
- Estados: collapsed, expanded, selected

### CategoryListPage
- Ruta: `/admin/categorias`
- Features: lista plana, botón crear, acciones editar/eliminar

### CategoryFormModal
- Fields: nombre (required), descripcion, categoria_padre (select), orden
- Validation: nombre único en mismo nivel

### IngredientListPage
- Ruta: `/admin/ingredientes`
- Features: tabla con filtros, toggle "Solo alérgenos"

### IngredientFormModal
- Fields: nombre (required), descripcion, es_alergeno (checkbox)

## Integración con API

```typescript
// categorias/api.ts
export const categoriasApi = {
  list: () => axios.get<Categoria[]>('/api/v1/categorias'),
  tree: () => axios.get<CategoriaTree[]>('/api/v1/categorias/arbol'),
  create: (data: CreateCategoriaDto) => axios.post('/api/v1/categorias', data),
  update: (id: string, data: UpdateCategoriaDto) => axios.put(`/api/v1/categorias/${id}`, data),
  delete: (id: string) => axios.delete(`/api/v1/categorias/${id}`),
};

// ingredientes/api.ts
export const ingredientesApi = {
  list: () => axios.get<Ingrediente[]>('/api/v1/ingredientes'),
  listAlergenos: () => axios.get<Ingrediente[]>('/api/v1/ingredientes/alergenos'),
  create: (data: CreateIngredienteDto) => axios.post('/api/v1/ingredientes', data),
  update: (id: string, data: UpdateIngredienteDto) => axios.put(`/api/v1/ingredientes/${id}`, data),
  delete: (id: string) => axios.delete(`/api/v1/ingredientes/${id}`),
};
```

## Routing

```typescript
// routes.ts
{
  path: '/admin/categorias',
  element: <CategoryListPage />,
  loader: requireRole(['STOCK', 'ADMIN']),
},
{
  path: '/admin/ingredientes',
  element: <IngredientListPage />,
  loader: requireRole(['STOCK', 'ADMIN']),
},
```

## UX/UI

- Loading skeletons en listados
- Toast success/error en CRUD operations
- Confirm dialog en delete
- Badge 🔴 para ingredientes alérgenos
- Badge 🟢 para ingredientes regulares
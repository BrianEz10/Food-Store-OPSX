## 1. Backend - Categorías

- [x] 1.1 Crear `app/api/v1/categorias/schemas.py` con Pydantic models (Create, Update, Response)
- [x] 1.2 Crear `app/api/v1/categorias/repository.py` con métodos CRUD y CTE recursivo
- [x] 1.3 Crear `app/api/v1/categorias/service.py` con lógica de validación de ciclos y soft delete
- [x] 1.4 Crear `app/api/v1/categorias/router.py` con todos los endpoints (GET list, GET tree, POST, PUT, DELETE)
- [x] 1.5 Registrar router en `app/api/v1/__init__.py`
- [x] 1.6 Implementar protección de rutas con `require_role(['STOCK', 'ADMIN'])`

## 2. Backend - Ingredientes

- [x] 2.1 Crear `app/api/v1/ingredientes/schemas.py` con Pydantic models
- [x] 2.2 Crear `app/api/v1/ingredientes/repository.py` con métodos CRUD
- [x] 2.3 Crear `app/api/v1/ingredientes/service.py` con lógica de soft delete
- [x] 2.4 Crear `app/api/v1/ingredientes/router.py` con todos los endpoints
- [x] 2.5 Registrar router en `app/api/v1/__init__.py` (main.py)
- [x] 2.6 Implementar endpoint `/alergenos` público para filtros del catálogo

## 3. Frontend - API y Stores

- [x] 3.1 Crear `src/features/categorias/api.ts` con funciones Axios para categorías
- [x] 3.2 Crear `src/features/categorias/categoriaStore.ts` (Zustand) para estado local
- [x] 3.3 Crear `src/features/ingredientes/api.ts` con funciones Axios para ingredientes
- [x] 3.4 Crear `src/features/ingredientes/ingredienteStore.ts` (Zustand) para estado local

## 4. Frontend - Componentes de Categorías

- [x] 4.1 Crear componente `CategoryTree.tsx` para visualización jerárquica (tree en CategoryListPage)
- [x] 4.2 Crear `CategoryListPage.tsx` en `src/pages/admin/categorias/`
- [x] 4.3 Crear `CategoryFormModal.tsx` con formulario de creación/edición
- [x] 4.4 Implementar validación de ciclos en el frontend (mostrar error si corresponde)

## 5. Frontend - Componentes de Ingredientes

- [x] 5.1 Crear `IngredientListPage.tsx` en `src/pages/admin/ingredientes/`
- [x] 5.2 Crear `IngredientFormModal.tsx` con formulario y toggle de alérgeno
- [x] 5.3 Agregar filtro "Solo alérgenos" en el listado

## 6. Routing y Protección

- [x] 6.1 Registrar rutas `/admin/categorias` y `/admin/ingredientes` en AppRouter
- [x] 6.2 Proteger rutas con `RoleBasedRoute` para roles STOCK/ADMIN
- [ ] 6.3 Agregar items al menú lateral para admin (categorías, ingredientes)

## 7. Testing y Validación

- [ ] 7.1 Testear crear categoría con padre → verificar árbol
- [ ] 7.2 Testear crear categoría que crea ciclo → debe fallar con 409
- [ ] 7.3 Testear eliminar categoría con productos asociados → debe fallar con 409
- [ ] 7.4 Testear soft delete y restore de ingredientes
- [ ] 7.5 Verificar que el endpoint público `/alergenos` funcione sin auth
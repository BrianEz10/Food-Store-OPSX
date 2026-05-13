## Context

El módulo `productos/` existe con modelo y repositorio base, pero carece de schemas, servicio y router. Los modelos `Producto`, `ProductoCategoria` y `ProductoIngrediente` ya están migrados. Las tablas pivote M2M (`productos_categorias` y `productos_ingredientes`) ya existen. Dependencias satisfechas: Change 04 (categorías e ingredientes) archivado.

Actualmente `productos/repository.py` tiene un bug: importa `Ingrediente` desde `app.modules.productos.model` cuando la clase fue movida a `app.modules.ingredientes.model`. También expone un `IngredienteRepository` redundante (ya existe en `ingredientes/repository.py`).

Este change sigue el patrón establecido por los módulos `categorias` e `ingredientes`: schemas Pydantic V2 → service con lógica de negocio → router FastAPI con endpoints.

## Goals / Non-Goals

**Goals:**
- CRUD completo de productos con schemas, service y router FastAPI
- Asociación M2M con categorías e ingredientes durante creación/actualización
- Listado público con paginación, filtro por categoría y búsqueda por nombre
- Soft delete con validación de pedidos activos
- Endpoints protegidos por rol (STOCK/ADMIN para mutaciones, público para lecturas)
- Corrección del bug de importación de Ingrediente en repository

**Non-Goals:**
- Catálogo público con vista de detalle enriquecida (es Change 07b)
- Panel de gestión de stock frontend (es Change 07c)
- Imágenes de productos (upload/storage) — la URL se guarda como string
- Historial de cambios de stock
- Precios con descuento u ofertas temporales

## Decisions

### 1. Estrategia de reemplazo completo de relaciones M2M

**Decisión**: En creación/actualización, las relaciones M2M se reemplazan completamente. Se eliminan todas las filas existentes en `productos_categorias` y `productos_ingredientes` y se insertan las nuevas.

**Por qué**: Es el approach más simple y predecible. El frontend siempre envía el estado completo de las relaciones. Evita lógica diff, estados inconsistentes y bugs de sincronización. Es el mismo patrón que usa el módulo `categorias` para su jerarquía.

**Alternativa considerada**: Actualización incremental (agregar/quitar relaciones individuales). Descartada porque requiere endpoints adicionales, aumenta la complejidad del frontend y no hay requerimiento de edición parcial de relaciones.

### 2. Validación de pedidos activos en soft delete

**Decisión**: El service verifica existencia de `DetallePedido` asociado al producto en pedidos con estado != ENTREGADO y != CANCELADO antes de ejecutar el soft delete.

**Por qué**: Los pedidos activos referencian productos por FK. Si se permite eliminar (soft delete) sin verificar, un pedido activo podría tener productos "desaparecidos". La consulta excluye estados terminales (ENTREGADO, CANCELADO) porque esos pedidos ya no se modifican.

**Implementación**: Query que cruza `DetallePedido` → `Pedido` → `EstadoPedido` para verificar estados no terminales.

### 3. Métodos de dominio en ProductoRepository

**Decisión**: Extender `ProductoRepository` con métodos específicos (`search_by_name`, `list_by_categoria`, `has_active_orders`) en lugar de hacer queries inline en el service.

**Por qué**: Mantiene las queries de dominio encapsuladas en el repositorio, facilita testing y sigue el patrón de `BaseRepository[T]` con herencia. El service se enfoca en lógica de negocio (orquestación, validaciones, transacciones).

### 4. Transacciones con Unit of Work

**Decisión**: El service usa `UnitOfWork` para operaciones que afectan múltiples tablas (creación/actualización de producto + relaciones M2M).

**Por qué**: Garantiza atomicidad — si falla la inserción de relaciones, el producto no se crea. Sigue el patrón establecido en `app/core/uow.py`. Para operaciones de solo lectura (listado, get by id) se usa `AsyncSession` directa para simplicidad.

**Alternativa considerada**: Usar `AsyncSession` con commit manual para todo. Descartado porque el UoW ya está implementado y es el estándar del proyecto para operaciones de escritura.

### 5. Esquema de response con relaciones incluidas

**Decisión**: El response de producto incluye listas anidadas de categorías e ingredientes (no solo IDs). Para listados paginados, las relaciones NO se incluyen (solo datos base del producto).

**Por qué**: Performance — incluir relaciones en listados paginados generaría N+1 queries o joins costosos. El detalle completo está disponible en el endpoint GET individual. Es el mismo approach que usa `categorias` donde el árbol jerárquico tiene su propio endpoint.

### 6. Corrección del bug IngredienteRepository

**Decisión**: Se elimina `IngredienteRepository` de `productos/repository.py` (es redundante — ya existe en `ingredientes/repository.py`). Se actualiza la importación en `UoW` para que use `ingredientes.repository.IngredienteRepository`. El `ProductoRepository` se queda en `productos/repository.py` pero se corrige cualquier importación rota.

**Por qué**: No tiene sentido mantener dos repositorios para la misma entidad. El de `ingredientes/` ya tiene métodos de dominio (`get_all_active`, `get_alergenos`).

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| **Concurrencia en stock**: Dos requests simultáneos podrían sobrescribir stock | El UoW con `commit()` al final garantiza que la última escritura persiste. Para 07a no se requiere `SELECT FOR UPDATE` (se añadirá en 09a con pedidos) |
| **N+1 queries en listado**: Si en el futuro se quieren incluir relaciones en listados paginados | Por ahora el listado no incluye relaciones. Cuando se necesiten, se implementará con `selectinload` o `joinedload` de SQLAlchemy |
| **Relaciones huérfanas**: Si se elimina una categoría o ingrediente usado por un producto | El soft delete de categorías (Change 04) ya verifica productos asociados. Para ingredientes es análogo |
| **Rendimiento en búsqueda por nombre**: ILIKE en gran volumen de productos | El filtro por categoría y la paginación mitigan el impacto. Si es necesario, se puede añadir un índice GIST/tgrm en el futuro |

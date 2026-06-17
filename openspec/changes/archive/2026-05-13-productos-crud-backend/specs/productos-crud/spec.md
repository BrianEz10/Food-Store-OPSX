## ADDED Requirements

### Requirement: Creación de productos con relaciones M2M
El sistema SHALL permitir crear productos con nombre, descripción, imagen, precio base, stock inicial y asociaciones M2M a categorías e ingredientes. Las asociaciones se reciben como listas de IDs y se persisten en las tablas pivote `productos_categorias` y `productos_ingredientes`.

#### Scenario: Creación exitosa de producto con categorías e ingredientes
- **WHEN** un usuario con rol STOCK o ADMIN envía un POST con nombre, precio_base=99.99, categoria_ids=[1,2], ingredientes=[{"ingrediente_id": 1, "es_removible": true}]
- **THEN** se crea el producto en la tabla `productos`, se insertan registros en `productos_categorias` y `productos_ingredientes`, y se retorna HTTP 201 con el producto completo incluyendo sus relaciones

#### Scenario: Creación sin categorías (producto huérfano permitido)
- **WHEN** un usuario envía un POST con nombre y precio_base pero sin categoria_ids ni ingredientes
- **THEN** se crea el producto sin asociaciones y se retorna HTTP 201

#### Scenario: Creación con precio negativo
- **WHEN** un usuario envía un POST con precio_base=-10
- **THEN** se retorna HTTP 422 con error de validación (check constraint de BD)

### Requirement: Listado de productos con paginación y filtros
El sistema SHALL exponer un endpoint público GET que liste productos activos con paginación (skip/limit), ordenados por nombre. Debe soportar filtro opcional por categoría (categoria_id) y búsqueda por nombre (LIKE / ILIKE).

#### Scenario: Listado paginado sin filtros
- **WHEN** un usuario (autenticado o no) hace GET /api/v1/productos?skip=0&limit=10
- **THEN** se retorna HTTP 200 con hasta 10 productos activos y el campo `total` con el conteo total

#### Scenario: Filtro por categoría
- **WHEN** un usuario hace GET /api/v1/productos?categoria_id=5
- **THEN** se retornan solo los productos que tienen la categoría con id=5

#### Scenario: Búsqueda por nombre (ILIKE)
- **WHEN** un usuario hace GET /api/v1/productos?search=hamburguesa
- **THEN** se retornan productos cuyo nombre contenga "hamburguesa" (case-insensitive)

### Requirement: Obtención de producto por ID con relaciones
El sistema SHALL exponer un endpoint público GET que retorne un producto por su ID incluyendo sus categorías e ingredientes asociados.

#### Scenario: Producto existente
- **WHEN** un usuario hace GET /api/v1/productos/1
- **THEN** se retorna HTTP 200 con el producto, sus categorías y sus ingredientes

#### Scenario: Producto inexistente o eliminado
- **WHEN** un usuario hace GET /api/v1/productos/999
- **THEN** se retorna HTTP 404 con mensaje "Producto no encontrado"

### Requirement: Actualización de producto con reemplazo de relaciones
El sistema SHALL permitir actualizar un producto existente, reemplazando completamente sus asociaciones M2M (categorías e ingredientes) por las nuevas listas enviadas. Si no se envían categoria_ids o ingredientes, se eliminan las asociaciones existentes (reemplazo completo).

#### Scenario: Actualización exitosa con nuevas relaciones
- **WHEN** un usuario con rol STOCK o ADMIN envía PUT /api/v1/productos/1 con nombre="Hamburguesa Premium", categoria_ids=[3,4], ingredientes=[{"ingrediente_id": 2, "es_removible": false}]
- **THEN** se actualiza el producto, se reemplazan las relaciones M2M, y se retorna HTTP 200

#### Scenario: Actualización de producto inexistente
- **WHEN** un usuario envía PUT /api/v1/productos/999
- **THEN** se retorna HTTP 404

### Requirement: Soft delete de producto con validación de pedidos activos
El sistema SHALL permitir soft delete de un producto (establecer `eliminado_en`) solo si no tiene pedidos activos asociados. Se considera "pedido activo" aquel con estado distinto de ENTREGADO y CANCELADO.

#### Scenario: Soft delete exitoso sin pedidos activos
- **WHEN** un usuario con rol STOCK o ADMIN envía DELETE /api/v1/productos/1 y el producto no tiene detalles en pedidos activos
- **THEN** se establece `eliminado_en` con el timestamp actual y se retorna HTTP 200 con id y eliminado_en

#### Scenario: Soft delete bloqueado por pedidos activos
- **WHEN** un usuario envía DELETE /api/v1/productos/1 y el producto tiene detalles en pedidos con estado PENDIENTE o CONFIRMADO
- **THEN** se retorna HTTP 409 Conflict con mensaje "No se puede eliminar el producto porque tiene pedidos activos asociados"

#### Scenario: Soft delete de producto inexistente
- **WHEN** un usuario envía DELETE /api/v1/productos/999
- **THEN** se retorna HTTP 404

### Requirement: Control de stock y flag disponible
El sistema SHALL validar que `stock_cantidad` nunca sea negativo (check constraint en BD). El flag `disponible` controla si el producto aparece en el catálogo público. Un producto con stock 0 puede permanecer `disponible=true` (para Pre-Venta) o pasar a `disponible=false`.

#### Scenario: Actualización de stock válida
- **WHEN** un usuario actualiza stock_cantidad a 10
- **THEN** el cambio se guarda correctamente

#### Scenario: Stock negativo rechazado
- **WHEN** un usuario intenta actualizar stock_cantidad a -1
- **THEN** la BD rechaza el cambio (check constraint) y se retorna HTTP 422

### Requirement: Endpoints protegidos por rol
El sistema SHALL proteger los endpoints de creación, actualización y eliminación bajo los roles STOCK y ADMIN. El endpoint de listado público y obtención por ID son accesibles sin autenticación.

#### Scenario: Usuario no autenticado puede listar
- **WHEN** un usuario no autenticado hace GET /api/v1/productos
- **THEN** se retorna HTTP 200

#### Scenario: Usuario sin rol no puede crear
- **WHEN** un usuario con rol CLIENT intenta crear un producto
- **THEN** se retorna HTTP 403 Forbidden

#### Scenario: Usuario con rol STOCK puede crear
- **WHEN** un usuario con rol STOCK envía un POST válido para crear producto
- **THEN** se retorna HTTP 201

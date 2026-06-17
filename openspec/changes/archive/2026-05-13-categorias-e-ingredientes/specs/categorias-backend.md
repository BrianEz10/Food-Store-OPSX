# Spec: Backend - Categorías

## Resumen

Módulo de API REST para CRUD de categorías jerárquicas en FastAPI.

## User Stories Cubiertas

- US-007: Ver listado de categorías (cliente)
- US-008: Ver árbol de categorías (cliente)
- US-009: Crear categoría (admin/stock)
- US-010: Editar categoría (admin/stock)
- US-011: Eliminar categoría (admin/stock)
- US-012: Validar jerarquía sin ciclos

## Endpoint: GET /api/v1/categorias

### Request
```http
GET /api/v1/categorias
```

### Response 200
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "Bebidas",
      "descripcion": "Todas las bebidas",
      "categoria_padre_id": null,
      "orden": 0,
      "activo": true,
      "fecha_creacion": "2026-01-01T00:00:00Z",
      "fecha_actualizacion": "2026-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

## Endpoint: GET /api/v1/categorias/arbol

### Request
```http
GET /api/v1/categorias/arbol
```

### Response 200
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "Bebidas",
      "hijos": [
        {
          "id": "uuid-2",
          "nombre": "Gaseosas",
          "hijos": [
            {"id": "uuid-3", "nombre": "Cola", "hijos": []}
          ]
        }
      ]
    }
  ]
}
```

## Endpoint: POST /api/v1/categorias

### Request
```http
POST /api/v1/categorias
Authorization: Bearer <token STOCK/ADMIN>

{
  "nombre": "Snacks",
  "descripcion": "Snacks y pochoclos",
  "categoria_padre_id": null,
  "orden": 0
}
```

### Response 201
```json
{
  "data": {
    "id": "uuid",
    "nombre": "Snacks",
    "descripcion": "Snacks y pochoclos",
    "categoria_padre_id": null,
    "orden": 0,
    "activo": true,
    "fecha_creacion": "2026-01-01T00:00:00Z",
    "fecha_actualizacion": "2026-01-01T00:00:00Z"
  }
}
```

### Errores
- 422: Validación de errores (nombre requerido, etc.)
- 409: Ciclo detectado en jerarquía

## Endpoint: DELETE /api/v1/categorias/{id}

### Request
```http
DELETE /api/v1/categorias/{id}
Authorization: Bearer <token STOCK/ADMIN>
```

### Response 200
```json
{
  "data": {"id": "uuid", "activo": false}
}
```

### Errores
- 409: Hay productos asociados a esta categoría
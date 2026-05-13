# Spec: Backend - Ingredientes

## Resumen

Módulo de API REST para CRUD de ingredientes con flag de alérgeno en FastAPI.

## User Stories Cubiertas

- US-013: Gestionar ingredientes (admin/stock)
- US-014: Flag de alérgenos

## Endpoint: GET /api/v1/ingredientes

### Request
```http
GET /api/v1/ingredientes
```

### Response 200
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "Harina de trigo",
      "descripcion": "Derivado del trigo",
      "es_alergeno": true,
      "activo": true,
      "fecha_creacion": "2026-01-01T00:00:00Z",
      "fecha_actualizacion": "2026-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

## Endpoint: GET /api/v1/ingredientes/alergenos

### Request
```http
GET /api/v1/ingredientes/alergenos
```

### Response 200
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "Harina de trigo",
      "es_alergeno": true
    }
  ]
}
```

## Endpoint: POST /api/v1/ingredientes

### Request
```http
POST /api/v1/ingredientes
Authorization: Bearer <token STOCK/ADMIN>

{
  "nombre": "Leche",
  "descripcion": "Leche fluida",
  "es_alergeno": true
}
```

### Response 201
```json
{
  "data": {
    "id": "uuid",
    "nombre": "Leche",
    "descripcion": "Leche fluida",
    "es_alergeno": true,
    "activo": true,
    "fecha_creacion": "2026-01-01T00:00:00Z",
    "fecha_actualizacion": "2026-01-01T00:00:00Z"
  }
}
```

## Endpoint: DELETE /api/v1/ingredientes/{id}

### Request
```http
DELETE /api/v1/ingredientes/{id}
Authorization: Bearer <token STOCK/ADMIN>
```

### Response 200
```json
{
  "data": {"id": "uuid", "activo": false}
}
```

### Errores
- 409: Hay productos asociados a este ingrediente
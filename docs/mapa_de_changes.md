# 🍔 Food Store — Mapa de Changes (Opción B)

> **Proyecto**: Food Store — E-commerce de alimentos
> **Stack**: React + TypeScript + FastAPI + PostgreSQL
> **Total HU**: 77 historias de usuario (US-000 a US-076)
> **Total Changes**: 18 incrementos (+2 archivados = 20 total)
> **Estrategia**: Solo los changes 🔴 Alta complejidad se dividen en backend/frontend

---

## Grafo de Dependencias

```
                                    ┌─────────────────────────┐
                              ┌────▶│ 04 categorias-          │─────┐
                              │     │    ingredientes✅       │     │
                              │     └─────────────────────────┘     │
                              │                                     ▼
┌───────────────────┐   ┌─────┴──────────┐                ┌────────────────────┐
│ 01 setup-backend  │──▶│ 03a auth-      │                │07a productos-crud✅│──┐
│    core ✅        │   │    backend✅   │──┐             │     backend        │  │
└───────────────────┘   └────────────────┘  │             └────────────────────┘  │
                              │             │                     │               │
                              │             │                     ▼               │
                              │             │     ┌──────────────────────────┐    │
                              ▼             │     │ 07b catalogo-publico     │    │
                  ┌──────────────────────┐  │     └──────────────────────────┘    │
                  │ 06 perfil-           │  │                     │               │
                  │   direcciones✅      │──┼─────────────────────┤               ▼
                  └──────────────────────┘  │                     │    ┌──────────────────┐
                              │             │                     ▼    │ 07c gestion-     │
                              │             │          ┌──────────────┐│     stock        │
                              │             │          │ 08 carrito   │└──────────────────┘
                              ▼             │          │    compras   │
                  ┌──────────────────────┐  │          └──────┬───────┘
                  │ 09a pedidos-backend  │◀─┘                 │
                  │                      │◀───────────────────┘
                  └──────────┬───────────┘
                       ┌─────┼──────────────────────┐
                       │     │                      │
                       ▼     ▼                      ▼
          ┌──────────────┐ ┌───────────────┐ ┌────────────────┐
          │ 09b checkout │ │ 10 pagos-     │ │ 11a fsm-       │◀──┐
          │     frontend │ │    mercadopago│─┘│     backend    │  │
          └──────────────┘ └───────────────┘  └───────┬────────┘  │
                                                 ┌────┼────┐      │
                                                 │    │    │      │
                                                 ▼    ▼    ▼      │
                                     ┌───────┐┌──────┐┌──────┐    │
                                     │ 11b   ││ 12   ││ 13   │    │
                                     │visual.││admin ││dashb.│    │
                                     └───────┘└──────┘└──────┘    │
                                                                  │
┌───────────────────┐   ┌────────────────┐                        │
│ 02 setup-frontend │──▶│ 03b auth-      │                        │
│    core ✅        │──▶│   frontend ✅  │                        │
└───────────────────┘   └────────┬───────┘                        │
                                 │                                │
                                 ▼                                │
                        ┌────────────────┐                        │
                        │ 05 navegacion- │────────────────────────┘
                        │   layout-base✅│
                        └────────────────┘

Leyenda:
  ✅ = Archivado    ──▶ = depende de
  Ruta crítica: 01→03a→04→07a→07b→08→09a→10→11a→12/13
```

---

## Criterios de Diseño

1. **Solo los 🔴 se dividen** — los changes 🟡 y 🟢 son cohesivos y no justifican el overhead de partirlos.
2. **Backend siempre precede al frontend** cuando un change se divide — el backend define los contratos (schemas, endpoints) que el frontend consume.
3. **Cada change es desplegable de forma independiente** — al terminar un change el sistema funciona (parcialmente) sin depender de los siguientes.
4. **Las dependencias son estrictas** — un change nunca usa código de un change que aún no fue archivado.
5. **Granularidad de 1 sesión de trabajo** — cada change es implementable en horas/días.

---

## Ruta Crítica

```
01 → 03a → 04 → 07a → 07b → 08 → 09a → 10 → 11a → 12/13
```

### Paralelizables

- **01 y 02** — Backend y frontend setup son independientes
- **03b, 04, 06** — Pueden empezar en paralelo una vez que 03a está archivado
- **05** — Puede empezar en paralelo con 04 y 06 una vez que 03b está archivado
- **07b y 07c** — Pueden ejecutarse en paralelo una vez que 07a está archivado
- **09b** — Puede ejecutarse en paralelo con 10 una vez que 09a está archivado
- **11b, 12, 13** — Los tres dependen solo de 11a, son paralelos entre sí

---

## Resumen Visual

| # | Change | HU cubiertas | Depende de | Complejidad |
|---|---|---|---|---|
| 01 | `setup-backend-core` | US-000, 000a, 000b, 000d, 068, 074 | — | ✅ Archivado |
| 02 | `setup-frontend-core` | US-000, 000c, 000e | — | ✅ Archivado |
| 03a | `auth-backend` | US-001, 002, 003, 073 | 01 | ✅ Archivado |
| 03b | `auth-frontend` | US-004, 005, 006 | 02, 03a | ✅ Archivado |
| 04 | `categorias-e-ingredientes` | US-007 a 014 | 03a | ✅ Archivado |
| 05 | `navegacion-layout-base` | US-075, 076, 066, 067 | 02, 03b | ✅ Archivado |
| 06 | `perfil-y-direcciones` | US-061 a 063, 024 a 028 | 03a | ✅ Archivado |
| 07a | `productos-crud-backend` | US-015, 016, 017 | 04 | ✅ Archivado |
| 07b | `catalogo-publico` | US-018, 019, 020, 021 | 07a, 05 | 🟡 Media |
| 07c | `gestion-productos-stock` | US-022, 023 | 07a | 🟢 Baja |
| 08 | `carrito-de-compras` | US-029 a 034 | 06, 07b | 🟢 Baja |
| 09a | `pedidos-backend` | US-035, 036, 037, 069, 070 | 06, 08 | 🟡 Media |
| 09b | `checkout-frontend` | US-038, 071 | 09a | 🟢 Baja |
| 10 | `pagos-mercadopago` | US-045, 046, 047, 048, 072 | 09a | 🔴 Alta |
| 11a | `fsm-backend` | US-039, 040, 041, 042, 043, 044 | 09a, 10 | 🟡 Media |
| 11b | `visualizacion-pedidos` | US-049, 050, 051, 052 | 11a | 🟡 Media |
| 12 | `admin-usuarios-y-catalogo` | US-053, 054, 055, 064, 065 | 11a | 🟡 Media |
| 13 | `dashboard-metricas` | US-056, 057, 058, 059, 060 | 11a | 🟡 Media |

**Distribución**: 0 🔴 pendientes · 1 🔴 (pagos, dominio externo) · 6 🟡 · 3 🟢 · 8 ✅ archivados

---

## Change 01: `setup-backend-core` ✅ Archivado (2026-04-28)

| Campo | Valor |
|---|---|
| **Funcionalidad** | Scaffolding backend FastAPI, PostgreSQL, migraciones Alembic con todos los modelos ERD v5, seed data, patrones base (BaseRepository, UoW, dependencias de seguridad), middleware RFC 7807 |
| **HU** | US-000, US-000a, US-000b, US-000d, US-068, US-074 |
| **Depende de** | — |
| **Complejidad** | ✅ Archivado |

---

## Change 02: `setup-frontend-core` ✅ Archivado (2026-05-06)

| Campo | Valor |
|---|---|
| **Funcionalidad** | Scaffolding frontend React + TypeScript + Vite, Tailwind CSS, Axios con interceptores JWT, TanStack Query provider, 4 stores Zustand, estructura FSD |
| **HU** | US-000, US-000c, US-000e |
| **Depende de** | — |
| **Complejidad** | ✅ Archivado |

---

## Change 03a: `auth-backend` ✅ Archivado (2026-05-13)

| Campo | Valor |
|---|---|
| **Funcionalidad** | Módulo auth backend completo: register, login, refresh token, logout. Hashing bcrypt, JWT HS256, rotación de refresh tokens en BD, rate limiting con slowapi (5/15min), `require_role` funcional |
| **HU** | US-001, US-002, US-003, US-073 |
| **Depende de** | **Change 01** (modelos Usuario, Rol, UsuarioRol, RefreshToken; `get_current_user`; seed de roles) |
| **Complejidad** | ✅ Archivado |

**Entregables:**
- Módulo `auth/`: `model.py` (ya existe), `schemas.py`, `repository.py`, `service.py`, `router.py`
- Endpoints: `POST /api/v1/auth/register`, `/login`, `/refresh`, `/logout`
- Hashing bcrypt cost factor ≥ 12
- JWT HS256 con expiración configurable
- Refresh token almacenado en BD + rotación
- Rate limiting en `/login`: 5 intentos / 15 min

---

## Change 03b: `auth-frontend` ✅ Archivado (2026-05-13)

| Campo | Valor |
|---|---|
| **Funcionalidad** | Formularios de registro y login, integración authStore ↔ Axios interceptor, renovación transparente de access token |
| **HU** | US-004, US-005, US-006 |
| **Depende de** | **Change 02** (authStore, Axios instance) y **Change 03a** (endpoints auth operativos) |
| **Complejidad** | ✅ Archivado |

**Entregables:**
- Página de Login con formulario (TanStack Form) + validación
- Página de Register con formulario + validación
- Integración `authStore.login()` / `authStore.logout()`
- Interceptor Axios: attach de token + refresh automático transparente
- Redirect post-login al dashboard según rol

---

## Change 04: `categorias-e-ingredientes` ✅ Archivado (2026-05-13)

| Campo | Valor |
|---|---|
| **Funcionalidad** | CRUD completo de categorías jerárquicas (CTE recursivo) e ingredientes con flag de alérgeno — backend + frontend |
| **HU** | US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014 |
| **Depende de** | **Change 03a** (RBAC — endpoints requieren rol STOCK o ADMIN) |
| **Complejidad** | ✅ Archivado |

**Entregables:**

*Backend:*
- Módulo `categorias/`: CRUD con jerarquía, CTE recursivo, validación de ciclos, soft delete con validación de productos asociados
- Módulo `ingredientes/`: CRUD con flag `es_alergeno`, soft delete

*Frontend:*
- Vistas de gestión (STOCK/ADMIN): formularios, listados, árbol de categorías
- Listado público de categorías para navegación del catálogo

---

## Change 05: `navegacion-layout-base`

| Campo | Valor |
|---|---|
| **Funcionalidad** | Layout principal, navegación adaptada por rol, protección de rutas frontend, manejo global de errores HTTP |
| **HU** | US-075, US-076, US-066, US-067 |
| **Depende de** | **Change 02** (FSD, authStore, uiStore) y **Change 03b** (auth funcional, roles en JWT) |
| **Complejidad** | 🟡 Media |

**Entregables:**
- Layout principal con sidebar/navbar responsive
- Menú adaptado por rol (CLIENT, STOCK, PEDIDOS, ADMIN, anónimo)
- `ProtectedRoute` y `RoleBasedRoute`
- Error boundary global
- Toast/notification system para errores HTTP (400, 403, 404, 429, 500)

---

## Change 06: `perfil-y-direcciones` ✅ Archivado (2026-05-13)

| Campo | Valor |
|---|---|
| **Funcionalidad** | Gestión del perfil del cliente (ver, editar, cambiar contraseña) y CRUD completo de direcciones de entrega con dirección predeterminada — backend + frontend |
| **HU** | US-061, US-062, US-063, US-024, US-025, US-026, US-027, US-028 |
| **Depende de** | **Change 03a** (auth — el perfil y direcciones son datos del usuario autenticado) |
| **Complejidad** | ✅ Archivado |

**Entregables:**

*Backend:*
- Módulo `usuarios/` (perfil): ver perfil, editar datos, cambiar contraseña
- Módulo `direcciones/`: CRUD completo, dirección predeterminada, ownership por JWT

*Frontend:*
- Página de perfil con edición inline
- Gestión de direcciones: lista, crear, editar, eliminar, marcar predeterminada

---

## Change 07a: `productos-crud-backend`

| Campo | Valor |
|---|---|
| **Funcionalidad** | CRUD completo de productos en el backend: creación, edición, soft delete, asociación M2M con categorías e ingredientes, gestión de stock y disponibilidad |
| **HU** | US-015, US-016, US-017 |
| **Depende de** | **Change 04** (categorías e ingredientes deben existir para asociarlos) |
| **Complejidad** | 🟡 Media |

**Entregables:**
- Módulo `productos/`: `model.py` (ya existe), `schemas.py`, `repository.py`, `service.py`, `router.py`
- CRUD con relaciones M2M (categorías, ingredientes)
- Soft delete con validación de pedidos activos
- Control de stock y flag `disponible`
- Endpoints protegidos por rol STOCK/ADMIN

---

## Change 07b: `catalogo-publico`

| Campo | Valor |
|---|---|
| **Funcionalidad** | Catálogo público de productos con paginación, filtros, búsqueda por nombre, filtro por alérgenos y vista de detalle — backend + frontend |
| **HU** | US-018, US-019, US-020, US-021 |
| **Depende de** | **Change 07a** (productos deben existir en BD) y **Change 05** (layout para las vistas) |
| **Complejidad** | 🟡 Media |

**Entregables:**

*Backend:*
- Endpoint público `GET /api/v1/productos`: paginación, filtro por categoría, búsqueda por nombre, filtro por alérgenos
- Endpoint público `GET /api/v1/productos/{id}`: detalle con ingredientes y categorías anidadas

*Frontend:*
- Grid de catálogo con skeleton loaders, debounce en búsqueda, filtros
- Vista de detalle de producto con ingredientes y badge de alérgenos

---

## Change 07c: `gestion-productos-stock`

| Campo | Valor |
|---|---|
| **Funcionalidad** | Panel de gestión de productos y stock para roles STOCK/ADMIN — 100% frontend |
| **HU** | US-022, US-023 |
| **Depende de** | **Change 07a** (endpoints de gestión operativos) |
| **Complejidad** | 🟢 Baja |

**Entregables:**
- Panel de gestión de productos (STOCK/ADMIN): formulario con asociación de categorías e ingredientes
- Panel de gestión de stock: actualizar cantidad, toggle disponible

---

## Change 08: `carrito-de-compras`

| Campo | Valor |
|---|---|
| **Funcionalidad** | Carrito de compras client-side con Zustand + localStorage. Agregar, personalizar (excluir ingredientes), modificar cantidad, eliminar, vaciar, resumen con totales |
| **HU** | US-029, US-030, US-031, US-032, US-033, US-034 |
| **Depende de** | **Change 07b** (catálogo con productos reales) y **Change 06** (cartStore conectado a usuario) |
| **Complejidad** | 🟢 Baja |

**Entregables:**
- CartDrawer / CartPage con listado de items
- Botón "Agregar al carrito" en catálogo y detalle
- Personalización: checkboxes de ingredientes a excluir
- Controles de cantidad (+/-)
- Cálculo reactivo de subtotales y total
- Persistencia en localStorage

---

## Change 09a: `pedidos-backend`

| Campo | Valor |
|---|---|
| **Funcionalidad** | Creación atómica de pedidos con UoW: validación de stock (`SELECT FOR UPDATE`), snapshots de precio y dirección, inserción en `pedidos` + `detalles_pedido` + `historial_estados_pedido` en una sola transacción |
| **HU** | US-035, US-036, US-037, US-069, US-070 |
| **Depende de** | **Change 08** (items del carrito para convertir) y **Change 06** (direcciones de entrega) |
| **Complejidad** | 🟡 Media |

**Entregables:**
- Módulo `pedidos/`: endpoint `POST /api/v1/pedidos`
- Validación de stock atómica con rollback en conflicto
- `precio_snapshot` (decimal) y `direccion_snapshot` (JSON) en detalles
- Personalización como `INTEGER[]` de ingredientes excluidos
- Primer registro en `historial_estados_pedido` (PENDIENTE)

---

## Change 09b: `checkout-frontend`

| Campo | Valor |
|---|---|
| **Funcionalidad** | Flujo UI de checkout: selección de dirección, resumen del pedido, confirmación, pantalla post-creación y vaciado automático del carrito |
| **HU** | US-038, US-071 |
| **Depende de** | **Change 09a** (endpoint de creación operativo) |
| **Complejidad** | 🟢 Baja |

**Entregables:**
- Flujo de checkout: selección de dirección → resumen → confirmación
- Validación pre-checkout (disponibilidad, precios actuales)
- Pantalla de confirmación post-creación con número de pedido
- Vaciado automático del cartStore

---

## Change 10: `pagos-mercadopago`

| Campo | Valor |
|---|---|
| **Funcionalidad** | Integración completa con MercadoPago: creación de órdenes de pago, procesamiento de webhooks IPN con idempotencia, consulta de estado, reintento de pagos rechazados, SDK React para tokenización PCI |
| **HU** | US-045, US-046, US-047, US-048, US-072 |
| **Depende de** | **Change 09a** (pedidos en estado PENDIENTE para poder pagarlos) |
| **Complejidad** | 🔴 Alta |

**Nota:** Este es el único change que permanece 🔴 — involucra un dominio externo (SDK de MercadoPago, webhooks asíncronos, idempotencia) que no se beneficia de ser partido porque backend y frontend están fuertemente acoplados por el flujo de pago.

**Entregables:**

*Backend:*
- Módulo `pagos/`: crear orden MP, webhook IPN, consulta de estado
- `idempotency_key` UUID por pago
- Estados: approved, rejected, pending, in_process, cancelled

*Frontend:*
- `paymentStore` integrado con SDK `@mercadopago/sdk-react`
- CardPayment embebido (tokenización PCI SAQ-A)
- Páginas de retorno: success, failure, pending
- Opción de reintento en pagos rechazados

---

## Change 11a: `fsm-backend`

| Campo | Valor |
|---|---|
| **Funcionalidad** | Máquina de estados del pedido en la capa de servicio: mapa de transiciones válidas, transición automática PENDIENTE→CONFIRMADO (webhook), transiciones manuales, cancelación con restauración de stock, decremento atómico, historial append-only |
| **HU** | US-039, US-040, US-041, US-042, US-043, US-044 |
| **Depende de** | **Change 09a** (pedidos en PENDIENTE) y **Change 10** (webhook de pago aprobado dispara la transición) |
| **Complejidad** | 🟡 Media |

**Entregables:**
- FSM en `pedidos/service.py`: mapa de transiciones válidas
- Transición automática PENDIENTE→CONFIRMADO + decremento stock
- Transiciones manuales: CONFIRMADO→EN_PREP→EN_CAMINO→ENTREGADO
- Cancelación con restauración de stock (si confirmado)
- Historial append-only (solo INSERT, nunca UPDATE/DELETE)
- Endpoints de listado por rol y detalle con historial

---

## Change 11b: `visualizacion-pedidos`

| Campo | Valor |
|---|---|
| **Funcionalidad** | Paneles de visualización de pedidos para todos los roles: cliente ve sus pedidos, gestor ve todos y puede avanzar estados, timeline visual del historial |
| **HU** | US-049, US-050, US-051, US-052 |
| **Depende de** | **Change 11a** (FSM y endpoints de listado operativos) |
| **Complejidad** | 🟡 Media |

**Entregables:**
- Panel del cliente: "Mis pedidos" con filtros y detalle
- Panel del gestor: todos los pedidos con acciones de avance de estado
- Timeline visual del historial de estados
- Badge de estado con colores por estado

---

## Change 12: `admin-usuarios-y-catalogo`

| Campo | Valor |
|---|---|
| **Funcionalidad** | Panel de administración de usuarios (listar, editar roles, desactivar) y acceso Admin a gestión de catálogo y pedidos |
| **HU** | US-053, US-054, US-055, US-064, US-065 |
| **Depende de** | **Change 11a** |
| **Complejidad** | 🟡 Media |

**Entregables:**

*Backend:*
- Módulo `admin/usuarios`: listar, editar, desactivar, asignar roles
- Admin no puede quitarse el último rol ADMIN
- Invalidación de refresh tokens al cambiar rol/desactivar

*Frontend:*
- Tabla de usuarios con búsqueda y filtro por rol
- Modal de edición de usuario y asignación de roles

---

## Change 13: `dashboard-metricas`

| Campo | Valor |
|---|---|
| **Funcionalidad** | Dashboard de administración con KPIs, gráficos de ventas, ranking de productos, distribución de pedidos por estado, y configuración del sistema |
| **HU** | US-056, US-057, US-058, US-059, US-060 |
| **Depende de** | **Change 11a** |
| **Complejidad** | 🟡 Media |

**Entregables:**

*Backend:*
- Módulo `admin/metricas`: resumen general, ventas por período, top productos, pedidos por estado
- Queries con `SUM`, `COUNT`, `GROUP BY`, `DATE_TRUNC`
- Módulo `admin/configuracion`: tabla key-value

*Frontend:*
- Dashboard con KPIs: total ventas, pedidos, usuarios
- `LineChart` de evolución de ventas (recharts)
- `BarChart` de productos más vendidos
- `PieChart` de distribución por estado
- Panel de configuración (key-value)

---

## Notas de Implementación

> [!IMPORTANT]
> **Cada change debe archivarse antes de empezar el siguiente** que dependa de él.

> [!TIP]
> **Aprovechar los paralelizables**: 03b, 04 y 06 se pueden trabajar en paralelo una vez archivado 03a. Lo mismo con 11b, 12 y 13 una vez archivado 11a.

> [!WARNING]
> **Change 09a** sigue siendo el más riesgoso técnicamente — primera prueba real del Unit of Work con transacciones atómicas multi-tabla. Invertir tiempo extra en el diseño.

> [!NOTE]
> **Change 10** es el único 🔴 restante por decisión deliberada — MercadoPago es un dominio externo con SDK propio, webhooks asíncronos e idempotencia, que no se beneficia de partirse en backend/frontend separados.

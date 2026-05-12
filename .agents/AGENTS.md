# Protocolo de Colaboración — Food Store

Este documento define las reglas de comportamiento, el rol del agente, el contexto del stack tecnológico, los patrones de arquitectura y las skills disponibles para el proyecto **Food Store** — un e-commerce full-stack para gestión de pedidos de comida.

---

## 1. Rol del Agente

Actúa como un **Senior Tech Lead y Arquitecto de Software** con enfoque en Spec-Driven Development. Tu misión es garantizar que cada línea de código e incremento del sistema sea 100% fiel a la documentación técnica definida en `docs/`.

---

## 2. Reglas Críticas de Comportamiento

> [!IMPORTANT]
> **Usar subagentes (MANDATORIO):** Siempre que se trabaje en el repo (investigar, analizar, escribir código, refactors, generar docs, ejecutar comandos) se DEBEN usar subagentes. Este agente principal actúa como **orquestador/coordinador**: define el plan, delega y revisa. La única excepción: preguntas de clarificación y comandos mínimos de estado (`openspec list`, `git status`).

> [!IMPORTANT]
> **Spec-Driven Development (OPSX):** Antes de implementar código, se debe tener un change con sus artefactos (proposal, design, tasks) aprobados. Ejecutar `openspec list --json` antes de escribir código.

> [!IMPORTANT]
> **Memoria Persistente (Engram):** Al completar cualquier tarea significativa, el agente DEBE guardar en Engram con `mem_save`. Al iniciar sesión, DEBE ejecutar `mem_context` y `mem_search` para recuperar contexto previo.

### Reglas de Negocio

- **Trazabilidad:** Toda sugerencia debe alinearse con las Historias de Usuario (US-000 a US-076) y Reglas de Negocio (RN-XX) de `docs/Historias_de_usuario.txt`.
- **Seguridad:** Priorizar siempre `get_current_user` y `require_role` con JWT, y hashing con bcrypt en todo diseño de autenticación.
- **Atomicidad:** Las operaciones multi-tabla DEBEN usar el patrón Unit of Work para garantizar transacciones atómicas.
- **Inmutabilidad:** Los pedidos SIEMPRE usan snapshots de precios y direcciones. Nunca referenciar datos mutables directamente.
- **Errores RFC 7807:** Todos los errores de la API siguen el estándar Problem Details (`type`, `title`, `status`, `detail`, `instance`).
- **Soft Delete:** Nunca borrar registros físicamente (excepto refresh tokens expirados). Usar el campo `eliminado_en`.
- **PCI Compliance:** Los datos de tarjetas NUNCA pasan por el servidor. La tokenización ocurre en el browser vía SDK de MercadoPago.

### Convenciones de Código

#### Backend

- Cada módulo sigue la estructura: `model.py · schemas.py · repository.py · service.py · router.py`
- El `router.py` usa `response_model` explícito en todos los endpoints
- El `service.py` lanza `HTTPException` — nunca el router ni el repository
- Las migraciones van en `alembic/versions/` — nunca modificar tablas directamente
- Rate limiting en endpoints críticos con `slowapi` (ej: login: 5 intentos / 15 min)
- Contraseñas hasheadas con bcrypt (cost factor ≥ 12)
- Refresh tokens almacenados en BD para soporte de invalidación

#### Frontend

- FSD estricto: imports solo fluyen hacia abajo — `Pages → Features → Entities → Shared`
- Estado del servidor exclusivamente con **TanStack Query** (no duplicar en Zustand)
- Estado del cliente (carrito, sesión, UI, pagos) con **Zustand stores** tipados
- HTTP con Axios + interceptor JWT (attach + refresh automático)
- Formularios con **TanStack Form** (no react-hook-form)
- Gráficos del dashboard con **recharts**
- Tokenización de tarjetas con `@mercadopago/sdk-react` — nunca manejar datos de tarjeta en frontend raw

#### General

- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.) — sin co-authored-by ni atribución a IA
- Variables de entorno: usar `.env.example` como referencia — nunca commitear `.env`
- No buildear después de cambios (el equipo corre el build cuando corresponde)

---

## 3. Stack Tecnológico

### Backend

| Tecnología | Uso |
|---|---|
| **Python 3.12+** | Lenguaje principal |
| **FastAPI** | Framework web (ASGI, async, OpenAPI automático) |
| **SQLModel** | ORM (combina SQLAlchemy + Pydantic) |
| **PostgreSQL** | Base de datos relacional |
| **Alembic** | Migraciones de base de datos |
| **Passlib + bcrypt** | Hashing de contraseñas (pin: `bcrypt==4.0.1`) |
| **python-jose** | Generación/verificación de JWT (HS256) |
| **slowapi** | Rate limiting en endpoints sensibles |
| **Pydantic v2 + BaseSettings** | Validación de datos y configuración |
| **MercadoPago SDK** | Integración de pagos |
| **uvicorn** | Servidor ASGI |

### Frontend

| Tecnología | Uso |
|---|---|
| **React 18+** | Librería UI |
| **TypeScript** | Tipado estricto (`strict: true`) |
| **Vite** | Bundler y dev server |
| **Tailwind CSS** | Framework de estilos (utilidades) |
| **Zustand** | Estado del cliente (4 stores: auth, cart, payment, ui) |
| **TanStack Query** | Estado del servidor (cache, fetching, sync) |
| **TanStack Form** | Gestión de formularios |
| **Axios** | Cliente HTTP con interceptores JWT |
| **React Router** | Navegación SPA |
| **recharts** | Gráficos del dashboard |
| **MercadoPago.js** | Tokenización PCI SAQ-A en browser |

### Herramientas

| Herramienta | Uso |
|---|---|
| **OPSX (openspec CLI)** | Spec-Driven Development workflow |
| **Engram** | Memoria persistente para agentes de IA |
| **Git** | Control de versiones con conventional commits |

---

## 4. Arquitectura

### Backend — Capas (flujo unidireccional, no puede invertirse)

```
Request HTTP → Router → Service → Unit of Work → Repository → Model → PostgreSQL
```

- **Router:** Recibe HTTP, valida con Pydantic, delega al Service. Sin lógica de negocio.
- **Service:** Lógica de negocio stateless. Coordina repositories vía UoW. Lanza `HTTPException`.
- **Unit of Work (UoW):** Context manager async. Commit en éxito, rollback en error. Expone repos como atributos.
- **Repository:** Acceso a datos. `BaseRepository[T]` genérico + repos especializados. Sin lógica de negocio.
- **Model:** Clases SQLModel que mapean a tablas PostgreSQL. Sin imports de capas superiores.

### Backend — Estructura (feature-first)

```
backend/
├── app/
│   ├── core/          # config, database, security, uow, exceptions
│   ├── modules/
│   │   ├── auth/      # login, register, refresh, logout
│   │   ├── usuarios/  # CRUD, roles
│   │   ├── direcciones/
│   │   ├── categorias/
│   │   ├── ingredientes/
│   │   ├── productos/
│   │   ├── pedidos/   # creación, FSM, historial
│   │   ├── pagos/     # MercadoPago, webhooks
│   │   └── admin/     # métricas, configuración
│   └── db/
│       ├── seed.py
│       └── base.py
├── alembic/
├── main.py
└── requirements.txt
```

### Frontend — Feature-Sliced Design (FSD)

```
frontend/src/
├── app/        # Providers, routing, estilos globales
├── pages/      # Páginas (1 por ruta)
├── widgets/    # Bloques de UI compuestos
├── features/   # Interacciones: "agregar al carrito", "filtrar", "pagar"
├── entities/   # Modelos de dominio + API base
└── shared/     # UI genérica, Axios, stores, tipos, utils
```

### Base de Datos — ERD v5 (16 tablas, 3 dominios)

| Dominio | Tablas |
|---|---|
| **Identidad y Acceso** | usuarios, roles, usuarios_roles, refresh_tokens, direcciones_entrega |
| **Catálogo** | categorias, productos, ingredientes, productos_categorias, productos_ingredientes, formas_pago |
| **Ventas/Pagos/Trazabilidad** | estados_pedido, pedidos, detalles_pedido, historial_estados_pedido, pagos |

---

## 5. Patrones Clave

| Patrón | Dónde se aplica | Descripción |
|---|---|---|
| **Unit of Work** | Creación de pedidos, transacciones multi-tabla | Commit/rollback atómico via context manager |
| **Repository** | Toda entidad | `BaseRepository[T]` con CRUD + soft delete automático |
| **Snapshot** | `precio_snapshot`, `direccion_snapshot` en pedidos | Copia inmutable de datos al momento de crear el pedido |
| **Soft Delete** | Usuarios, categorías, productos, ingredientes, direcciones, pedidos | Campo `eliminado_en` en lugar de DELETE físico |
| **Audit Trail** | `historial_estados_pedido` | Append-only: solo INSERT, nunca UPDATE ni DELETE |
| **FSM** | Estado del pedido (6 estados) | Transiciones estrictas validadas en capa de servicio |
| **Idempotencia** | Webhooks de MercadoPago | `idempotency_key` previene procesamiento duplicado |
| **FSD** | Frontend | Capas horizontales con dependencia unidireccional |

### Máquina de Estados del Pedido (FSM)

```
PENDIENTE ──(pago aprobado)──→ CONFIRMADO ──→ EN_PREPARACIÓN ──→ EN_CAMINO ──→ ENTREGADO
    │                              │                │
    └──────── CANCELADO ←──────────┘────────────────┘
```

- `PENDIENTE → CONFIRMADO`: Automática (webhook pago aprobado) + decremento stock
- `CONFIRMADO → EN_PREPARACIÓN → EN_CAMINO → ENTREGADO`: Manual (Gestor de Pedidos)
- Cancelación restaura stock si el pedido ya fue confirmado
- `ENTREGADO` y `CANCELADO` son estados terminales

---

## 6. Skills Disponibles

Las skills están instaladas en `.agents/skills/`. Leer el `SKILL.md` correspondiente **antes** de generar código. Múltiples skills pueden aplicar simultáneamente.

| Contexto de activación | Skill | Archivo |
|---|---|---|
| Endpoints FastAPI, service, repository, schema Pydantic, UoW, router | `fastapi-expert` | `skills/fastapi-expert/SKILL.md` |
| Scaffolding de proyectos FastAPI nuevos desde cero | `fastapi-templates` | `skills/fastapi-templates/SKILL.md` |
| Queries SQL, migraciones Alembic, optimización PostgreSQL, índices | `supabase-postgres-best-practices` | `skills/supabase-postgres-best-practices/SKILL.md` |
| Componentes React, páginas, hooks, Tailwind, estilo visual del frontend | `ui-ux-pro-max` | `skills/ui-ux-pro-max/SKILL.md` |
| Design system, tokens, componentes Tailwind reutilizables | `tailwind-design-system` | `skills/tailwind-design-system/SKILL.md` |
| Páginas CRUD del dashboard (tabla + modal + delete + paginación) | `dashboard-crud-page` | `skills/dashboard-crud-page/SKILL.md` |
| Implementación segura de JWT: creación, validación, rotación de tokens | `jwt-security` | `skills/jwt-security/SKILL.md` |
| Integración MercadoPago: checkout, estado de pagos, mock adapters | `mercadopago-integration` | `skills/mercadopago-integration/SKILL.md` |
| Tests E2E con Playwright: automatización de browser, testing de flujos | `playwright-cli` | `skills/playwright-cli/SKILL.md` |
| Performance en React: re-renders, bundles, async, server components | `vercel-react-best-practices` | `skills/vercel-react-best-practices/SKILL.md` |
| El usuario pregunta qué skill usar o si existe una skill para X | `find-skills` | `skills/find-skills/SKILL.md` |

---

## 7. Flujo OPSX (Spec-Driven Development)

```
/opsx:explore  →  /opsx:propose  →  /opsx:apply  →  /opsx:archive
```

- Los cambios activos están en `openspec/changes/<nombre>/`
- La config del proyecto está en `openspec/config.yaml`
- Antes de implementar cualquier feature nueva, verificar con `openspec list --json`

### Sync de docs al archivar

Cada vez que se complete el archivado de un change, además de ejecutar el comando OPSX, actualizar `docs/mapa_de_changes.md` marcando el change como completado con la fecha.

---

## 8. Mapa de Changes

El proyecto se divide en **18 changes incrementales** (Opción B: solo los 🔴 se parten en backend/frontend) que cubren 77 historias de usuario (US-000 a US-076). Ver detalle completo en `docs/mapa_de_changes.md`.

| # | Change | Estado | Complejidad | Depende de |
|---|---|---|---|---|
| 01 | `setup-backend-core` | ✅ Archivado (2026-04-28) | — | — |
| 02 | `setup-frontend-core` | ✅ Archivado (2026-05-06) | — | — |
| 03a | `auth-backend` | 🔲 Pendiente | 🟡 Media | 01 |
| 03b | `auth-frontend` | 🔲 Pendiente | 🟡 Media | 02, 03a |
| 04 | `categorias-e-ingredientes` | 🔲 Pendiente | 🟡 Media | 03a |
| 05 | `navegacion-layout-base` | 🔲 Pendiente | 🟡 Media | 02, 03b |
| 06 | `perfil-y-direcciones` | 🔲 Pendiente | 🟡 Media | 03a |
| 07a | `productos-crud-backend` | 🔲 Pendiente | 🟡 Media | 04 |
| 07b | `catalogo-publico` | 🔲 Pendiente | 🟡 Media | 07a, 05 |
| 07c | `gestion-productos-stock` | 🔲 Pendiente | 🟢 Baja | 07a |
| 08 | `carrito-de-compras` | 🔲 Pendiente | 🟢 Baja | 06, 07b |
| 09a | `pedidos-backend` | 🔲 Pendiente | 🟡 Media | 06, 08 |
| 09b | `checkout-frontend` | 🔲 Pendiente | 🟢 Baja | 09a |
| 10 | `pagos-mercadopago` | 🔲 Pendiente | 🔴 Alta | 09a |
| 11a | `fsm-backend` | 🔲 Pendiente | 🟡 Media | 09a, 10 |
| 11b | `visualizacion-pedidos` | 🔲 Pendiente | 🟡 Media | 11a |
| 12 | `admin-usuarios-y-catalogo` | 🔲 Pendiente | 🟡 Media | 11a |
| 13 | `dashboard-metricas` | 🔲 Pendiente | 🟡 Media | 11a |

### Ruta Crítica

```
01 → 03a → 04 → 07a → 07b → 08 → 09a → 10 → 11a → 12/13
```

### Paralelizables

- **03b, 04, 06** — En paralelo una vez archivado 03a
- **05** — En paralelo con 04/06 una vez archivado 03b
- **07b y 07c** — En paralelo una vez archivado 07a
- **09b** — En paralelo con 10 una vez archivado 09a
- **11b, 12, 13** — Los tres en paralelo una vez archivado 11a

---

## 9. Gotchas y Descubrimientos Previos

| Problema | Solución |
|---|---|
| `passlib 1.7.4` incompatible con `bcrypt >= 4.1` | Pin `bcrypt==4.0.1` en requirements.txt |
| `CREATE DATABASE` falla dentro de transacciones psql | Usar `createdb` standalone en lugar de `psql -c` |
| SQLAlchemy necesita TODOS los modelos importados | Importar todos los modelos antes de resolver `Relationship()` cross-module |
| `UsuarioRol` con 2 FKs a `usuarios` | Requiere `foreign_keys` explícito en la Relationship del lado inverso |
| `HistorialEstadoPedido` FK ambiguo a `usuarios` | También necesita `foreign_keys` explícito |
| Tailwind CSS v4 causa errores de build en Vite | Usar Tailwind v3; v4 requiere `@tailwindcss/postcss` que puede no ser compatible |
| `npx skills` falla si SKILL.md no está en raíz del repo | Clonar manualmente y copiar la subcarpeta + actualizar `skills-lock.json` |

---

## 10. Instrucciones de Arranque para el Agente

Cuando el usuario inicie una nueva sesión de trabajo:

1. **Recuperar contexto:** Ejecutar `mem_context` y `mem_search(query: "food store opsx", project: "RepositorioBaseFoodStore-SDD")` en Engram para recuperar decisiones previas.
2. **Verificar estado OPSX:** Ejecutar `openspec list --json` para ver qué changes existen y su estado.
3. **Leer este archivo:** Usar este AGENTS.md como referencia del stack, patrones y prioridades.
4. **Consultar documentación:** Los docs del proyecto están en `docs/`:
   - `Integrador.txt` — Spec técnica SDD v5.0 completa (ERD v5, FSM, API REST, schemas Pydantic, rúbrica)
   - `Descripcion.txt` — Descripción integral del sistema (15 secciones)
   - `Historias_de_usuario.txt` — 77 HU con criterios de aceptación y reglas de negocio
   - `mapa_de_changes.md` — Grafo de dependencias y detalle de cada change
5. **Identificar el siguiente change:** Consultar la tabla de la sección 8 para determinar qué sigue.
6. **Cargar skills relevantes:** Antes de implementar, leer los SKILL.md de las skills que apliquen a la tarea.

---

## 11. Engram — Git Sync (memorias compartidas)

Las memorias se comparten entre colaboradores mediante chunks comprimidos en `.engram/chunks/`.

### Protocolo post-pull (MANDATORIO)

El plugin de Engram ejecuta `engram sync --import` **solo al inicio de sesión**. Si se hace `git pull` después, los chunks nuevos NO se cargan automáticamente.

**Siempre que hagas `git pull`, ejecutá inmediatamente:**

```bash
engram sync --import
```

### Verificar estado de sync

```bash
engram sync --status
```

### Protocolo de cierre de sesión (AUTOMÁTICO)

Cuando el usuario diga "cerrar sesión", "terminar", "done", "listo" o similar, ejecutar **ANTES** de llamar a `mem_session_summary`:

```bash
# 1. Exportar memorias nuevas como chunks
engram sync

# 2. Stagear TODO: código + engram + archivos pendientes
git add -A

# 3. Verificar qué entra al commit
git status

# 4. Commitear todo junto
git commit -m "chore: end session — sync engram memories and pending changes"

# 5. Pushear al remoto
git push
```

### Fallback si el push falla

1. Informar al usuario el error
2. NO cerrar la sesión en Engram todavía
3. Esperar indicaciones del usuario

---

## 12. Configuración del Entorno

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Configurar variables
alembic upgrade head
python -m app.db.seed
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env  # Configurar VITE_API_BASE_URL
npm run dev  # Puerto 5173
```

### Base de Datos

- **Motor:** PostgreSQL
- **Usuario:** `foodstore_user`
- **Base:** `foodstore`
- **Connection string:** `postgresql+asyncpg://foodstore_user:<password>@localhost:5432/foodstore`

---

## 13. MCPs Configurados

| MCP | Uso |
|-----|-----|
| `engram` | Memoria persistente entre sesiones — `mem_save`, `mem_search`, `mem_context`, `mem_session_summary` |
| `github` | Operaciones sobre GitHub: repos, issues, PRs, branches, commits |
| `context7` | Documentación actualizada de librerías y frameworks (FastAPI, React, SQLModel, Tailwind, etc.) |
| `devdocs-mcp` | Lookup de documentación técnica offline (fallback local) |

Configuración según el agente en uso:
- **Antigravity (Gemini):** `~/.gemini/antigravity/mcp_config.json`
- **OpenCode:** `.opencode/opencode.json`

---

## 14. Evaluación

El proyecto se evalúa sobre **200 puntos** con bonificaciones:

- **+10 puntos** por tests unitarios/integración
- **+10 puntos** por deploy en producción
- **-30%** si el sistema no compila o no corre

Los criterios de entrega (CE-01 a CE-14) están detallados en `docs/Descripcion.txt`, sección 15.

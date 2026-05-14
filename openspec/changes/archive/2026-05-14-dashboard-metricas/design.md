## Context

El admin router ya existe (de Change 12) montado en `/api/v1/admin` con endpoints de usuarios. El DashboardPage actual es un placeholder. No existe `recharts` instalado. No existe tabla de configuración del sistema. Las tablas de negocio (pedidos, detalles_pedido, productos, usuarios) tienen todos los datos necesarios para las métricas.

## Goals / Non-Goals

**Goals:**
- Endpoints de dashboard: resumen KPIs, ventas por mes, top productos, pedidos por estado
- Endpoints de configuración: GET/PUT clave-valor
- Dashboard frontend con cards KPIs, 3 charts (líneas, barras, torta) y panel de configuración
- Instalar recharts como dependencia

**Non-Goals:**
- Métricas en tiempo real (web sockets) — fuera de alcance
- Exportación de reportes (PDF/CSV) — fuera de alcance
- Dashboard por roles (es el mismo para ADMIN/STOCK/PEDIDOS) — fuera de alcance

## Decisions

### 1. Queries de métricas en PedidoRepository (no en service separado)
**Decisión**: Agregar métodos de agregación en `PedidoRepository` (`get_ventas_por_mes`, `get_top_productos`, `get_pedidos_por_estado`, `get_resumen_kpis`).
**Alternativa**: Hacer queries raw SQL en el service de dashboard.
**Razón**: Consistente con el patrón del proyecto (toda la lógica de datos va en repositories). Los métodos devuelven resultados planos (dicts/listas), no modelos SQLModel. SQLAlchemy `select` con `func.sum`, `func.count`, `func.date_trunc` es suficiente.

### 2. Configuración como tabla key-value
**Decisión**: Crear modelo `Configuracion` (clave: `codigo` PK string, `valor` string, `descripcion` opcional, `actualizado_en` timestamp) en módulo admin.
**Alternativa**: Archivo JSON, variables de entorno, tabla separada.
**Razón**: BD asegura persistencia, consistencia transaccional y acceso concurrente. Es el approach estándar para configuración dinámica en sistemas web.

### 3. Recharts como librería de charts
**Decisión**: Instalar y usar `recharts` para todos los gráficos.
**Alternativa**: Chart.js, D3.js, Tremor,构建 propia con SVG.
**Razón**: Recharts es la librería más usada con React, API declarativa, buena documentación, soporte para los 3 tipos de chart necesarios. Más ligera que D3 y más madura que Tremor.

### 4. Dashboard en página única con secciones
**Decisión**: KPIs arriba (cards en grid 2x2), charts debajo (LineChart izquierda, PieChart derecha, BarChart ancho completo abajo), configuración en sección separada con acordeón/pestaña.
**Alternativa**: Múltiples páginas / tabs de navegación.
**Razón**: Un dashboard de administración debe mostrar toda la información de un vistazo. Configuración va separada porque es un concern diferente (no métricas).

### 5. Endpoints de dashboard en el router admin existente
**Decisión**: Agregar los endpoints de dashboard al `admin/router.py` existente (no crear sub-router separado).
**Alternativa**: Crear `admin/dashboard/router.py` separado.
**Razón**: Menos archivos, el router admin ya está montado, los endpoints comparten el mismo prefijo `/admin`. La separación en service es suficiente.

## Risks / Trade-offs

- **[Rendimiento]** Las queries de agregación sobre `pedidos` pueden ser lentas con muchos registros → mitigado: se agregan índices en `creado_en` y `estado_codigo`
- **[Precisión]** Las ventas incluyen pedidos cancelados si no se filtran → mitigado: las queries excluyen `CANCELADO` de métricas de ingresos
- **[Configuración]** Sin validación de tipos en valores de configuración (todo string) → mitigado: responsabilidad del frontend parsear/validar antes de enviar
- **[Charts]** Recharts puede tener problemas de renderizado en SSR o hidratación → mitigado: como es SPA con Vite, no hay SSR involucrado

## Context

Food Store necesita un carrito de compras client-side para que los clientes puedan armar su pedido antes del checkout. Actualmente el catálogo público (`/catalogo`) y el detalle de producto (`/producto/:id`) están implementados, pero no hay forma de acumular productos.

El carrito es exclusivamente client-side (Zustand + localStorage) por decisión arquitectónica (RN-CR01). Esto elimina la necesidad de endpoints backend y sincronización de sesión, pero impone que el estado sobreviva solo en el navegador del cliente.

El proyecto ya tiene:
- `cartStore` esbozado en `client-state/spec.md` con acciones básicas
- Zustand y middleware `persist` en el stack
- Estructura FSD con stores en `shared/stores/` y tipos en `shared/types/`
- Catálogo público con cuadrícula de productos y detalle funcionales

Los specs existentes de `client-state` ya definen escenarios para `cartStore` (addItem, updateQuantity, removeItem, clearCart). Este cambio los enriquece con personalización (exclusión de ingredientes) y agrega la capa de UI.

## Goals / Non-Goals

**Goals:**
- Implementar `cartStore` completo con Zustand + persistencia localStorage
- Botón "Agregar al carrito" en tarjetas del catálogo y página de detalle
- Personalización de producto al agregar (excluir ingredientes removibles)
- CartDrawer (panel lateral) con resumen rápido del carrito
- CartPage (`/carrito`) con vista completa: items, cantidades, exclusiones, totales
- Confirmación modal para vaciar carrito
- Badge de cantidad de items en el navbar/header

**Non-Goals:**
- Sincronización del carrito con el backend (el carrito NO existe en backend)
- Carrito persistente entre dispositivos (es por navegador)
- Validación de stock contra backend al agregar (se validará al crear pedido en change 09a)
- Cálculo de envío, impuestos o descuentos
- Integración con MercadoPago o checkout (changes posteriores)

## Decisions

### 1. CartStore como store único de Zustand con persist
- **Decisión**: Un solo store `cartStore` en `shared/stores/` con middleware `persist` apuntando a `localStorage`
- **Razón**: El carrito es un dominio pequeño y cohesivo. Un solo store evita la complejidad de stores anidados o contextos múltiples. El middleware `persist` ya está disponible en el proyecto y da persistencia automática.
- **Alternativa considerada**: Context + useReducer — descartado porque Zustand ya está establecido como estándar del proyecto (authStore, uiStore).

### 2. CartItem con exclusión de ingredientes como array de IDs
- **Decisión**: `CartItem` incluye `exclusiones: number[]` (IDs de ingredientes a excluir)
- **Razón**: Consistente con la regla RN-CR05 y el modelo del backend que espera `INTEGER[]`. Al crear el pedido (change 09a) se envía directamente.
- **Alternativa considerada**: Objeto `{ [ingredienteId]: boolean }` — más verboso sin beneficio real.

### 3. CartDrawer como widget lateral (slide-over)
- **Decisión**: `CartDrawer` implementado como widget FSD en `src/widgets/cart/`, renderizado como panel que se desliza desde la derecha
- **Razón**: El patrón drawer es estándar en e-commerce: permite ver el carrito sin abandonar la página actual. Es un widget porque es una pieza de UI autónoma que puede aparecer en múltiples páginas.
- **Alternativa considerada**: Modal — interrumpe el flujo de navegación; dropdown — espacio insuficiente para mostrar items con personalización.

### 4. CartPage en ruta `/carrito`
- **Decisión**: Página dedicada en `src/pages/cart/` con ruta `/carrito`
- **Razón**: Para revisión detallada del pedido antes de avanzar al checkout (change 09b). La vista completa con items, exclusiones y totales necesita más espacio que un drawer.
- **Alternativa considerada**: Solo drawer — insuficiente para la vista detallada que requiere US-033.

### 5. Botón "Agregar al carrito" en tarjetas del catálogo
- **Decisión**: Cada tarjeta de producto en el catálogo incluye un botón "Agregar" que agrega el producto con cantidad=1 y sin exclusiones. La personalización se hace desde la página de detalle.
- **Razón**: UX rápida — el cliente puede agregar productos directamente desde el grid. Para personalización (excluir ingredientes) necesita ir al detalle.
- **Alternativa considerada**: Solo desde el detalle — ralentiza el flujo de compra para productos sin personalización.

## Risks / Trade-offs

- [Riesgo] **LocalStorage puede ser borrado** → Mitigación: Es un comportamiento esperado. El carrito se pierde si el usuario borra datos del navegador. No hay alternativa sin backend.
- [Riesgo] **Producto eliminado/disponible entre sesiones** → Mitigación: Al crear el pedido (change 09a) se validará stock y disponibilidad contra backend. El carrito puede mostrar productos que ya no existen; se marcarán como "no disponible" en el resumen.
- [Trade-off] **Sin validación de stock en tiempo real** → El carrito no consulta stock al agregar. Esto es deliberado: el catálogo ya muestra `disponible` y el stock se valida al crear el pedido. Evita llamadas API innecesarias.
- [Riesgo] **Cantidad máxima por producto** → No se definió límite superior. Si hay riesgo de abuso, se puede agregar `maxCantidad` en el CartItem. Por ahora se deja sin límite.

## Why

Los clientes necesitan poder armar su pedido antes de confirmarlo. Actualmente el catálogo público permite ver productos, pero no hay forma de seleccionarlos, personalizarlos (excluir ingredientes) ni acumularlos para su compra. Sin carrito, el flujo de compra está incompleto y el sistema no puede avanzar hacia pedidos y pagos.

## What Changes

- Implementar `cartStore` con Zustand + persistencia en localStorage para el estado del carrito de compras del lado del cliente
- Agregar botón "Agregar al carrito" en la página de detalle de producto (`/producto/:id`) y en las tarjetas del catálogo (`/catalogo`)
- Permitir personalizar productos al agregarlos: excluir ingredientes (checkboxes sobre ingredientes removibles)
- Implementar `CartDrawer` (panel lateral deslizable) con resumen rápido del carrito, accesible desde el header de navegación
- Implementar `CartPage` (`/carrito`) con vista completa: listado de items, cantidades (+/-), exclusiones visibles, subtotales y total general
- Agregar acción de vaciar carrito con confirmación modal
- Sincronizar el badge de cantidad de items en el header de navegación con el `cartStore`

## Capabilities

### New Capabilities
- `shopping-cart-ui`: Componentes de UI del carrito: CartDrawer (panel lateral), CartPage (vista completa), CartSummary, selector de cantidad, exclusión de ingredientes, confirmación de vaciado, badge de items en navbar

### Modified Capabilities
- `client-state`: Enriquecer el `cartStore` existente (Zustand) con acciones de personalización (`exclusiones: number[]`), tipos `CartItem` con campos de personalización, y selectores derivados para subtotales y total

## Impact

- **Frontend — Nuevos archivos**: `src/pages/cart/`, `src/widgets/cart/`, `src/features/cart/`, `src/entities/cart/`
- **Frontend — Modificaciones**: `src/shared/stores/cartStore.ts` (enriquecer), `src/shared/types/cart.ts` (tipos), header/navbar (badge), router (`/carrito`)
- **Frontend — Catálogo**: Botón "Agregar al carrito" en tarjetas (`/catalogo`) y detalle (`/producto/:id`)
- **Backend**: Sin cambios — el carrito es client-side only (Zustand + localStorage), consistente con la regla RN-CR01
- **Dependencias externas**: Ninguna nueva — Zustand y middleware `persist` ya están en el proyecto

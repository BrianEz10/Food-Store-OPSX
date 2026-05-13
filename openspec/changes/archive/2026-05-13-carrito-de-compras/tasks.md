## 1. Tipos y Store

- [x] 1.1 Enriquecer `shared/types/cart.ts` con tipo `CartItem` (productoId, nombre, precio, cantidad, imagen, exclusiones, stockDisponible)
- [x] 1.2 Enriquecer `cartStore` en `shared/stores/cartStore.ts`: agregar `exclusiones: number[]` a los items, lógica de items separados por exclusiones distintas
- [x] 1.3 Agregar selectores derivados al `cartStore`: `total`, `subtotal(productoId)`, `itemCount`
- [x] 1.4 Agregar acción `addItem` con soporte para exclusiones (mismo producto + exclusiones diferentes = items separados)
- [x] 1.5 Verificar persistencia en localStorage con middleware `persist`

## 2. Integración con Catálogo y Detalle

- [x] 2.1 Agregar botón "Agregar" con ícono a las tarjetas de producto en el catálogo (`/catalogo`)
- [x] 2.2 Conectar botón del catálogo a `cartStore.addItem()` con cantidad=1
- [x] 2.3 Agregar sección de checkboxes de ingredientes removibles en la página de detalle (`/producto/:id`)
- [x] 2.4 Agregar botón "Agregar al carrito con selección de exclusiones" en el detalle
- [x] 2.5 Mostrar toast de confirmación "Producto agregado al carrito" al agregar

## 3. CartDrawer Widget

- [x] 3.1 Crear `src/widgets/cart/CartDrawer.tsx` con panel deslizable desde la derecha
- [x] 3.2 Renderizar lista de items del carrito dentro del drawer (imagen, nombre, cantidad, subtotal, exclusiones)
- [x] 3.3 Agregar controls de cantidad (+/-) y botón eliminar por item en el drawer
- [x] 3.4 Mostrar total general y botón "Ver carrito completo" → `/carrito`
- [x] 3.5 Manejar estado vacío: mensaje "Tu carrito está vacío" + botón "Ir al catálogo"
- [x] 3.6 Agregar animación de apertura/cierre y overlay de fondo

## 4. CartPage

- [x] 4.1 Crear `src/pages/cart/CartPage.tsx` con ruta `/carrito` en el router
- [x] 4.2 Renderizar lista completa de items con imagen, nombre, precio unitario, cantidad (+/-), exclusiones y subtotal
- [x] 4.3 Mostrar resumen con total general y botón "Proceder al checkout" (placeholder para change 09b)
- [x] 4.4 Agregar botón "Vaciar carrito" con modal de confirmación
- [x] 4.5 Manejar estado vacío con ilustración y botón "Explorar productos" → `/catalogo`
- [x] 4.6 Formatear precios con 2 decimales

## 5. Navegación y Polish

- [x] 5.1 Agregar badge de cantidad (`itemCount`) al icono de carrito en el header/navbar
- [x] 5.2 Ocultar badge cuando `itemCount === 0`
- [x] 5.3 Integrar `CartDrawer` en el layout principal para que sea accesible desde todas las páginas
- [x] 5.4 Registrar ruta `/carrito` en `app/router.tsx`
- [x] 5.5 Verificar flujo completo: catálogo → agregar → drawer → carrito → modificar cantidades → exclusiones → vaciar

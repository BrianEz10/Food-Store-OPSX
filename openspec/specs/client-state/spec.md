## Purpose
Definir la arquitectura de estado en el cliente (frontend) utilizando Zustand, asegurando la separación de dominios (auth, cart, payment, ui) y el comportamiento esperado ante recargas y cierres de sesión.
## Requirements
### Requirement: authStore — Estado de autenticación
El sistema SHALL proveer un store Zustand `authStore` que gestione el estado de autenticación del usuario. El store interactuará con Axios para acciones como el logout.

#### Scenario: Estado inicial
- **WHEN** la app inicia sin sesión previa
- **THEN** el authStore tiene: `accessToken: null`, `refreshToken: null`, `user: null`, `isAuthenticated: false`

#### Scenario: Login exitoso
- **WHEN** se invoca `setTokens(access, refresh)` y `setUser(user)`
- **THEN** el store actualiza los tokens, el usuario, y `isAuthenticated` se vuelve `true`

#### Scenario: Verificación de rol
- **WHEN** se invoca `hasRole('ADMIN')` y el usuario tiene rol ADMIN
- **THEN** retorna `true`

#### Scenario: Logout
- **WHEN** se invoca `logout()`
- **THEN** realiza opcionalmente la petición de logout al backend, todos los campos se resetean a su estado inicial y `isAuthenticated` se vuelve `false`.

#### Scenario: Inicialización de sesión al cargar app
- **WHEN** se invoca `initialize()` al iniciar la app
- **THEN** si hay tokens guardados (ej. en memoria o temporales antes del refresco automático), intenta recuperar el usuario.

### Requirement: cartStore — Estado del carrito

El sistema SHALL proveer un store Zustand `cartStore` con persistencia en localStorage para gestionar el carrito de compras, incluyendo personalización por exclusión de ingredientes.

#### Scenario: Agregar item
- **WHEN** se invoca `addItem(item)` con un producto nuevo
- **THEN** el item se agrega a la lista con `exclusiones: number[]` y `total` e `itemCount` se recalculan

#### Scenario: Agregar item existente
- **WHEN** se invoca `addItem(item)` con un producto que ya está en el carrito
- **THEN** la cantidad del item existente se incrementa (no se duplica), manteniendo las exclusiones originales del item existente

#### Scenario: Agregar item existente con exclusiones diferentes
- **WHEN** se invoca `addItem(item)` con el mismo producto pero diferentes `exclusiones`
- **THEN** se agrega como un item separado (mismo productoId, exclusiones diferentes = items diferentes)

#### Scenario: Modificar cantidad
- **WHEN** se invoca `updateQuantity(productId, quantity)` con cantidad > 0
- **THEN** la cantidad del item se actualiza y `total` se recalcula

#### Scenario: Modificar cantidad a 0
- **WHEN** se invoca `updateQuantity(productoId, 0)`
- **THEN** el item se elimina del carrito

#### Scenario: Eliminar item
- **WHEN** se invoca `removeItem(productId)`
- **THEN** el item se elimina del carrito y los totales se recalculan

#### Scenario: Vaciar carrito
- **WHEN** se invoca `clearCart()`
- **THEN** `items` se vacía, `total` y `itemCount` son 0

#### Scenario: Persistencia en localStorage
- **WHEN** se modifica el carrito y se recarga la página
- **THEN** el carrito se restaura desde localStorage con los mismos items, cantidades y exclusiones

#### Scenario: Cálculo de total
- **WHEN** se invoca el selector `total`
- **THEN** retorna la suma de `precio * cantidad` de todos los items, con 2 decimales de precisión

#### Scenario: Cálculo de subtotal por item
- **WHEN** se invoca el selector `subtotal(productId)`
- **THEN** retorna `precio * cantidad` del item específico

#### Scenario: Conteo de items
- **WHEN** se invoca el selector `itemCount`
- **THEN** retorna la suma total de cantidades de todos los items

### Requirement: CartItem — Tipo de datos del item del carrito

El sistema SHALL definir el tipo `CartItem` en `shared/types/cart.ts` con los campos necesarios para representar un producto en el carrito.

#### Scenario: Estructura de CartItem
- **WHEN** se inspecciona el tipo `CartItem`
- **THEN** contiene: `productoId: number`, `nombre: string`, `precio: number`, `cantidad: number`, `imagen: string`, `exclusiones: number[]` (IDs de ingredientes excluidos), y opcionalmente `maxCantidad?: number` y `stockDisponible?: boolean`

### Requirement: paymentStore — Estado de checkout
El sistema SHALL proveer un store Zustand `paymentStore` para gestionar el flujo de checkout/pagos.

#### Scenario: Estado inicial
- **WHEN** no hay checkout en progreso
- **THEN** `selectedPaymentMethod: null`, `checkoutStep: null`, `isProcessing: false`

#### Scenario: Avance de pasos
- **WHEN** se invoca `setCheckoutStep('address')`, luego `'summary'`, luego `'payment'`
- **THEN** el step se actualiza correctamente en cada invocación

#### Scenario: Reset
- **WHEN** se invoca `resetCheckout()`
- **THEN** todos los campos vuelven a su estado inicial

#### Scenario: Sin persistencia
- **WHEN** se recarga la página durante un checkout
- **THEN** el paymentStore está en estado inicial (el checkout se debe reiniciar)

### Requirement: uiStore — Estado de interfaz
El sistema SHALL proveer un store Zustand `uiStore` para gestionar el estado visual de la aplicación.

#### Scenario: Toggle sidebar
- **WHEN** se invoca `toggleSidebar()`
- **THEN** `sidebarOpen` se alterna entre `true` y `false`

#### Scenario: Gestión de toasts
- **WHEN** se invoca `addToast({ type: 'success', message: 'Guardado' })`
- **THEN** se agrega un toast con un `id` auto-generado (UUID) a la lista

#### Scenario: Eliminar toast
- **WHEN** se invoca `removeToast(id)`
- **THEN** el toast con ese ID se elimina de la lista

#### Scenario: Modal
- **WHEN** se invoca `openModal('confirm-delete')`
- **THEN** `activeModal` se setea a `'confirm-delete'`

#### Scenario: Cambio de tema
- **WHEN** se invoca `setTheme('dark')`
- **THEN** `theme` se actualiza a `'dark'` y se persiste en localStorage

### Requirement: uiStore — Aplicación del theme al DOM

El sistema SHALL aplicar el tema seleccionado (light/dark) al DOM añadiendo o removiendo la clase `dark` del elemento `<html>`.

#### Scenario: Aplicar tema dark

- **WHEN** `uiStore.theme` se setea a `'dark'`
- **THEN** la clase `dark` se agrega al `<html>` y el documento cambia a modo oscuro

#### Scenario: Aplicar tema light

- **WHEN** `uiStore.theme` se setea a `'light'`
- **THEN** la clase `dark` se remueve del `<html>` y el documento cambia a modo claro

#### Scenario: Tema system

- **WHEN** `uiStore.theme` se setea a `'system'`
- **THEN** se respeta `prefers-color-scheme` del sistema operativo

#### Scenario: Persistencia del theme

- **WHEN** el usuario selecciona un tema y recarga la página
- **THEN** el tema persistido en localStorage se restaura y se aplica al DOM antes del primer render (evita flash de estilo incorrecto)

### Requirement: uiStore — Estado de navegación

El sistema SHALL extender el uiStore para gestionar el estado de la navegación (sidebar colapsada en desktop).

#### Scenario: Sidebar colapsada por defecto

- **WHEN** la app se carga en desktop
- **THEN** `sidebarCollapsed` es `false` (sidebar expandida)

#### Scenario: Toggle sidebar collapse

- **WHEN** se invoca `toggleSidebarCollapse()`
- **THEN** `sidebarCollapsed` se alterna entre `true` y `false`

#### Scenario: Sin persistencia del colapso

- **WHEN** se recarga la página
- **THEN** `sidebarCollapsed` vuelve a `false` (no se persiste)

#### Scenario: Persistencia parcial del tema
- **WHEN** se recarga la página
- **THEN** el tema se restaura desde localStorage pero `sidebarOpen`, `toasts` y `activeModal` vuelven a sus defaults


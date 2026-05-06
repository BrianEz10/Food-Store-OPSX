## ADDED Requirements

### Requirement: authStore — Estado de autenticación
El sistema SHALL proveer un store Zustand `authStore` que gestione el estado de autenticación del usuario.

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
- **THEN** todos los campos se resetean a su estado inicial y `isAuthenticated` se vuelve `false`

#### Scenario: Sin persistencia localStorage
- **WHEN** se cierra y reabre el navegador
- **THEN** el authStore está en estado inicial (los tokens se restaurarán vía refresh token en Change 03)

### Requirement: cartStore — Estado del carrito
El sistema SHALL proveer un store Zustand `cartStore` con persistencia en localStorage para gestionar el carrito de compras.

#### Scenario: Agregar item
- **WHEN** se invoca `addItem(item)` con un producto nuevo
- **THEN** el item se agrega a la lista y `total` e `itemCount` se recalculan

#### Scenario: Agregar item existente
- **WHEN** se invoca `addItem(item)` con un producto que ya está en el carrito
- **THEN** la cantidad del item existente se incrementa (no se duplica)

#### Scenario: Modificar cantidad
- **WHEN** se invoca `updateQuantity(productId, quantity)` con cantidad > 0
- **THEN** la cantidad del item se actualiza y `total` se recalcula

#### Scenario: Eliminar item
- **WHEN** se invoca `removeItem(productId)`
- **THEN** el item se elimina del carrito y los totales se recalculan

#### Scenario: Vaciar carrito
- **WHEN** se invoca `clearCart()`
- **THEN** `items` se vacía, `total` y `itemCount` son 0

#### Scenario: Persistencia en localStorage
- **WHEN** se modifica el carrito y se recarga la página
- **THEN** el carrito se restaura desde localStorage con los mismos items y cantidades

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

#### Scenario: Persistencia parcial del tema
- **WHEN** se recarga la página
- **THEN** el tema se restaura desde localStorage pero `sidebarOpen`, `toasts` y `activeModal` vuelven a sus defaults

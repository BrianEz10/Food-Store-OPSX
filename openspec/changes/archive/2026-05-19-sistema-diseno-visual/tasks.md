## 1. Configure Design Tokens

- [x] 1.1 Update `tailwind.config.js` with the Vivid Modernity colors and font families.
- [x] 1.2 Import Google Fonts (`Outfit` and `Inter`) in `index.html` or `index.css`.
- [x] 1.3 Apply base radius utilities in global CSS if required.

## 2. Implement Base Layouts

- [x] 2.1 Create `MainLayout` component with lightweight Header and collapsible Aside.
- [x] 2.2 Update `app/router.tsx` to use the `MainLayout` wrapper for all appropriate pages (leaving Auth routes with a minimal layout).

## 3. Apply Tokens to Auth Pages

- [x] 3.1 Update `LoginPage` to use the new color and typography tokens.
- [x] 3.2 Update `RegisterPage` to use the new tokens.

## 4. Apply Tokens to Public/Client Pages

- [x] 4.1 Refactor `HomePage` to fit the design system.
- [x] 4.2 Update `CatalogPage` and `ProductCard` to use new radius and colors.
- [x] 4.3 Refactor `ProductDetailPage` and `CartDrawer`.
- [x] 4.4 Update `CheckoutPage` and `PedidoConfirmado` page.

## 5. Apply Tokens to User Pages

- [x] 5.1 Restyle `MisPedidosPage` and `PedidoDetailPage`.
- [x] 5.2 Restyle `ProfilePage` and `AddressesPage`.

## 6. Apply Tokens to Admin Pages

- [x] 6.1 Update `DashboardPage`.
- [x] 6.2 Update Admin list pages (`AdminPedidosPage`, `AdminProductosPage`, `AdminCategoriasPage`, `AdminUsuariosPage`).
- [x] 6.3 Update `ProductFormPage` to use 12px radius modals and appropriate form colors.

import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { HomePage } from '@/pages/home/HomePage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { UnauthorizedPage } from '@/pages/unauthorized/UnauthorizedPage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { RoleBasedRoute } from '@/shared/components/RoleBasedRoute';
import { CategoryListPage } from '@/pages/admin/categorias/CategoryListPage';
import { IngredientListPage } from '@/pages/admin/ingredientes/IngredientListPage';
import { ProductListPage, ProductFormPage } from '@/pages/admin/productos';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { AddressesPage } from '@/pages/addresses/AddressesPage';
import { CatalogPage } from '@/pages/catalogo/CatalogPage';
import { ProductDetailPage } from '@/pages/producto/ProductDetailPage';
import { CartPage } from '@/pages/cart/CartPage';
import { CheckoutPage } from '@/pages/checkout/CheckoutPage';
import { CheckoutSuccessPage } from '@/pages/checkout/CheckoutSuccessPage';
import { PagoPage } from '@/pages/pago/PagoPage';
import { PagoSuccessPage } from '@/pages/pago/PagoSuccessPage';
import { PagoFailurePage } from '@/pages/pago/PagoFailurePage';
import { PagoPendingPage } from '@/pages/pago/PagoPendingPage';
import { MisPedidosPage } from '@/pages/pedidos/MisPedidosPage';
import { PedidoDetailPage } from '@/pages/pedidos/PedidoDetailPage';
import { AdminPedidosPage } from '@/pages/admin/pedidos/AdminPedidosPage';
import { AdminUsuariosPage } from '@/pages/admin/usuarios/AdminUsuariosPage';
import { AppLayout } from '@/widgets/layout';
import { useAuthStore } from '@/shared/stores/auth-store';

function RootRedirect() {
  const user = useAuthStore((s) => s.user);
  const isStaff = user?.roles?.some((r) => ['ADMIN', 'STOCK', 'PEDIDOS'].includes(r));
  return isStaff ? <Navigate to="/dashboard" replace /> : <HomePage />;
}

export const AppRouter = () => {
  return (
    <Routes>
      {/* ── Public routes (no layout) ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Routes with AppLayout ── */}
      <Route element={<AppLayout />}>
        {/* Public home — redirect staff to dashboard */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public catalog */}
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/producto/:id" element={<ProductDetailPage />} />

        {/* Protected routes - any authenticated user */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-direcciones"
          element={
            <ProtectedRoute>
              <AddressesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/success/:id"
          element={
            <ProtectedRoute>
              <CheckoutSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pago/:pedidoId"
          element={
            <ProtectedRoute>
              <PagoPage />
            </ProtectedRoute>
          }
        />
        <Route path="/pago/success" element={<PagoSuccessPage />} />
        <Route path="/pago/failure" element={<PagoFailurePage />} />
        <Route path="/pago/pending" element={<PagoPendingPage />} />

        {/* Order visualization routes */}
        <Route
          path="/mis-pedidos"
          element={
            <ProtectedRoute>
              <MisPedidosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos/:id"
          element={
            <ProtectedRoute>
              <PedidoDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Role-based routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['ADMIN', 'STOCK', 'PEDIDOS']}>
                <DashboardPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['STOCK', 'ADMIN']}>
                <CategoryListPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ingredientes"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['STOCK', 'ADMIN']}>
                <IngredientListPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['STOCK', 'ADMIN']}>
                <ProductListPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/productos/nuevo"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['STOCK', 'ADMIN']}>
                <ProductFormPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['PEDIDOS', 'ADMIN']}>
                <AdminPedidosPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminUsuariosPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/productos/:productoId/editar"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['STOCK', 'ADMIN']}>
                <ProductFormPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ── Error routes ── */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

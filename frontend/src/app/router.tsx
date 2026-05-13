import { Routes, Route } from 'react-router-dom';
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
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { AddressesPage } from '@/pages/addresses/AddressesPage';
import { AppLayout } from '@/widgets/layout';

export const AppRouter = () => {
  return (
    <Routes>
      {/* ── Public routes (no layout) ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Routes with AppLayout ── */}
      <Route element={<AppLayout />}>
        {/* Public home */}
        <Route path="/" element={<HomePage />} />

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
      </Route>

      {/* ── Error routes ── */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

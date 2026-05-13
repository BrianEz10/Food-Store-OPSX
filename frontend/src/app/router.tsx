import { Routes, Route } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { RoleBasedRoute } from '@/shared/components/RoleBasedRoute';
import { CategoryListPage } from '@/pages/admin/categorias/CategoryListPage';
import { IngredientListPage } from '@/pages/admin/ingredientes/IngredientListPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { AddressesPage } from '@/pages/addresses/AddressesPage';

const PlaceholderHome = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50">
    <div className="text-center">
      <h1 className="text-4xl font-display font-bold text-primary-500 mb-4">
        Food Store
      </h1>
      <p className="text-lg text-slate-600 font-sans">
        Frontend Ready
      </p>
    </div>
  </div>
);

const PlaceholderDashboard = () => (
  <div className="min-h-screen flex items-center justify-center bg-blue-50">
    <div className="text-center">
      <h1 className="text-4xl font-display font-bold text-blue-600 mb-4">
        Dashboard
      </h1>
      <p className="text-lg text-slate-600 font-sans">
        Área administrativa
      </p>
    </div>
  </div>
);

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<PlaceholderHome />} />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN', 'STOCK', 'PEDIDOS']}>
              <PlaceholderDashboard />
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
    </Routes>
  );
};

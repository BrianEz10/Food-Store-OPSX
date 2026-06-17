import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/shared/Layout'
import { ProtectedRoute, RoleRoute } from '@/shared/ProtectedRoute'
import AdminLayout from '@/shared/AdminLayout'
import AdminDashboard from '@/pages/AdminDashboard'
import PedidosPage from '@/pages/admin/PedidosPage'
import ProductosPage from '@/pages/admin/ProductosPage'
import CategoriasPage from '@/pages/admin/CategoriasPage'
import IngredientesPage from '@/pages/admin/IngredientesPage'
import UsuariosPage from '@/pages/admin/UsuariosPage'
import CajeroPage from '@/pages/admin/CajeroPage'
import StoreHome from '@/features/productos/pages/StoreHome'
import DetalleProductoPage from '@/features/productos/pages/DetalleProductoPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import CartPage from '@/features/cart/pages/CartPage'
import CheckoutPage from '@/features/checkout/pages/CheckoutPage'
import PaymentPage from '@/features/checkout/pages/PaymentPage'
import PaymentResultPage from '@/features/checkout/pages/PaymentResultPage'
import OrdersPage from '@/features/orders/pages/OrdersPage'
import OrderDetailPage from '@/features/orders/pages/OrderDetailPage'
import NotFoundPage from '@/shared/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<StoreHome />} />
        <Route path="/product/:id" element={<DetalleProductoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/orders/:id/success" element={<PaymentResultPage />} />
          <Route path="/orders/:id/failure" element={<PaymentResultPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Route>
      </Route>
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<RoleRoute allowed={['admin']}><AdminDashboard /></RoleRoute>} />
          <Route path="dashboard" element={<RoleRoute allowed={['admin']}><AdminDashboard /></RoleRoute>} />
          <Route path="cocina" element={<RoleRoute allowed={['admin', 'cocina']}><PedidosPage /></RoleRoute>} />
          <Route path="productos" element={<RoleRoute allowed={['admin', 'stock']}><ProductosPage /></RoleRoute>} />
          <Route path="categorias" element={<RoleRoute allowed={['admin']}><CategoriasPage /></RoleRoute>} />
          <Route path="ingredientes" element={<RoleRoute allowed={['admin', 'stock']}><IngredientesPage /></RoleRoute>} />
          <Route path="usuarios" element={<RoleRoute allowed={['admin']}><UsuariosPage /></RoleRoute>} />
          <Route path="cajero" element={<RoleRoute allowed={['admin', 'cajero']}><CajeroPage /></RoleRoute>} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

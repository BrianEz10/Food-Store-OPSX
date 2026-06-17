import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/shared/Layout'
import { ProtectedRoute } from '@/shared/ProtectedRoute'
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
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="pedidos" element={<PedidosPage />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="ingredientes" element={<IngredientesPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="cajero" element={<CajeroPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

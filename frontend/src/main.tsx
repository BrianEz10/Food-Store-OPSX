import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom'
import { login } from './lib/auth'
import { useAuthStore } from './store/useAuthStore'
import AdminDashboard from './pages/AdminDashboard'
import PedidosPage from './pages/admin/PedidosPage'
import ProductosPage from './pages/admin/ProductosPage'
import CategoriasPage from './pages/admin/CategoriasPage'
import IngredientesPage from './pages/admin/IngredientesPage'
import UsuariosPage from './pages/admin/UsuariosPage'
import CajeroPage from './pages/admin/CajeroPage'
import './index.css'

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } })

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const rol = await login(email, password)
      window.location.href = rol === 'cliente' ? '/' : '/admin/dashboard'
    } catch {
      setError('Email o contraseña incorrectos')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#131407' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#e9c349', textAlign: 'center', marginBottom: 8 }}>Food Store</h1>
        <p style={{ color: '#c4c7c7', textAlign: 'center', marginBottom: 32, fontSize: 14 }}>Iniciá sesión para continuar</p>
        <div style={{ background: '#1f2111', padding: 32 }}>
          {error && <div style={{ background: '#93000a30', border: '1px solid #ffb4ab', padding: '8px 12px', marginBottom: 16 }}><p style={{ color: '#ffb4ab', fontSize: 13, margin: 0 }}>{error}</p></div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#c4c7c7', fontSize: 14, marginBottom: 4 }}>Email</label>
              <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} placeholder="admin@foodstore.com"
                style={{ width: '100%', padding: '10px 12px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#c4c7c7', fontSize: 14, marginBottom: 4 }}>Contraseña</label>
              <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '12px', background: loading ? '#2a2b1b' : '#121212', color: loading ? '#666' : '#c4c7c7', border: 'none', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function AdminLayout() {
  const { user, rol, logout } = useAuthStore()
  const allLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', roles: ['admin'] },
    { to: '/admin/pedidos', label: 'Pedidos', roles: ['admin', 'empleado'] },
    { to: '/admin/productos', label: 'Productos', roles: ['admin', 'stock'] },
    { to: '/admin/categorias', label: 'Categorías', roles: ['admin'] },
    { to: '/admin/ingredientes', label: 'Ingredientes', roles: ['admin', 'stock'] },
    { to: '/admin/usuarios', label: 'Usuarios', roles: ['admin'] },
    { to: '/admin/cajero', label: 'Cajero', roles: ['admin', 'cajero'] },
  ]
  const links = allLinks.filter((l) => l.roles.includes(rol || ''))
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#131407' }}>
      <aside style={{ width: 240, background: '#1b1d0e', borderRight: '1px solid #2a2b1b', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #2a2b1b' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#e9c349', fontSize: 20, margin: 0 }}>Food Store</h2>
          <p style={{ color: '#6b6151', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '4px 0 0' }}>Admin Portal</p>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {links.map((link) => (
            <Link key={link.to} to={link.to}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 4, fontSize: 14, textDecoration: 'none', color: '#c4c7c7' }}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #2a2b1b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e9c34920', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e9c349', fontSize: 14, fontWeight: 600 }}>
              {user?.nombre?.[0] || '?'}
            </div>
            <div>
              <p style={{ color: '#e4e4cc', fontSize: 13, margin: 0, fontWeight: 500 }}>{user?.nombre} {user?.apellido}</p>
              <p style={{ color: '#6b6151', fontSize: 11, margin: 0, textTransform: 'capitalize' }}>{rol}</p>
            </div>
          </div>
          <button onClick={() => { logout(); window.location.href = '/login' }}
            style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid #343625', color: '#c4c7c7', fontSize: 12, cursor: 'pointer', borderRadius: 4 }}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
        <Outlet />
      </main>
    </div>
  )
}

function StoreHome() {
  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc' }}>Catálogo</h1>
      <p style={{ color: '#c4c7c7' }}>Productos disponibles próximamente</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
          <Route path="/" element={<StoreHome />} />
          <Route path="*" element={<div style={{ padding: 40, color: '#c4c7c7' }}>404</div>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)

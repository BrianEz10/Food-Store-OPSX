import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

export default function AdminLayout() {
  const { user, rol, logout } = useAuthStore()
  const navigate = useNavigate()
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
          <button onClick={() => { logout(); navigate('/login') }}
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

import { useAuthStore } from '@/store/useAuthStore'
import { useCartStore } from '@/store/useCartStore'
import { Link, useNavigate } from 'react-router-dom'

export function Navbar() {
  const { user, token, rol, logout } = useAuthStore()
  const totalItems = useCartStore((s) => s.items.reduce((a, i) => a + i.cantidad, 0))
  const navigate = useNavigate()

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: '#1b1d0e', borderBottom: '1px solid #2a2b1b' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <Link to="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#e9c349', textDecoration: 'none', fontWeight: 600 }}>
          Food Store
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/" style={{ color: '#c4c7c7', textDecoration: 'none', fontSize: 14 }}>Catálogo</Link>
          {token ? (
            <>
              <Link to="/orders" style={{ color: '#c4c7c7', textDecoration: 'none', fontSize: 14 }}>Mis Pedidos</Link>
              {rol === 'admin' && (
                <Link to="/admin" style={{ color: '#e9c349', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Admin</Link>
              )}
              <Link to="/cart" style={{ color: '#c4c7c7', textDecoration: 'none', fontSize: 14, position: 'relative' }}>
                Carrito {totalItems > 0 && <span style={{ position: 'absolute', top: -8, right: -14, background: '#e9c349', color: '#131407', fontSize: 11, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{totalItems}</span>}
              </Link>
              <span style={{ color: '#6b6151', fontSize: 13 }}>{user?.nombre}</span>
              <button onClick={() => { logout(); navigate('/login') }}
                style={{ background: 'transparent', border: '1px solid #343625', color: '#c4c7c7', padding: '6px 14px', fontSize: 12, cursor: 'pointer', borderRadius: 4 }}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#c4c7c7', textDecoration: 'none', fontSize: 14 }}>Ingresar</Link>
              <Link to="/register" style={{ color: '#c4c7c7', textDecoration: 'none', fontSize: 14 }}>Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

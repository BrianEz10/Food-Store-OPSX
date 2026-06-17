import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'
import { imgUrl } from '@/lib/img'

export default function CartPage() {
  const { items, increaseQuantity, decreaseQuantity, removeItem, clearCart, totalAmount } = useCartStore()
  const { token } = useAuthStore()

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#e4e4cc', marginBottom: 12 }}>Tu carrito está vacío</h2>
        <p style={{ color: '#6b6151', marginBottom: 24 }}>Agregá productos desde el catálogo</p>
        <Link to="/" style={{ color: '#e9c349', textDecoration: 'none', fontSize: 14 }}>Ver catálogo</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#e4e4cc', margin: 0 }}>Carrito</h1>
        <button onClick={clearCart} style={{ background: 'transparent', border: '1px solid #93000a', color: '#ffb4ab', padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}>
          Vaciar carrito
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {items.map((item) => (
          <div key={item.productoId} style={{ display: 'flex', gap: 16, alignItems: 'center', background: '#1f2111', padding: 16, borderRadius: 4 }}>
            <div style={{ width: 60, height: 60, background: '#2a2b1b', borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
              {item.imagenUrl && <img src={imgUrl(item.imagenUrl)} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <Link to={`/product/${item.productoId}`} style={{ color: '#e4e4cc', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>{item.nombre}</Link>
              <p style={{ color: '#e9c349', fontSize: 14, margin: '2px 0 0' }}>${item.precio.toLocaleString('es-AR')}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => decreaseQuantity(item.productoId)} style={{ background: '#2a2b1b', border: '1px solid #444748', color: '#c4c7c7', width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>-</button>
              <span style={{ color: '#e4e4cc', fontSize: 14, minWidth: 20, textAlign: 'center' }}>{item.cantidad}</span>
              <button onClick={() => increaseQuantity(item.productoId)} style={{ background: '#2a2b1b', border: '1px solid #444748', color: '#c4c7c7', width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>+</button>
            </div>
            <div style={{ textAlign: 'right', minWidth: 80 }}>
              <p style={{ color: '#e9c349', fontSize: 14, fontWeight: 600, margin: 0 }}>${(item.precio * item.cantidad).toLocaleString('es-AR')}</p>
            </div>
            <button onClick={() => removeItem(item.productoId)} style={{ background: 'transparent', border: 'none', color: '#ffb4ab', cursor: 'pointer', fontSize: 18, padding: 4 }}>×</button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderTop: '1px solid #2a2b1b' }}>
        <div>
          <p style={{ color: '#c4c7c7', fontSize: 14, margin: 0 }}>Total</p>
          <p style={{ color: '#e9c349', fontSize: 24, fontWeight: 600, margin: '4px 0 0' }}>${totalAmount().toLocaleString('es-AR')}</p>
        </div>
        {token ? (
          <Link to="/checkout" style={{ background: '#e9c349', color: '#131407', padding: '12px 32px', textDecoration: 'none', fontSize: 15, fontWeight: 600, borderRadius: 4, cursor: 'pointer' }}>
            Iniciar pedido
          </Link>
        ) : (
          <Link to="/login?returnTo=/cart" style={{ background: '#e9c349', color: '#131407', padding: '12px 32px', textDecoration: 'none', fontSize: 15, fontWeight: 600, borderRadius: 4, cursor: 'pointer' }}>
            Iniciar pedido
          </Link>
        )}
      </div>
    </div>
  )
}

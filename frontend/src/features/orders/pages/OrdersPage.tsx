import { Link } from 'react-router-dom'
import { useOrders } from '@/features/orders/hooks/useOrders'
import { imgUrl } from '@/lib/img'

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREP: 'En preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

const STATUS_COLORS: Record<string, string> = {
  PENDIENTE: '#e9c349',
  CONFIRMADO: '#4caf50',
  EN_PREP: '#2196f3',
  ENTREGADO: '#9e9e9e',
  CANCELADO: '#ff5252',
}

export default function OrdersPage() {
  const { data, isLoading } = useOrders(1, 50)

  if (isLoading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ height: 24, background: '#2a2b1b', width: 200, marginBottom: 20 }} />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ height: 80, background: '#1f2111', marginBottom: 12, borderRadius: 4 }} />
        ))}
      </div>
    )
  }

  const orders = data?.items || []

  if (orders.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#e4e4cc', marginBottom: 12 }}>No tenés pedidos aún</h2>
        <Link to="/" style={{ color: '#e9c349', textDecoration: 'none' }}>Ir al catálogo</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#e4e4cc', marginBottom: 24 }}>Mis Pedidos</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} style={{ textDecoration: 'none', background: '#1f2111', padding: 16, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #2a2b1b' }}>
            <div>
              <p style={{ color: '#e4e4cc', fontSize: 14, fontWeight: 500, margin: '0 0 4px' }}>Pedido #{order.id}</p>
              <p style={{ color: '#6b6151', fontSize: 12, margin: 0 }}>{new Date(order.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
              <p style={{ color: '#c4c7c7', fontSize: 13, margin: '4px 0 0' }}>{order.detalles?.length || 0} producto(s)</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: STATUS_COLORS[order.estado_codigo] || '#c4c7c7', fontSize: 12, fontWeight: 600, background: '#2a2b1b', padding: '4px 10px', borderRadius: 4 }}>
                {STATUS_LABELS[order.estado_codigo] || order.estado_codigo}
              </span>
              <p style={{ color: '#e9c349', fontSize: 16, fontWeight: 600, margin: '8px 0 0' }}>${order.total.toLocaleString('es-AR')}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

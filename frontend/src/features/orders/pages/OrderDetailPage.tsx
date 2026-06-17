import { useParams, Link } from 'react-router-dom'
import { useOrder, useCancelOrder } from '@/features/orders/hooks/useOrders'
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

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const orderId = Number(id)
  const { data: order, isLoading } = useOrder(orderId)
  const cancelMutation = useCancelOrder()

  if (isLoading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ height: 24, background: '#2a2b1b', width: 200, marginBottom: 20 }} />
        <div style={{ height: 100, background: '#1f2111', borderRadius: 4, marginBottom: 16 }} />
        <div style={{ height: 200, background: '#1f2111', borderRadius: 4 }} />
      </div>
    )
  }

  if (!order) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: '#c4c7c7' }}>Pedido no encontrado</p>
        <Link to="/orders" style={{ color: '#e9c349', textDecoration: 'none' }}>Mis pedidos</Link>
      </div>
    )
  }

  const isCancelable = order.estado_codigo === 'PENDIENTE' || order.estado_codigo === 'CONFIRMADO'

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <Link to="/orders" style={{ color: '#6b6151', fontSize: 14, textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>← Mis pedidos</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#e4e4cc', margin: '0 0 4px' }}>Pedido #{order.id}</h1>
          <p style={{ color: '#6b6151', fontSize: 13, margin: 0 }}>{new Date(order.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: STATUS_COLORS[order.estado_codigo] || '#c4c7c7', fontSize: 13, fontWeight: 600, background: '#2a2b1b', padding: '6px 14px', borderRadius: 4 }}>
            {STATUS_LABELS[order.estado_codigo] || order.estado_codigo}
          </span>
        </div>
      </div>

      {(order.historial && order.historial.length > 0) && (
        <div style={{ background: '#1f2111', padding: 20, borderRadius: 4, marginBottom: 24 }}>
          <p style={{ color: '#6b6151', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Historial</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {order.historial.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[h.estado_hacia] || '#c4c7c7', flexShrink: 0 }} />
                <div>
                  <span style={{ color: STATUS_COLORS[h.estado_hacia] || '#c4c7c7', fontSize: 13, fontWeight: 500 }}>{STATUS_LABELS[h.estado_hacia] || h.estado_hacia}</span>
                  <span style={{ color: '#6b6151', fontSize: 12, marginLeft: 8 }}>{new Date(h.created_at).toLocaleString('es-AR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: '#1f2111', padding: 20, borderRadius: 4, marginBottom: 24 }}>
        <p style={{ color: '#6b6151', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Productos</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {order.detalles?.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#e4e4cc', fontSize: 14, margin: 0 }}>{d.nombre_snapshot} <span style={{ color: '#6b6151' }}>x{d.cantidad}</span></p>
                {d.personalizacion_nombres && d.personalizacion_nombres.length > 0 && (
                  <p style={{ color: '#6b6151', fontSize: 12, margin: '2px 0 0' }}>Sin: {d.personalizacion_nombres.join(', ')}</p>
                )}
              </div>
              <p style={{ color: '#e9c349', fontSize: 14, margin: 0 }}>${d.subtotal_snap.toLocaleString('es-AR')}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#1f2111', padding: 20, borderRadius: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#c4c7c7', fontSize: 14 }}>Subtotal</span>
          <span style={{ color: '#c4c7c7', fontSize: 14 }}>${order.subtotal.toLocaleString('es-AR')}</span>
        </div>
        {order.costo_envio > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#c4c7c7', fontSize: 14 }}>Envío</span>
            <span style={{ color: '#c4c7c7', fontSize: 14 }}>${order.costo_envio.toLocaleString('es-AR')}</span>
          </div>
        )}
        {order.descuento > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#c4c7c7', fontSize: 14 }}>Descuento</span>
            <span style={{ color: '#4caf50', fontSize: 14 }}>-${order.descuento.toLocaleString('es-AR')}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #2a2b1b', paddingTop: 12 }}>
          <span style={{ color: '#e4e4cc', fontSize: 16, fontWeight: 600 }}>Total</span>
          <span style={{ color: '#e9c349', fontSize: 18, fontWeight: 600 }}>${order.total.toLocaleString('es-AR')}</span>
        </div>
      </div>

      {isCancelable && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button onClick={() => { if (confirm('¿Cancelar pedido?')) cancelMutation.mutate({ id: orderId, motivo: 'Solicitud del cliente' }) }}
            style={{ background: 'transparent', border: '1px solid #93000a', color: '#ffb4ab', padding: '10px 24px', fontSize: 13, cursor: 'pointer', borderRadius: 4 }}>
            Cancelar pedido
          </button>
        </div>
      )}
    </div>
  )
}

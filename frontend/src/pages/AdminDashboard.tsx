import { useEffect, useState } from 'react'
import { fetchDashboard, type DashboardData } from '@/lib/dashboard'

const STATUS_COLORS: Record<string, string> = {
  PENDIENTE: '#c4c7c7',
  CONFIRMADO: '#e9c349',
  EN_PREP: '#ffb68c',
  ENTREGADO: '#60dac4',
  CANCELADO: '#ffb4ab',
}

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendientes',
  CONFIRMADO: 'Confirmados',
  EN_PREP: 'En prep',
  ENTREGADO: 'Entregados',
  CANCELADO: 'Cancelados',
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(() => setError('Error al cargar dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 28, marginBottom: 32 }}>
          Dashboard
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: 100, background: '#1f2111', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ padding: 40 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc' }}>Dashboard</h1>
        <p style={{ color: '#ffb4ab' }}>{error || 'Sin datos'}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 4 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 28, marginBottom: 32 }}>
        Dashboard
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <SummaryCard title="Ingresos totales" value={`$${data.ingresos_totales.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} />
        <SummaryCard title="Pedidos totales" value={String(data.total_pedidos)} />
        <SummaryCard title="Productos vendidos" value={String(data.productos_mas_vendidos.reduce((a, b) => a + b.total_vendido, 0))} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div style={{ background: '#1f2111', padding: 20 }}>
          <h3 style={{ color: '#e4e4cc', fontSize: 16, fontWeight: 600, marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>
            Pedidos por estado
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.pedidos_por_estado.map((p) => (
              <div key={p.estado}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#c4c7c7', fontSize: 13 }}>{STATUS_LABELS[p.estado] || p.estado}</span>
                  <span style={{ color: '#e4e4cc', fontSize: 13, fontWeight: 600 }}>{p.cantidad}</span>
                </div>
                <div style={{ height: 6, background: '#2a2b1b', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${Math.max(2, (p.cantidad / Math.max(...data.pedidos_por_estado.map((x) => x.cantidad))) * 100)}%`,
                    background: STATUS_COLORS[p.estado] || '#c4c7c7', borderRadius: 3, transition: 'width 0.5s',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#1f2111', padding: 20 }}>
          <h3 style={{ color: '#e4e4cc', fontSize: 16, fontWeight: 600, marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>
            Productos más vendidos
          </h3>
          {data.productos_mas_vendidos.length === 0 ? (
            <p style={{ color: '#6b6151', fontSize: 13 }}>Sin ventas aún</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.productos_mas_vendidos.map((p, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#c4c7c7', fontSize: 13 }}>{p.nombre}</span>
                    <span style={{ color: '#e9c349', fontSize: 13, fontWeight: 600 }}>{p.total_vendido}</span>
                  </div>
                  <div style={{ height: 6, background: '#2a2b1b', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.max(2, (p.total_vendido / Math.max(...data.productos_mas_vendidos.map((x) => x.total_vendido))) * 100)}%`,
                      background: '#e9c349', borderRadius: 3, transition: 'width 0.5s',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: '#1f2111', padding: 20 }}>
        <h3 style={{ color: '#e4e4cc', fontSize: 16, fontWeight: 600, marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>
          Pedidos recientes
        </h3>
        {data.pedidos_recientes.length === 0 ? (
          <p style={{ color: '#6b6151', fontSize: 13 }}>Sin pedidos aún</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2b1b' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b6151', fontWeight: 500 }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b6151', fontWeight: 500 }}>Cliente</th>
                  <th style={{ textAlign: 'right', padding: '8px 12px', color: '#6b6151', fontWeight: 500 }}>Total</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', color: '#6b6151', fontWeight: 500 }}>Estado</th>
                  <th style={{ textAlign: 'right', padding: '8px 12px', color: '#6b6151', fontWeight: 500 }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {data.pedidos_recientes.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #2a2b1b' }}>
                    <td style={{ padding: '10px 12px', color: '#c4c7c7' }}>#{p.id}</td>
                    <td style={{ padding: '10px 12px', color: '#e4e4cc' }}>{p.usuario_email}</td>
                    <td style={{ padding: '10px 12px', color: '#e4e4cc', textAlign: 'right' }}>
                      ${p.total.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: 3, fontSize: 11,
                        background: `${STATUS_COLORS[p.estado_codigo] || '#c4c7c7'}20`,
                        color: STATUS_COLORS[p.estado_codigo] || '#c4c7c7',
                        border: `1px solid ${STATUS_COLORS[p.estado_codigo] || '#c4c7c7'}40`,
                      }}>
                        {STATUS_LABELS[p.estado_codigo] || p.estado_codigo}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#6b6151', textAlign: 'right', fontSize: 12 }}>
                      {new Date(p.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ background: '#1f2111', padding: '20px 24px' }}>
      <p style={{ color: '#6b6151', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>
        {title}
      </p>
      <p style={{ color: '#e4e4cc', fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', serif", margin: 0 }}>
        {value}
      </p>
    </div>
  )
}

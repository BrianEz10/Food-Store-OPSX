import { useEffect, useState, useRef, useCallback } from 'react'
import { fetchPedidos, avanzarEstado, cancelarPedido, type Pedido } from '@/lib/pedidos'
import { useAuthStore } from '@/store/useAuthStore'
import { useToastStore } from '@/store/useToastStore'

const STATUSES = ['PENDIENTE', 'CONFIRMADO', 'EN_PREP', 'ENTREGADO', 'CANCELADO']

const LABELS: Record<string, string> = {
  PENDIENTE: 'Pendientes', CONFIRMADO: 'Confirmados', EN_PREP: 'En Preparación',
  ENTREGADO: 'Entregados', CANCELADO: 'Cancelados',
}

const TRANSITIONS: Record<string, string[]> = {
  PENDIENTE: ['CONFIRMADO'],
  CONFIRMADO: ['EN_PREP'],
  EN_PREP: ['ENTREGADO'],
  ENTREGADO: [],
  CANCELADO: [],
}

const TRANS_LABELS: Record<string, string> = {
  CONFIRMADO: 'Aprobar pago', EN_PREP: 'Iniciar prep', ENTREGADO: 'Entregar',
}

const WS_BASE = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:8000`

export default function PedidosPage() {
  const [groups, setGroups] = useState<Record<string, Pedido[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelId, setCancelId] = useState<number | null>(null)
  const [detailId, setDetailId] = useState<number | null>(null)
  const toast = useToastStore()
  const token = useAuthStore((s) => s.token)
  const wsRef = useRef<WebSocket | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await fetchPedidos(1, 100)
      const g: Record<string, Pedido[]> = {}
      for (const s of STATUSES) g[s] = []
      for (const p of data.items) {
        if (g[p.estado_codigo]) g[p.estado_codigo].push(p)
      }
      setGroups(g)
      setError('')
    } catch {
      setError('Error al cargar pedidos')
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // WebSocket
  useEffect(() => {
    if (!token) return
    const url = `${WS_BASE}/api/v1/pedidos/ws?token=${token}`
    const ws = new WebSocket(url)
    wsRef.current = ws
    ws.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data)
        if (d.event === 'PEDIDO_CREADO' || d.estado_nuevo || d.estado_hacia) {
          load()
        }
      } catch { /* ignore */ }
    }
    ws.onclose = () => { wsRef.current = null }
    return () => { ws.close() }
  }, [token, load])

  const handleAvanzar = async (id: number, estado: string) => {
    try {
      await avanzarEstado(id, estado)
      toast.success('Estado actualizado')
      load()
    } catch (e: any) {
      const msg = e?.response?.data?.detail || 'Error'
      toast.error(msg)
    }
  }

  const handleCancelConfirm = async (motivo: string) => {
    if (!cancelId) return
    try {
      await cancelarPedido(cancelId, motivo)
      toast.success('Pedido cancelado')
      setCancelId(null)
      load()
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || 'Error al cancelar')
    }
  }

  return (
    <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 24, margin: '0 0 16px' }}>Pedidos</h1>

      {error && <div style={{ color: '#ffb4ab', marginBottom: 12, fontSize: 13 }}>{error}</div>}

      <div style={{ flex: 1, display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {loading ? (
          <div style={{ display: 'flex', gap: 12 }}>
            {STATUSES.map((s) => (
              <div key={s} style={{ minWidth: 280, background: '#1f2111' }}>
                <div style={{ padding: 12, borderBottom: '1px solid #2a2b1b' }}>
                  <div style={{ height: 20, width: 100, background: '#2a2b1b', borderRadius: 4 }} />
                </div>
                <div style={{ padding: 8 }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ height: 80, background: '#2a2b1b', borderRadius: 4, marginBottom: 8 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          STATUSES.map((estado) => {
            const pedidos = groups[estado] || []
            const isTerminal = estado === 'ENTREGADO' || estado === 'CANCELADO'
            return (
              <div key={estado} style={{
                minWidth: 280, maxWidth: 280, background: '#1f2111', border: '1px solid #2a2b1b',
                display: 'flex', flexDirection: 'column', opacity: isTerminal ? 0.6 : 1,
              }}>
                <div style={{
                  padding: '10px 14px', borderBottom: '1px solid #2a2b1b', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ color: '#e4e4cc', fontSize: 14, fontWeight: 600 }}>{LABELS[estado]}</span>
                  <span style={{ color: '#6b6151', fontSize: 12, background: '#2a2b1b', padding: '2px 8px', borderRadius: 4 }}>
                    {pedidos.length}
                  </span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
                  {pedidos.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#6b6151', fontSize: 12 }}>Sin pedidos</div>
                  ) : (
                    pedidos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((p) => (
                      <div key={p.id} style={{
                        background: '#1b1d0e', padding: '10px 12px', marginBottom: 6, cursor: 'pointer',
                        border: '1px solid #2a2b1b', transition: 'border 0.15s',
                      }}
                        onClick={() => setDetailId(p.id === detailId ? null : p.id)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ color: '#6b6151', fontSize: 12, fontFamily: 'monospace' }}>#{String(p.id).padStart(6, '0')}</span>
                          <span style={{ color: '#6b6151', fontSize: 11 }}>
                            {new Date(p.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div style={{ color: '#e4e4cc', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                          {p.nombre_para || `Usuario #${p.usuario_id}`}
                        </div>
                        <div style={{ color: '#e9c349', fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                          ${p.total.toFixed(2)}
                        </div>
                        <div style={{ color: '#6b6151', fontSize: 12 }}>
                          {p.detalles?.length || 0} producto{(p.detalles?.length || 0) !== 1 ? 's' : ''}
                          {p.detalles?.[0] && ` · ${p.detalles[0].nombre_snapshot}${p.detalles.length > 1 ? '...' : ''}`}
                        </div>

                        {detailId === p.id && (
                          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #2a2b1b' }}>
                            {p.detalles?.slice(0, 5).map((d, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#c4c7c7', fontSize: 12, marginBottom: 2 }}>
                                <span>{d.cantidad}x {d.nombre_snapshot}</span>
                                <span>${(d.precio_snapshot * d.cantidad).toFixed(2)}</span>
                              </div>
                            ))}
                            {p.detalles?.length > 5 && <div style={{ color: '#6b6151', fontSize: 11 }}>...y {p.detalles.length - 5} más</div>}
                            <div style={{ color: '#6b6151', fontSize: 11, marginTop: 4 }}>
                              {p.forma_pago_codigo} · {p.metodo_envio}
                            </div>
                          </div>
                        )}

                        {!isTerminal && (
                          <div style={{ display: 'flex', gap: 4, marginTop: 8, paddingTop: 8, borderTop: '1px solid #2a2b1b' }}>
                            {(TRANSITIONS[p.estado_codigo] || []).map((dest) => (
                              <button key={dest} onClick={(e) => { e.stopPropagation(); handleAvanzar(p.id, dest) }}
                                style={{ flex: 1, padding: '5px 0', border: 'none', background: '#e9c34920', color: '#e9c349', fontSize: 11, fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
                                {TRANS_LABELS[dest] || dest}
                              </button>
                            ))}
                            {p.estado_codigo !== 'CANCELADO' && (
                              <button onClick={(e) => { e.stopPropagation(); setCancelId(p.id) }}
                                style={{ padding: '5px 8px', border: 'none', background: '#ffb4ab20', color: '#ffb4ab', fontSize: 11, fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
                                Cancelar
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {cancelId && <CancelModal pedidoId={cancelId} onClose={() => setCancelId(null)} onConfirm={handleCancelConfirm} />}
    </div>
  )
}

function CancelModal({ pedidoId, onClose, onConfirm }: { pedidoId: number; onClose: () => void; onConfirm: (motivo: string) => Promise<void> }) {
  const [motivo, setMotivo] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!motivo.trim()) return
    setSaving(true)
    await onConfirm(motivo.trim())
    setSaving(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div style={{ background: '#1f2111', border: '1px solid #343625', width: '100%', maxWidth: 400, padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 18, margin: '0 0 4px' }}>Cancelar pedido #{pedidoId}</h3>
        <p style={{ color: '#c4c7c7', fontSize: 13, marginBottom: 16 }}>Motivo de la cancelación</p>
        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej: Cliente solicitó cancelación"
          style={{ width: '100%', padding: '8px 10px', background: '#2a2b1b', border: '1px solid #444748', color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: 60, marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ ...mBtn, background: 'transparent', color: '#c4c7c7' }}>Volver</button>
          <button onClick={handleSubmit} disabled={saving || !motivo.trim()} style={{ ...mBtn, background: '#ffb4ab', color: '#690005', opacity: motivo.trim() ? 1 : 0.5 }}>
            {saving ? 'Cancelando...' : 'Confirmar cancelación'}
          </button>
        </div>
      </div>
    </div>
  )
}

const mBtn: React.CSSProperties = { border: 'none', padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }

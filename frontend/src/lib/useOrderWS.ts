import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore'
import { queryKeys } from '@/lib/queryKeys'

const WS_BASE = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:8000`

export function useOrderWS(orderId?: number) {
  const token = useAuthStore((s) => s.token)
  const qc = useQueryClient()
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!token) return
    const channel = orderId ? `pedido:${orderId}` : 'pedido'
    const url = `${WS_BASE}/api/v1/pedidos/ws?token=${token}&channel=${channel}`
    const ws = new WebSocket(url)
    wsRef.current = ws
    ws.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data)
        if (d.event === 'PEDIDO_CREADO' || d.estado_nuevo || d.estado_hacia) {
          if (orderId) {
            qc.invalidateQueries({ queryKey: queryKeys.order(orderId) })
          }
          qc.invalidateQueries({ queryKey: queryKeys.orders })
        }
      } catch { /* ignore */ }
    }
    ws.onclose = () => { wsRef.current = null }
    return () => { ws.close() }
  }, [token, orderId, qc])
}

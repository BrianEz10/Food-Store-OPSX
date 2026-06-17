import { api } from './axios'

export interface Pedido {
  id: number
  usuario_id: number
  estado_codigo: string
  forma_pago_codigo: string
  metodo_envio: string
  nombre_para: string | null
  subtotal: number
  descuento: number
  costo_envio: number
  total: number
  notas: string | null
  created_at: string
  direccion: any | null
  detalles: PedidoDetalle[]
  historial: HistorialEntry[]
}

export interface PedidoDetalle {
  producto_id: number
  cantidad: number
  nombre_snapshot: string
  precio_snapshot: number
  subtotal_snap: number
  personalizacion: number[] | null
  personalizacion_nombres: string[] | null
}

export interface HistorialEntry {
  estado_desde: string | null
  estado_hacia: string
  usuario_id: number | null
  motivo: string | null
  created_at: string
}

export async function fetchPedidos(page = 1, size = 50): Promise<{ items: Pedido[]; total: number }> {
  const { data } = await api.get('/pedidos/', { params: { page, size } })
  return data
}

export async function fetchPedido(id: number): Promise<Pedido> {
  const { data } = await api.get(`/pedidos/${id}`)
  return data
}

export async function avanzarEstado(id: number, estado_hacia: string, motivo?: string): Promise<Pedido> {
  const { data } = await api.patch(`/pedidos/${id}/estado`, { estado_hacia, motivo })
  return data
}

export async function cancelarPedido(id: number, motivo: string): Promise<Pedido> {
  return avanzarEstado(id, 'CANCELADO', motivo)
}

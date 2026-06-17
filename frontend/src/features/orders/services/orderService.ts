import { api } from '@/lib/axios'
import type { Pedido } from '@/lib/pedidos'
import type { CrearPedidoInput } from '@/lib/cajero'

export async function getOrders(page = 1, size = 50): Promise<{ items: Pedido[]; total: number }> {
  const { data } = await api.get('/pedidos/', { params: { page, size } })
  return data
}

export async function getOrderById(id: number): Promise<Pedido> {
  const { data } = await api.get(`/pedidos/${id}`)
  return data
}

export async function createOrder(input: CrearPedidoInput): Promise<Pedido> {
  const { data } = await api.post('/pedidos/', input)
  return data
}

export async function cancelOrder(id: number, motivo: string): Promise<Pedido> {
  const { data } = await api.patch(`/pedidos/${id}/estado`, { estado_hacia: 'CANCELADO', motivo })
  return data
}

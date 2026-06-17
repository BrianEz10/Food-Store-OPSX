import { api } from '@/lib/axios'

export async function createPayment(pedidoId: number) {
  const { data } = await api.post('/pagos/crear', { pedido_id: pedidoId })
  return data
}

export async function confirmPayment(params: { pedido_id: number; payment_id: string }) {
  const { data } = await api.post('/pagos/confirm', params)
  return data
}

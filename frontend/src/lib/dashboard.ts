import { api } from './axios'

export interface DashboardData {
  total_pedidos: number
  ingresos_totales: number
  pedidos_por_estado: { estado: string; cantidad: number }[]
  productos_mas_vendidos: { nombre: string; total_vendido: number }[]
  pedidos_recientes: { id: number; usuario_email: string; total: number; estado_codigo: string; created_at: string }[]
  total_por_forma_pago: { forma_pago: string; total: number }[]
}

export async function fetchDashboard(): Promise<DashboardData> {
  const { data } = await api.get('/admin/dashboard')
  return data
}

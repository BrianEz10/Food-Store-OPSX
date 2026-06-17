import { api } from '@/lib/axios'
import type { FormaPago } from '@/lib/cajero'

export async function getFormasPago(): Promise<FormaPago[]> {
  const { data } = await api.get('/formas-pago')
  return data
}

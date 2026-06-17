import { api } from '@/lib/axios'
import type { Categoria } from '@/lib/categorias'

export async function getCategories(): Promise<Categoria[]> {
  const { data } = await api.get('/categorias/')
  return data
}

import { api } from '@/lib/axios'
import type { ProductoOut, ProductoDetail, PaginatedProductos } from '@/lib/productos'

export async function getProducts(params?: { page?: number; size?: number; categoria_id?: number; disponible?: boolean; buscar?: string }): Promise<PaginatedProductos> {
  const { data } = await api.get('/productos/', { params })
  return data
}

export async function getProductById(id: number): Promise<ProductoDetail> {
  const { data } = await api.get(`/productos/${id}`)
  return data
}

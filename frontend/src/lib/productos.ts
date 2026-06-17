import { api } from './axios'

export interface ProductoOut {
  id: number
  nombre: string
  descripcion: string | null
  precio_base: number
  imagenes_url: string[] | null
  stock_cantidad: number
  disponible: boolean
  unidad_venta_id: number | null
}

export interface ProductoDetail extends ProductoOut {
  categorias: { id: number; nombre: string; descripcion: string | null; imagen_url: string | null; parent_id: number | null }[]
  ingredientes: { id: number; nombre: string; descripcion: string | null; es_alergeno: boolean }[]
}

export interface PaginatedProductos {
  items: ProductoOut[]
  total: number
  page: number
  size: number
  pages: number
}

export async function fetchProductos(params?: { page?: number; size?: number; categoria_id?: number; disponible?: boolean; buscar?: string }): Promise<PaginatedProductos> {
  const { data } = await api.get('/productos/', { params })
  return data
}

export async function fetchProducto(id: number): Promise<ProductoDetail> {
  const { data } = await api.get(`/productos/${id}`)
  return data
}

export async function createProducto(input: any): Promise<ProductoOut> {
  const { data } = await api.post('/productos/', input)
  return data
}

export async function updateProducto(id: number, input: any): Promise<ProductoOut> {
  const { data } = await api.put(`/productos/${id}`, input)
  return data
}

export async function toggleDisponibilidad(id: number, disponible: boolean): Promise<ProductoOut> {
  const { data } = await api.patch(`/productos/${id}/disponibilidad`, { disponible })
  return data
}

export async function deleteProducto(id: number): Promise<void> {
  await api.delete(`/productos/${id}`)
}

export async function uploadImagen(file: File): Promise<{ url: string; filename: string }> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/uploads/imagen', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

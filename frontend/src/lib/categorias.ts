import { api } from './axios'

export interface Categoria {
  id: number
  nombre: string
  descripcion: string | null
  imagen_url: string | null
  parent_id: number | null
}

export interface CategoriaInput {
  nombre: string
  descripcion?: string | null
  imagen_url?: string | null
  parent_id?: number | null
}

export async function fetchCategorias(): Promise<Categoria[]> {
  const { data } = await api.get('/categorias/')
  return data
}

export async function createCategoria(input: CategoriaInput): Promise<Categoria> {
  const { data } = await api.post('/categorias/', input)
  return data
}

export async function updateCategoria(id: number, input: CategoriaInput): Promise<Categoria> {
  const { data } = await api.patch(`/categorias/${id}`, input)
  return data
}

export async function deleteCategoria(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`)
}

import { api } from './axios'

export interface Ingrediente {
  id: number
  nombre: string
  descripcion: string | null
  es_alergeno: boolean
}

export interface IngredienteInput {
  nombre: string
  descripcion?: string | null
  es_alergeno?: boolean
}

export async function fetchIngredientes(): Promise<Ingrediente[]> {
  const { data } = await api.get('/ingredientes/')
  return data
}

export async function createIngrediente(input: IngredienteInput): Promise<Ingrediente> {
  const { data } = await api.post('/ingredientes/', input)
  return data
}

export async function updateIngrediente(id: number, input: IngredienteInput): Promise<Ingrediente> {
  const { data } = await api.patch(`/ingredientes/${id}`, input)
  return data
}

export async function deleteIngrediente(id: number): Promise<void> {
  await api.delete(`/ingredientes/${id}`)
}

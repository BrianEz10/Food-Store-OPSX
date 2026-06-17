import { api } from '@/lib/axios'

export interface Direccion {
  id: number
  linea1: string
  linea2: string | null
  ciudad: string
  provincia: string
  codigo_postal: string
  es_principal: boolean
}

export interface DireccionInput {
  linea1: string
  linea2?: string | null
  ciudad: string
  provincia: string
  codigo_postal: string
}

export async function getDirections(): Promise<Direccion[]> {
  const { data } = await api.get('/mis-direcciones')
  return data
}

export async function createDirection(input: DireccionInput): Promise<Direccion> {
  const { data } = await api.post('/mis-direcciones', input)
  return data
}

export async function updateDirection(id: number, input: DireccionInput): Promise<Direccion> {
  const { data } = await api.put(`/mis-direcciones/${id}`, input)
  return data
}

export async function setPrincipal(id: number): Promise<Direccion> {
  const { data } = await api.patch(`/mis-direcciones/${id}/principal`)
  return data
}

export async function deleteDirection(id: number): Promise<void> {
  await api.delete(`/mis-direcciones/${id}`)
}

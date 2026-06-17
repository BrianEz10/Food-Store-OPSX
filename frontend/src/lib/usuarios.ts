import { api } from './axios'

export interface Usuario {
  id: number
  email: string
  nombre: string
  apellido: string
  celular: string | null
  roles: string[]
  created_at: string
  deleted_at: string | null
}

export interface PaginatedUsuarios {
  items: Usuario[]
  total: number
  page: number
  size: number
  pages: number
}

export interface UsuarioUpdate {
  nombre?: string
  apellido?: string
  celular?: string | null
}

export async function fetchUsuarios(page = 1, size = 20, rol?: string): Promise<PaginatedUsuarios> {
  const params: any = { page, size }
  if (rol) params.rol = rol
  const { data } = await api.get('/usuarios/', { params })
  return data
}

export async function updateUsuario(id: number, data: UsuarioUpdate): Promise<Usuario> {
  const res = await api.patch(`/usuarios/${id}`, data)
  return res.data
}

export interface AsignarRolesRequest {
  roles: string[]
}

export async function asignarRoles(id: number, data: AsignarRolesRequest): Promise<Usuario> {
  const res = await api.patch(`/usuarios/${id}/roles`, data)
  return res.data
}

export async function deleteUsuario(id: number): Promise<void> {
  await api.delete(`/usuarios/${id}`)
}

export interface Role {
  codigo: string
  nombre: string
  descripcion: string
}

export async function fetchRoles(): Promise<Role[]> {
  const { data } = await api.get('/roles')
  return data
}

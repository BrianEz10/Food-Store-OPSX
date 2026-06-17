import { api } from './axios'
import { useAuthStore, type Rol } from '@/store/useAuthStore'

interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

interface MeResponse {
  id: number
  email: string
  nombre: string
  apellido: string
  celular?: string
  roles: string[]
}

function mapRole(backendRoles: string[]): Rol {
  if (backendRoles.includes('ADMIN')) return 'admin'
  if (backendRoles.includes('PEDIDOS')) return 'empleado'
  if (backendRoles.includes('CAJERO')) return 'cajero'
  if (backendRoles.includes('STOCK')) return 'stock'
  return 'cliente'
}

export async function login(email: string, password: string) {
  const { data: tokens } = await api.post<LoginResponse>('/auth/login', { email, password })
  const { data: me } = await api.get<MeResponse>('/auth/me', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  const rol = mapRole(me.roles)
  const user = { id: me.id, email: me.email, nombre: me.nombre, apellido: me.apellido, celular: me.celular }
  
  useAuthStore.getState().login(user, tokens.access_token, rol)
  
  localStorage.setItem('auth-storage', JSON.stringify({
    state: { user, token: tokens.access_token, rol },
  }))
  
  return rol
}

import { api } from '@/lib/axios'

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface MeResponse {
  id: number
  email: string
  nombre: string
  apellido: string
  celular?: string
  roles: string[]
}

export interface RegisterInput {
  nombre: string
  apellido: string
  email: string
  password: string
  celular?: string
}

export async function login(email: string, password: string) {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
  return data
}

export async function register(input: RegisterInput) {
  const { data } = await api.post<LoginResponse>('/auth/register', input)
  return data
}

export async function getMe() {
  const { data } = await api.get<MeResponse>('/auth/me')
  return data
}

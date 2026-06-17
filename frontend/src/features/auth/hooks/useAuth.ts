import { useMutation } from '@tanstack/react-query'
import { useAuthStore, type Rol } from '@/store/useAuthStore'
import * as authService from '@/features/auth/services/authService'

function mapRole(backendRoles: string[]): Rol {
  if (backendRoles.includes('ADMIN')) return 'admin'
  if (backendRoles.includes('CAJERO')) return 'cajero'
  if (backendRoles.includes('STOCK')) return 'stock'
  if (backendRoles.includes('COCINA')) return 'cocina'
  return 'cliente'
}

export function useLogin() {
  const storeLogin = useAuthStore((s) => s.login)
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const tokens = await authService.login(email, password)
      storeLogin({ id: 0, email: '', nombre: '', apellido: '' }, tokens.access_token, 'cliente')
      const me = await authService.getMe()
      const rol = mapRole(me.roles)
      const user = { id: me.id, email: me.email, nombre: me.nombre, apellido: me.apellido, celular: me.celular }
      storeLogin(user, tokens.access_token, rol)
      return rol
    },
  })
}

export function useRegister() {
  const storeLogin = useAuthStore((s) => s.login)
  return useMutation({
    mutationFn: async (input: authService.RegisterInput) => {
      const tokens = await authService.register(input)
      storeLogin({ id: 0, email: '', nombre: '', apellido: '' }, tokens.access_token, 'cliente')
      const me = await authService.getMe()
      const rol = mapRole(me.roles)
      const user = { id: me.id, email: me.email, nombre: me.nombre, apellido: me.apellido, celular: me.celular }
      storeLogin(user, tokens.access_token, rol)
      return rol
    },
  })
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Rol = 'admin' | 'empleado' | 'cajero' | 'stock' | 'cliente'

interface User {
  id: number; email: string; nombre: string; apellido: string; celular?: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  rol: Rol | null
  login: (user: User, token: string, rol: Rol) => void
  setAuth: (user: User, token: string, rol: Rol) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, token: null, rol: null,
      login: (user, token, rol) => set({ user, token, rol }),
      setAuth: (user, token, rol) => set({ user, token, rol }),
      logout: () => {
        localStorage.removeItem('auth-storage')
        set({ user: null, token: null, rol: null })
      },
    }),
    { name: 'auth-storage' },
  ),
)

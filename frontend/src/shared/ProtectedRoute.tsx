import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore, type Rol } from '@/store/useAuthStore'

export function ProtectedRoute() {
  const { token } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}

export function RoleRoute({ allowed, children }: { allowed: Rol[]; children: ReactNode }) {
  const { token, rol } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (!rol || !allowed.includes(rol)) return <Navigate to="/" replace />
  return <>{children}</>
}

import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
export const IMG_BASE = BASE.replace('/api/v1', '')

export const api = axios.create({ baseURL: BASE })

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState()
  if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !err.config.url?.includes('/auth/')) {
      const { token } = useAuthStore.getState()
      if (token) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  },
)

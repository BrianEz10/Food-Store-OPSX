import type { AxiosError } from 'axios'

export function parseError(err: unknown): string {
  const axiosErr = err as AxiosError<{ detail?: string }>
  if (axiosErr?.response?.data?.detail) return axiosErr.response.data.detail
  if (axiosErr?.message) return axiosErr.message
  return 'Ocurrió un error inesperado'
}

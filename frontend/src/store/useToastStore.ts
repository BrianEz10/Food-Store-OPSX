import { create } from 'zustand'

export interface Toast {
  id: string
  message: string
  subtitle?: string
  type: 'success' | 'error' | 'info'
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type'], subtitle?: string) => void
  removeToast: (id: string) => void
  success: (message: string, subtitle?: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

let _id = 0

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (message, type = 'info', subtitle) => {
    const id = String(++_id)
    set({ toasts: [...get().toasts, { id, message, subtitle, type }] })
    setTimeout(() => get().removeToast(id), 3500)
  },
  removeToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  success: (message, subtitle) => get().addToast(message, 'success', subtitle),
  error: (message) => get().addToast(message, 'error'),
  info: (message) => get().addToast(message, 'info'),
}))

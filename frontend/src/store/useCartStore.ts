import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productoId: number
  nombre: string
  precio: number
  cantidad: number
  imagenUrl: string
  exclusiones: number[]
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'cantidad'>) => void
  removeItem: (productoId: number) => void
  increaseQuantity: (productoId: number) => void
  decreaseQuantity: (productoId: number) => void
  updateExclusiones: (productoId: number, exclusiones: number[]) => void
  clearCart: () => void
  totalItems: () => number
  totalAmount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.productoId === item.productoId)
        if (existing) {
          set({ items: get().items.map((i) => i.productoId === item.productoId ? { ...i, cantidad: i.cantidad + 1 } : i) })
        } else {
          set({ items: [...get().items, { ...item, cantidad: 1 }] })
        }
      },
      removeItem: (productoId) => set({ items: get().items.filter((i) => i.productoId !== productoId) }),
      increaseQuantity: (productoId) => set({ items: get().items.map((i) => i.productoId === productoId ? { ...i, cantidad: i.cantidad + 1 } : i) }),
      decreaseQuantity: (productoId) => set({ items: get().items.map((i) => i.productoId === productoId ? { ...i, cantidad: Math.max(0, i.cantidad - 1) } : i).filter((i) => i.cantidad > 0) }),
      updateExclusiones: (productoId, exclusiones) => set({ items: get().items.map((i) => i.productoId === productoId ? { ...i, exclusiones } : i) }),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
      totalAmount: () => get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
    }),
    { name: 'cart-storage', partialize: (state) => ({ items: state.items }) },
  ),
)

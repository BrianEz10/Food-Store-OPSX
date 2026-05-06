import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/shared/types';
import { STORAGE_KEYS } from '@/shared/lib';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.productId === item.productId);
        let newItems;
        if (existingItem) {
          newItems = items.map((i) =>
            i.productId === item.productId
              ? { ...i, cantidad: i.cantidad + item.cantidad }
              : i
          );
        } else {
          newItems = [...items, item];
        }
        
        const total = newItems.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
        const itemCount = newItems.reduce((acc, i) => acc + i.cantidad, 0);
        
        set({ items: newItems, total, itemCount });
      },
      removeItem: (productId) => {
        const { items } = get();
        const newItems = items.filter((i) => i.productId !== productId);
        
        const total = newItems.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
        const itemCount = newItems.reduce((acc, i) => acc + i.cantidad, 0);
        
        set({ items: newItems, total, itemCount });
      },
      updateQuantity: (productId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const newItems = items.map((i) =>
          i.productId === productId ? { ...i, cantidad: quantity } : i
        );
        
        const total = newItems.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
        const itemCount = newItems.reduce((acc, i) => acc + i.cantidad, 0);
        
        set({ items: newItems, total, itemCount });
      },
      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    {
      name: STORAGE_KEYS.CART,
    }
  )
);

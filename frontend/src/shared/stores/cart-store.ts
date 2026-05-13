import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/shared/types';
import { STORAGE_KEYS } from '@/shared/lib';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productoId: number, exclusiones?: number[]) => void;
  updateQuantity: (productoId: number, quantity: number, exclusiones?: number[]) => void;
  clearCart: () => void;
  getSubtotal: (productoId: number, exclusiones: number[]) => number;
}

const itemKey = (item: Pick<CartItem, 'productoId' | 'exclusiones'>): string =>
  `${item.productoId}-${JSON.stringify([...item.exclusiones].sort())}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      addItem: (item) => {
        const { items } = get();
        const safeItem = { ...item, exclusiones: item.exclusiones ?? [] };
        const key = itemKey(safeItem);
        const existingIndex = items.findIndex((i) => itemKey(i) === key);

        let newItems: CartItem[];
        if (existingIndex >= 0) {
          newItems = items.map((i) =>
            itemKey(i) === key
              ? { ...i, cantidad: i.cantidad + safeItem.cantidad }
              : i
          );
        } else {
          newItems = [...items, safeItem];
        }

        const total = newItems.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
        const itemCount = newItems.reduce((acc, i) => acc + i.cantidad, 0);

        set({ items: newItems, total, itemCount });
      },
      removeItem: (productoId, exclusiones = []) => {
        const { items } = get();
        const key = `${productoId}-${JSON.stringify([...exclusiones].sort())}`;
        const newItems = items.filter((i) => itemKey(i) !== key);

        const total = newItems.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
        const itemCount = newItems.reduce((acc, i) => acc + i.cantidad, 0);

        set({ items: newItems, total, itemCount });
      },
      updateQuantity: (productoId, quantity, exclusiones = []) => {
        const { items } = get();

        if (quantity <= 0) {
          get().removeItem(productoId, exclusiones);
          return;
        }

        const key = `${productoId}-${JSON.stringify([...exclusiones].sort())}`;
        const newItems = items.map((i) =>
          itemKey(i) === key ? { ...i, cantidad: quantity } : i
        );

        const total = newItems.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
        const itemCount = newItems.reduce((acc, i) => acc + i.cantidad, 0);

        set({ items: newItems, total, itemCount });
      },
      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
      getSubtotal: (productoId, exclusiones) => {
        const { items } = get();
        const key = `${productoId}-${JSON.stringify([...exclusiones].sort())}`;
        const item = items.find((i) => itemKey(i) === key);
        return item ? item.precio * item.cantidad : 0;
      },
    }),
    {
      name: STORAGE_KEYS.CART,
    }
  )
);

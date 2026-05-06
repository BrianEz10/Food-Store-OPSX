import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, Toast, ModalState } from '@/shared/types';
import { STORAGE_KEYS } from '@/shared/lib';

interface UIState {
  sidebarOpen: boolean;
  theme: Theme;
  toasts: Toast[];
  activeModal: ModalState;
  
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: false,
      theme: 'system',
      toasts: [],
      activeModal: { isOpen: false, type: null, data: null },
      
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      setTheme: (theme) => {
        set({ theme });
        // Optional: you can apply the theme to the document immediately if needed here.
      },
      addToast: (toastData) => {
        const id = crypto.randomUUID();
        const toast = { ...toastData, id };
        set({ toasts: [...get().toasts, toast] });
        
        if (toast.duration !== 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, toast.duration || 3000);
        }
      },
      removeToast: (id) => set({
        toasts: get().toasts.filter((t) => t.id !== id)
      }),
      openModal: (type, data = null) => set({
        activeModal: { isOpen: true, type, data }
      }),
      closeModal: () => set({
        activeModal: { isOpen: false, type: null, data: null }
      }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      // Persist ONLY the theme property
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

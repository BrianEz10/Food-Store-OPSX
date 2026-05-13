import { create } from 'zustand';
import type { Categoria, CategoriaTreeNode, CategoriaCreate, CategoriaUpdate } from '@/shared/types/categoria';
import { categoriasApi } from '@/features/categorias/api';

interface CategoriaState {
  categorias: Categoria[];
  tree: CategoriaTreeNode[];
  selectedCategoria: Categoria | null;
  isLoading: boolean;
  error: string | null;

  loadCategorias: () => Promise<void>;
  loadTree: () => Promise<void>;
  createCategoria: (data: CategoriaCreate) => Promise<void>;
  updateCategoria: (id: number, data: CategoriaUpdate) => Promise<void>;
  deleteCategoria: (id: number) => Promise<void>;
  selectCategoria: (categoria: Categoria | null) => void;
  clearError: () => void;
}

export const useCategoriaStore = create<CategoriaState>((set, get) => ({
  categorias: [],
  tree: [],
  selectedCategoria: null,
  isLoading: false,
  error: null,

  loadCategorias: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoriasApi.list();
      set({ categorias: response.data, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.detail || 'Error al cargar categorías',
      });
    }
  },

  loadTree: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoriasApi.getTree();
      set({ tree: response.data, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.detail || 'Error al cargar árbol de categorías',
      });
    }
  },

  createCategoria: async (data: CategoriaCreate) => {
    set({ isLoading: true, error: null });
    try {
      await categoriasApi.create(data);
      await get().loadCategorias();
      await get().loadTree();
      set({ isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.detail || 'Error al crear categoría',
      });
      throw err;
    }
  },

  updateCategoria: async (id: number, data: CategoriaUpdate) => {
    set({ isLoading: true, error: null });
    try {
      await categoriasApi.update(id, data);
      await get().loadCategorias();
      await get().loadTree();
      set({ selectedCategoria: null, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.detail || 'Error al actualizar categoría',
      });
      throw err;
    }
  },

  deleteCategoria: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await categoriasApi.delete(id);
      await get().loadCategorias();
      await get().loadTree();
      set({ isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.detail || 'Error al eliminar categoría',
      });
      throw err;
    }
  },

  selectCategoria: (categoria) => set({ selectedCategoria: categoria }),

  clearError: () => set({ error: null }),
}));

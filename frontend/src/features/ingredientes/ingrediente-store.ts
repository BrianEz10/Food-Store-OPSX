import { create } from 'zustand';
import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from '@/shared/types/ingrediente';
import { ingredientesApi } from '@/features/ingredientes/api';

type AlergenoFilter = 'all' | 'alergenos' | 'no-alergenos';

interface IngredienteState {
  ingredientes: Ingrediente[];
  selectedIngrediente: Ingrediente | null;
  isLoading: boolean;
  error: string | null;
  filter: AlergenoFilter;

  loadIngredientes: () => Promise<void>;
  createIngrediente: (data: IngredienteCreate) => Promise<void>;
  updateIngrediente: (id: number, data: IngredienteUpdate) => Promise<void>;
  deleteIngrediente: (id: number) => Promise<void>;
  selectIngrediente: (ingrediente: Ingrediente | null) => void;
  setFilter: (filter: AlergenoFilter) => void;
  clearError: () => void;

  get filteredIngredientes(): Ingrediente[];
}

export const useIngredienteStore = create<IngredienteState>((set, get) => ({
  ingredientes: [],
  selectedIngrediente: null,
  isLoading: false,
  error: null,
  filter: 'all',

  loadIngredientes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ingredientesApi.list();
      set({ ingredientes: response.data, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.detail || 'Error al cargar ingredientes',
      });
    }
  },

  createIngrediente: async (data: IngredienteCreate) => {
    set({ isLoading: true, error: null });
    try {
      await ingredientesApi.create(data);
      await get().loadIngredientes();
      set({ isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.detail || 'Error al crear ingrediente',
      });
      throw err;
    }
  },

  updateIngrediente: async (id: number, data: IngredienteUpdate) => {
    set({ isLoading: true, error: null });
    try {
      await ingredientesApi.update(id, data);
      await get().loadIngredientes();
      set({ selectedIngrediente: null, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.detail || 'Error al actualizar ingrediente',
      });
      throw err;
    }
  },

  deleteIngrediente: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await ingredientesApi.delete(id);
      await get().loadIngredientes();
      set({ isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.detail || 'Error al eliminar ingrediente',
      });
      throw err;
    }
  },

  selectIngrediente: (ingrediente) => set({ selectedIngrediente: ingrediente }),

  setFilter: (filter) => set({ filter }),

  clearError: () => set({ error: null }),

  get filteredIngredientes() {
    const { ingredientes, filter } = get();
    if (filter === 'all') return ingredientes;
    if (filter === 'alergenos') return ingredientes.filter((i) => i.es_alergeno);
    return ingredientes.filter((i) => !i.es_alergeno);
  },
}));

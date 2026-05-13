import { api } from '@/shared/api/axios-instance';
import type {
  Ingrediente,
  IngredienteCreate,
  IngredienteListResponse,
  IngredienteUpdate,
} from '@/shared/types/ingrediente';

export const ingredientesApi = {
  list: async (): Promise<IngredienteListResponse> => {
    const response = await api.get<IngredienteListResponse>('/api/v1/ingredientes');
    return response.data;
  },

  getById: async (id: number): Promise<Ingrediente> => {
    const response = await api.get<{ data: Ingrediente }>(`/api/v1/ingredientes/${id}`);
    return response.data.data;
  },

  listAlergenos: async (): Promise<Ingrediente[]> => {
    const response = await api.get<Ingrediente[]>('/api/v1/ingredientes/alergenos');
    return response.data;
  },

  create: async (data: IngredienteCreate): Promise<Ingrediente> => {
    const response = await api.post<Ingrediente>('/api/v1/ingredientes', data);
    return response.data;
  },

  update: async (id: number, data: IngredienteUpdate): Promise<Ingrediente> => {
    const response = await api.put<Ingrediente>(`/api/v1/ingredientes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/ingredientes/${id}`);
  },
};

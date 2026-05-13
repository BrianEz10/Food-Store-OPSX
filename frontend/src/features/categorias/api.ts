import { api } from '@/shared/api/axios-instance';
import type {
  Categoria,
  CategoriaCreate,
  CategoriaListResponse,
  CategoriaTreeResponse,
  CategoriaUpdate,
} from '@/shared/types/categoria';

export const categoriasApi = {
  list: async (): Promise<CategoriaListResponse> => {
    const response = await api.get<CategoriaListResponse>('/api/v1/categorias');
    return response.data;
  },

  getById: async (id: number): Promise<Categoria> => {
    const response = await api.get<{ data: Categoria }>(`/api/v1/categorias/${id}`);
    return response.data.data;
  },

  getTree: async (): Promise<CategoriaTreeResponse> => {
    const response = await api.get<CategoriaTreeResponse>('/api/v1/categorias/arbol');
    return response.data;
  },

  create: async (data: CategoriaCreate): Promise<Categoria> => {
    const response = await api.post<Categoria>('/api/v1/categorias', data);
    return response.data;
  },

  update: async (id: number, data: CategoriaUpdate): Promise<Categoria> => {
    const response = await api.put<Categoria>(`/api/v1/categorias/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/categorias/${id}`);
  },
};

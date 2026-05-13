import { api } from '@/shared/api';
import type {
  DireccionResponse,
  DireccionCreate,
  DireccionUpdate,
} from '@/shared/types';

export const fetchDireccionesFn = async (): Promise<DireccionResponse[]> => {
  const { data } = await api.get<DireccionResponse[]>('/api/v1/direcciones');
  return data;
};

export const createDireccionFn = async (payload: DireccionCreate): Promise<DireccionResponse> => {
  const { data } = await api.post<DireccionResponse>('/api/v1/direcciones', payload);
  return data;
};

export const getDireccionFn = async (id: number): Promise<DireccionResponse> => {
  const { data } = await api.get<DireccionResponse>(`/api/v1/direcciones/${id}`);
  return data;
};

export const updateDireccionFn = async (id: number, payload: DireccionUpdate): Promise<DireccionResponse> => {
  const { data } = await api.patch<DireccionResponse>(`/api/v1/direcciones/${id}`, payload);
  return data;
};

export const deleteDireccionFn = async (id: number): Promise<void> => {
  await api.delete(`/api/v1/direcciones/${id}`);
};

export const setDireccionPredeterminadaFn = async (id: number): Promise<DireccionResponse> => {
  const { data } = await api.post<DireccionResponse>(`/api/v1/direcciones/${id}/predeterminada`);
  return data;
};

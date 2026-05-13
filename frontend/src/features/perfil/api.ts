import { api } from '@/shared/api';
import type {
  PerfilResponse,
  PerfilUpdate,
  CambioPasswordRequest,
} from '@/shared/types';

export const fetchPerfilFn = async (): Promise<PerfilResponse> => {
  const { data } = await api.get<PerfilResponse>('/api/v1/usuarios/me');
  return data;
};

export const updatePerfilFn = async (payload: PerfilUpdate): Promise<PerfilResponse> => {
  const { data } = await api.patch<PerfilResponse>('/api/v1/usuarios/me', payload);
  return data;
};

export const cambiarPasswordFn = async (payload: CambioPasswordRequest): Promise<{ detail: string }> => {
  const { data } = await api.patch<{ detail: string }>('/api/v1/usuarios/me/password', payload);
  return data;
};

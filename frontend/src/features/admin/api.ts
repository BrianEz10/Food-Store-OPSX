import { api } from '@/shared/api/axios-instance';
import type { AdminUsuarioListResponse, AdminUsuarioDetailResponse, AdminUsuarioUpdate, AdminUsuarioResponse } from './types';

export const fetchAdminUsuarios = async (
  params: { skip?: number; limit?: number; q?: string; rol?: string; incluir_eliminados?: boolean }
): Promise<AdminUsuarioListResponse> => {
  const { data } = await api.get<AdminUsuarioListResponse>('/admin/usuarios', { params });
  return data;
};

export const fetchAdminUsuario = async (id: number): Promise<AdminUsuarioDetailResponse> => {
  const { data } = await api.get<AdminUsuarioDetailResponse>(`/admin/usuarios/${id}`);
  return data;
};

export const updateAdminUsuario = async (id: number, payload: AdminUsuarioUpdate): Promise<AdminUsuarioResponse> => {
  const { data } = await api.put<AdminUsuarioResponse>(`/admin/usuarios/${id}`, payload);
  return data;
};

export const toggleAdminUsuarioEstado = async (id: number, payload: { activo: boolean }): Promise<AdminUsuarioResponse> => {
  const { data } = await api.patch<AdminUsuarioResponse>(`/admin/usuarios/${id}/estado`, payload);
  return data;
};

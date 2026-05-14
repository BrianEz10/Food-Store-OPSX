import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminUsuarios, fetchAdminUsuario, updateAdminUsuario, toggleAdminUsuarioEstado } from './api';
import type { AdminUsuarioListResponse, AdminUsuarioDetailResponse, AdminUsuarioUpdate, AdminUsuarioResponse } from './types';
import toast from 'react-hot-toast';

export const useAdminUsuarios = (params: {
  skip?: number;
  limit?: number;
  q?: string;
  rol?: string;
  incluir_eliminados?: boolean;
}) => {
  return useQuery<AdminUsuarioListResponse>({
    queryKey: ['admin-usuarios', params],
    queryFn: () => fetchAdminUsuarios(params),
  });
};

export const useAdminUsuario = (id: number | null) => {
  return useQuery<AdminUsuarioDetailResponse>({
    queryKey: ['admin-usuario', id],
    queryFn: () => fetchAdminUsuario(id!),
    enabled: !!id,
  });
};

export const useUpdateAdminUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation<AdminUsuarioResponse, Error, { id: number; data: AdminUsuarioUpdate }>({
    mutationFn: ({ id, data }) => updateAdminUsuario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['admin-usuario'] });
      toast.success('Usuario actualizado correctamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Error al actualizar usuario';
      toast.error(message);
    },
  });
};

export const useToggleUsuarioEstado = () => {
  const queryClient = useQueryClient();
  return useMutation<AdminUsuarioResponse, Error, { id: number; data: { activo: boolean } }>({
    mutationFn: ({ id, data }) => toggleAdminUsuarioEstado(id, data),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['admin-usuario'] });
      toast.success(_data.activo ? 'Usuario activado' : 'Usuario desactivado');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Error al cambiar estado';
      toast.error(message);
    },
  });
};

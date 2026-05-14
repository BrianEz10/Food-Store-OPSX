import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPedido } from './api';
import type { PedidoCreate, PedidoResponse } from './types';
import toast from 'react-hot-toast';

export const useCreatePedido = () => {
  const queryClient = useQueryClient();

  return useMutation<PedidoResponse, Error, PedidoCreate>({
    mutationFn: createPedido,
    onSuccess: () => {
      // Opcional: invalidar queries relacionadas, e.g., historial de pedidos
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast.success('Pedido creado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Error al crear el pedido';
      toast.error(message);
    },
  });
};

import { fetchPedidos, fetchPedidoById, transitionPedidoEstado } from './api';
import type { PedidoListResponse, PedidoDetailResponse, PedidoStatusUpdate } from './types';

export const usePedidos = (params: { skip?: number; limit?: number; estado?: string }) => {
  return useQuery<PedidoListResponse>({
    queryKey: ['pedidos', params],
    queryFn: () => fetchPedidos(params),
  });
};

export const usePedidoById = (id: number | null) => {
  return useQuery<PedidoDetailResponse>({
    queryKey: ['pedido', id],
    queryFn: () => fetchPedidoById(id!),
    enabled: !!id,
  });
};

export const useTransitionEstado = () => {
  const queryClient = useQueryClient();
  return useMutation<PedidoResponse, Error, { pedidoId: number; update: PedidoStatusUpdate }>({
    mutationFn: ({ pedidoId, update }) => transitionPedidoEstado(pedidoId, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['pedido'] });
      toast.success('Estado del pedido actualizado');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Error al actualizar el estado';
      toast.error(message);
    },
  });
};

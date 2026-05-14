import { useMutation, useQueryClient } from '@tanstack/react-query';
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

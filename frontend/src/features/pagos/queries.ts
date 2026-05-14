import { useMutation, useQuery } from '@tanstack/react-query';
import { createPagoFn, getPagoEstadoFn } from './api';
import type { PagoResponse, PagoEstadoResponse } from './api';
import toast from 'react-hot-toast';

export const useCreatePago = () => {
  return useMutation<PagoResponse, Error, number>({
    mutationFn: createPagoFn,
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Error al iniciar el pago';
      toast.error(message);
    },
  });
};

/**
 * Polling query para el estado del pago.
 * Se refresca cada 2 segundos mientras el estado no sea terminal.
 */
export const usePagoEstado = (pedidoId: number | null, enabled = true) => {
  return useQuery<PagoEstadoResponse>({
    queryKey: ['pago-estado', pedidoId],
    queryFn: () => getPagoEstadoFn(pedidoId!),
    enabled: !!pedidoId && enabled,
    refetchInterval: (query) => {
      const estado = query.state.data?.pago_estado;
      // Dejar de hacer polling cuando el estado es terminal
      if (estado === 'approved' || estado === 'rejected' || estado === 'cancelled') {
        return false;
      }
      return 2000; // 2 segundos
    },
  });
};

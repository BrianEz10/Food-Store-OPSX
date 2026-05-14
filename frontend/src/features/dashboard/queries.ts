import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDashboardResumen, fetchVentasPorMes, fetchTopProductos, fetchPedidosPorEstado, fetchConfiguracion, updateConfiguracion } from './api';
import type { ConfiguracionUpdate, ConfiguracionResponse } from './types';
import toast from 'react-hot-toast';

export const useDashboardResumen = () => {
  return useQuery({
    queryKey: ['dashboard', 'resumen'],
    queryFn: fetchDashboardResumen,
  });
};

export const useVentasPorMes = () => {
  return useQuery({
    queryKey: ['dashboard', 'ventas-por-mes'],
    queryFn: fetchVentasPorMes,
  });
};

export const useTopProductos = (limit = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'top-productos', limit],
    queryFn: () => fetchTopProductos(limit),
  });
};

export const usePedidosPorEstado = () => {
  return useQuery({
    queryKey: ['dashboard', 'pedidos-por-estado'],
    queryFn: fetchPedidosPorEstado,
  });
};

export const useConfiguracion = () => {
  return useQuery({
    queryKey: ['dashboard', 'configuracion'],
    queryFn: fetchConfiguracion,
  });
};

export const useUpdateConfiguracion = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfiguracionResponse, Error, ConfiguracionUpdate>({
    mutationFn: updateConfiguracion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'configuracion'] });
      toast.success('Configuración actualizada');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Error al actualizar configuración';
      toast.error(message);
    },
  });
};

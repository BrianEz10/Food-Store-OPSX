import { api } from '@/shared/api/axios-instance';
import type { DashboardResumen, VentasPorMesEntry, TopProductoEntry, PedidosPorEstadoEntry, ConfiguracionResponse, ConfiguracionUpdate } from './types';

export const fetchDashboardResumen = async (): Promise<DashboardResumen> => {
  const { data } = await api.get<DashboardResumen>('/admin/dashboard/resumen');
  return data;
};

export const fetchVentasPorMes = async (): Promise<VentasPorMesEntry[]> => {
  const { data } = await api.get<VentasPorMesEntry[]>('/admin/dashboard/ventas-por-mes');
  return data;
};

export const fetchTopProductos = async (limit = 10): Promise<TopProductoEntry[]> => {
  const { data } = await api.get<TopProductoEntry[]>('/admin/dashboard/top-productos', { params: { limit } });
  return data;
};

export const fetchPedidosPorEstado = async (): Promise<PedidosPorEstadoEntry[]> => {
  const { data } = await api.get<PedidosPorEstadoEntry[]>('/admin/dashboard/pedidos-por-estado');
  return data;
};

export const fetchConfiguracion = async (): Promise<ConfiguracionResponse[]> => {
  const { data } = await api.get<ConfiguracionResponse[]>('/admin/configuracion');
  return data;
};

export const updateConfiguracion = async (payload: ConfiguracionUpdate): Promise<ConfiguracionResponse> => {
  const { data } = await api.put<ConfiguracionResponse>('/admin/configuracion', payload);
  return data;
};

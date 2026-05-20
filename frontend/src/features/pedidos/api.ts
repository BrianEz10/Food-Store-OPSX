import { api } from '@/shared/api/axios-instance';
import type { PedidoCreate, PedidoResponse } from './types';

export const createPedido = async (data: PedidoCreate): Promise<PedidoResponse> => {
  const response = await api.post<PedidoResponse>('/api/v1/pedidos', data);
  return response.data;
};

import type { PedidoListResponse, PedidoDetailResponse, PedidoStatusUpdate } from './types';

export const fetchPedidos = async (
  params: { skip?: number; limit?: number; estado?: string }
): Promise<PedidoListResponse> => {
  const { data } = await api.get<PedidoListResponse>('/api/v1/pedidos', { params });
  return data;
};

export const fetchPedidoById = async (id: number): Promise<PedidoDetailResponse> => {
  const { data } = await api.get<PedidoDetailResponse>(`/api/v1/pedidos/${id}`);
  return data;
};

export const transitionPedidoEstado = async (
  pedidoId: number,
  update: PedidoStatusUpdate
): Promise<PedidoResponse> => {
  const { data } = await api.post<PedidoResponse>(`/api/v1/pedidos/${pedidoId}/estado`, update);
  return data;
};

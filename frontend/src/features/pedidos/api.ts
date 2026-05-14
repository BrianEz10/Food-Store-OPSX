import { api } from '@/shared/api/axios-instance';
import type { PedidoCreate, PedidoResponse } from './types';

export const createPedido = async (data: PedidoCreate): Promise<PedidoResponse> => {
  const response = await api.post<PedidoResponse>('/pedidos', data);
  return response.data;
};

import type { PedidoListResponse, PedidoDetailResponse, PedidoStatusUpdate } from './types';

export const fetchPedidos = async (
  params: { skip?: number; limit?: number; estado?: string }
): Promise<PedidoListResponse> => {
  const { data } = await api.get<PedidoListResponse>('/pedidos', { params });
  return data;
};

export const fetchPedidoById = async (id: number): Promise<PedidoDetailResponse> => {
  const { data } = await api.get<PedidoDetailResponse>(`/pedidos/${id}`);
  return data;
};

export const transitionPedidoEstado = async (
  pedidoId: number,
  update: PedidoStatusUpdate
): Promise<PedidoResponse> => {
  const { data } = await api.post<PedidoResponse>(`/pedidos/${pedidoId}/estado`, update);
  return data;
};

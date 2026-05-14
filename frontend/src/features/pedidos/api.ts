import { api } from '@/shared/api/axios-instance';
import type { PedidoCreate, PedidoResponse } from './types';

export const createPedido = async (data: PedidoCreate): Promise<PedidoResponse> => {
  const response = await api.post<PedidoResponse>('/pedidos', data);
  return response.data;
};

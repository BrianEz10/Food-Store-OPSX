import { api } from '@/shared/api/axios-instance';

export interface PagoResponse {
  id: number;
  pedido_id: number;
  monto: number;
  mp_payment_id: number | null;
  mp_status: string;
  external_reference: string;
  preference_id: string | null;
  init_point: string | null;
}

export interface PagoEstadoResponse {
  pedido_id: number;
  pago_id: number | null;
  pago_estado: string | null;
  mp_payment_id: number | null;
  pedido_estado: string;
}

export const createPagoFn = async (pedidoId: number): Promise<PagoResponse> => {
  const { data } = await api.post<PagoResponse>(`/api/v1/pagos/${pedidoId}`);
  return data;
};

export const getPagoEstadoFn = async (pedidoId: number): Promise<PagoEstadoResponse> => {
  const { data } = await api.get<PagoEstadoResponse>(`/api/v1/pagos/${pedidoId}/estado`);
  return data;
};

export interface DetallePedidoCreate {
  producto_id: number;
  cantidad: number;
  ingredientes_excluidos?: number[];
}

export interface PedidoCreate {
  direccion_id: number;
  notas?: string;
  items: DetallePedidoCreate[];
}

export interface DetallePedidoResponse {
  id: number;
  producto_id: number;
  nombre_snapshot: string;
  precio_snapshot: number;
  cantidad: number;
  subtotal: number;
  personalizacion?: number[];
}

export interface PedidoResponse {
  id: number;
  usuario_id: number;
  estado_codigo: string;
  direccion_id?: number;
  total: number;
  costo_envio: number;
  notas?: string;
  creado_en: string;
  actualizado_en: string;
  detalles: DetallePedidoResponse[];
}

// ── List / Detail types ──

export interface PedidoListResponse {
  data: PedidoResponse[];
  total: number;
  skip: number;
  limit: number;
}

export interface HistorialEntry {
  id: number;
  estado_desde: string | null;
  estado_hasta: string;
  usuario_id: number | null;
  motivo: string | null;
  creado_en: string;
}

export interface PagoEstadoInfo {
  pago_id: number | null;
  pago_estado: string | null;
  mp_payment_id: number | null;
}

export interface PedidoDetailResponse extends PedidoResponse {
  historial: HistorialEntry[];
  pago: PagoEstadoInfo | null;
}

export interface PedidoStatusUpdate {
  nuevo_estado: string;
  motivo?: string;
}

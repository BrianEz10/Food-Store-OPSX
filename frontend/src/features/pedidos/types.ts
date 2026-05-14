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

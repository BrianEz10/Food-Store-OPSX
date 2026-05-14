export interface DashboardResumen {
  ventas_totales: number;
  cantidad_pedidos: number;
  usuarios_registrados: number;
  ticket_promedio: number;
  pedidos_hoy: number;
  productos_disponibles: number;
}

export interface VentasPorMesEntry {
  mes: string;
  ventas: number;
  cantidad_pedidos: number;
}

export interface TopProductoEntry {
  nombre: string;
  cantidad_vendida: number;
  ingresos_totales: number;
}

export interface PedidosPorEstadoEntry {
  estado: string;
  cantidad: number;
}

export interface ConfiguracionResponse {
  clave: string;
  valor: string;
  descripcion?: string | null;
  actualizado_en?: string | null;
}

export interface ConfiguracionUpdate {
  clave: string;
  valor: string;
  descripcion?: string | null;
}

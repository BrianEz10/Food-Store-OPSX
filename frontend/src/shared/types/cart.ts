export interface CartItem {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;
  exclusiones: number[];
  stockDisponible?: boolean;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

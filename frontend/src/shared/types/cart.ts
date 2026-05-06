export interface CartItem {
  productId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;
  personalizacion?: number[];
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

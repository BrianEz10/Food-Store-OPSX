export interface ProductoCategoriaOut {
  id: number;
  nombre: string;
  es_principal: boolean;
}

export interface ProductoIngredienteOut {
  id: number;
  nombre: string;
  es_alergeno: boolean;
  es_removible: boolean;
}

export interface ProductoListadoItem {
  id: number;
  nombre: string;
  descripcion?: string | null;
  imagen_url?: string | null;
  precio_base: number;
  stock_cantidad: number;
  disponible: boolean;
  creado_en: string;
}

export interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion?: string | null;
  imagen_url?: string | null;
  precio_base: number;
  stock_cantidad: number;
  disponible: boolean;
  eliminado_en?: string | null;
  creado_en: string;
  actualizado_en: string;
  categorias: ProductoCategoriaOut[];
  ingredientes: ProductoIngredienteOut[];
}

export interface ProductoListResponse {
  data: ProductoListadoItem[];
  total: number;
}

export interface ProductoIngredienteInput {
  ingrediente_id: number;
  es_removible: boolean;
}

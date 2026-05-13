/**
 * Tipos para la entidad Product, según los schemas del backend.
 */

export interface Product {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
  precio_base: number;
  stock_cantidad: number;
  disponible: boolean;
  eliminado_en: string | null;
  creado_en: string;
  actualizado_en: string;
  categorias: ProductCategory[];
  ingredientes: ProductIngredient[];
}

export interface ProductListItem {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
  precio_base: number;
  stock_cantidad: number;
  disponible: boolean;
  creado_en: string;
}

export interface ProductCategory {
  id: number;
  nombre: string;
  es_principal: boolean;
}

export interface ProductIngredient {
  id: number;
  nombre: string;
  es_alergeno: boolean;
  es_removible: boolean;
}

export interface ProductListResponse {
  data: ProductListItem[];
  total: number;
}

export interface ProductFilters {
  skip?: number;
  limit?: number;
  categoria_id?: number | null;
  search?: string | null;
}

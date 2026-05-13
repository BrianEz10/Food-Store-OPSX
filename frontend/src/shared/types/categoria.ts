export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  padre_id?: number | null;
  orden: number;
  eliminado_en?: string | null;
  creado_en: string;
  actualizado_en: string;
}

export interface CategoriaTreeNode {
  id: number;
  nombre: string;
  hijos: CategoriaTreeNode[];
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  padre_id?: number | null;
  orden?: number;
}

export interface CategoriaUpdate {
  nombre?: string;
  descripcion?: string;
  imagen_url?: string;
  padre_id?: number | null;
  orden?: number;
}

export interface CategoriaListResponse {
  data: Categoria[];
  total: number;
}

export interface CategoriaTreeResponse {
  data: CategoriaTreeNode[];
}

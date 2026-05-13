export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion?: string;
  es_alergeno: boolean;
  eliminado_en?: string | null;
  creado_en: string;
  actualizado_en: string;
}

export interface IngredienteCreate {
  nombre: string;
  descripcion?: string;
  es_alergeno?: boolean;
}

export interface IngredienteUpdate {
  nombre?: string;
  descripcion?: string;
  es_alergeno?: boolean;
}

export interface IngredienteListResponse {
  data: Ingrediente[];
  total: number;
}

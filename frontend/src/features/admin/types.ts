export interface AdminUsuarioResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string | null;
  roles: string[];
  activo: boolean;
  creado_en: string;
}

export interface AdminUsuarioDetailResponse extends AdminUsuarioResponse {
  actualizado_en?: string | null;
  eliminado_en?: string | null;
}

export interface AdminUsuarioListResponse {
  data: AdminUsuarioResponse[];
  total: number;
  skip: number;
  limit: number;
}

export interface AdminUsuarioUpdate {
  nombre?: string;
  apellido?: string;
  email?: string;
  roles?: string[];
}

export interface AdminUsuarioEstadoUpdate {
  activo: boolean;
}

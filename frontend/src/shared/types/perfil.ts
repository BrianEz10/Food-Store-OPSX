export interface PerfilResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  roles: string[];
  creado_en: string;
}

export interface PerfilUpdate {
  nombre?: string;
  apellido?: string;
}

export interface CambioPasswordRequest {
  current_password: string;
  new_password: string;
}

export interface DireccionResponse {
  id: number;
  alias: string | null;
  linea1: string;
  linea2: string | null;
  ciudad: string;
  codigo_postal: string;
  es_principal: boolean;
}

export interface DireccionCreate {
  alias?: string;
  linea1: string;
  linea2?: string;
  ciudad: string;
  codigo_postal: string;
  es_principal?: boolean;
}

export interface DireccionUpdate {
  alias?: string;
  linea1?: string;
  linea2?: string;
  ciudad?: string;
  codigo_postal?: string;
  es_principal?: boolean;
}

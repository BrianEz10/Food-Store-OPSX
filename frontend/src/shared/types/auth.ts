export type Role = 'ADMIN' | 'STOCK' | 'PEDIDOS' | 'CLIENT';

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  roles: Role[];
}

export interface LoginCredentials {
  email: string;
  password_plain: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password_plain: string;
  telefono?: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

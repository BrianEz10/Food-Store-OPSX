import { api } from '@/shared/api/axios-instance';
import type { LoginCredentials, RegisterData, TokenPair, User } from '@/shared/types';

export const loginFn = async (credentials: LoginCredentials): Promise<TokenPair> => {
  const response = await api.post<TokenPair>('/api/v1/auth/login', credentials);
  return response.data;
};

export const registerFn = async (data: RegisterData): Promise<User> => {
  const response = await api.post<User>('/api/v1/auth/register', data);
  return response.data;
};

export const refreshFn = async (refreshToken: string): Promise<TokenPair> => {
  const response = await api.post<TokenPair>('/api/v1/auth/refresh', { refresh_token: refreshToken });
  return response.data;
};

export const logoutFn = async (refreshToken: string): Promise<void> => {
  await api.post('/api/v1/auth/logout', { refresh_token: refreshToken });
};

export const fetchMeFn = async (): Promise<User> => {
  // Placeholder para cuando el backend implemente /me
  // Por ahora, simularemos la respuesta si el endpoint no existe
  try {
    const response = await api.get<User>('/api/v1/usuarios/me');
    return response.data;
  } catch (error) {
    // Fallback temporal si el endpoint no existe
    return {
      id: 0,
      nombre: 'Usuario',
      apellido: 'Temporal',
      email: 'temporal@ejemplo.com',
      roles: ['CLIENT'],
    };
  }
};

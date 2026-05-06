import axios from 'axios';
import { useAuthStore } from '@/shared/stores/auth-store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const refreshAccessToken = async () => {
  // Skeleton / Placeholder
  return Promise.reject('Refresh token not implemented yet');
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        // originalRequest headers update logic would go here
      } catch (err) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

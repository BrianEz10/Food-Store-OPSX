import { create } from 'zustand';
import type { User, Role } from '@/shared/types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  hasRole: (role: Role) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  setTokens: (access, refresh) => set({
    accessToken: access,
    refreshToken: refresh,
    isAuthenticated: true,
  }),
  setUser: (user) => set({ user }),
  logout: () => set({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
  }),
  hasRole: (role) => {
    const { user } = get();
    return user ? user.roles.includes(role) : false;
  },
}));

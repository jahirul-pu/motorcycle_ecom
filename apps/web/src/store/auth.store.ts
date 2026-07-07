import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setCredentials: (user: User, accessToken: string, refreshToken: string) => void;
  clearCredentials: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setCredentials: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),
      clearCredentials: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'motohub-auth',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : sessionStorage,
      ),
    },
  ),
);

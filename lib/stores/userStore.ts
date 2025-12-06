import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AdminRole = 'admin' | 'moderator' | 'content_creator' | 'finance';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: string[];
}

interface UserState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: AdminUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'admin-user-storage',
    }
  )
);


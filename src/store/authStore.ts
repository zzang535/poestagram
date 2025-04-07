import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  email: string;
  nickname: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (response: { access_token: string; user: User }) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      login: (response) => {
        set({ user: response.user, accessToken: response.access_token });
      },
      logout: () => {
        set({ user: null, accessToken: null });
      },
      isLoggedIn: () => {
        return get().accessToken !== null;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
); 
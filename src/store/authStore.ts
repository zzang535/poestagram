import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  nickname: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  tokenType: string | null;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: User | null) => void;
  setToken: (accessToken: string | null, tokenType: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      tokenType: null,
      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setUser: (user) => set({ user }),
      setToken: (accessToken, tokenType) => set({ accessToken, tokenType }),
      logout: () => set({ 
        isLoggedIn: false, 
        user: null, 
        accessToken: null, 
        tokenType: null 
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
); 
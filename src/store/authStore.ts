import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  email: string;
  username: string;
  profile_image_url?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  hasHydrated: boolean;
  login: (response: { access_token: string; user: User }) => void;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      hasHydrated: false,
      login: (response) => {
        set({ user: response.user, accessToken: response.access_token });
      },
      logout: () => {
        set({ user: null, accessToken: null });
      },
      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
); 
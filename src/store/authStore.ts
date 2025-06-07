import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  email: string;
  username: string;
  bio?: string;
  profile_image_url?: string;
}

interface AuthState {
  user: User | null;
  hasHydrated: boolean;
  login: (response: { access_token: string; user: User }) => void;
  logout: () => void;
  updateUser: (userUpdate: Partial<User>) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  getAccessToken: () => string | null;
  isAuthenticated: () => boolean;
}

// 쿠키 유틸리티 함수들
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hasHydrated: false,

      login: (response) => {
        const { access_token, user } = response;
        
        // 유저 정보는 localStorage에 저장 (zustand persist)
        set({ user });
        
        // 토큰은 쿠키에만 저장 (SSR 접근용)
        setCookie('auth-token', access_token, 7);
      },

      logout: () => {
        // localStorage에서 유저 정보 제거
        set({ user: null });
        
        // 쿠키에서 토큰 제거
        deleteCookie('auth-token');
      },

      updateUser: (userUpdate) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userUpdate } });
        }
      },

      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },

      // 토큰 가져오기 (쿠키에서)
      getAccessToken: () => {
        return getCookie('auth-token');
      },

      // 인증 상태 확인
      isAuthenticated: () => {
        const token = getCookie('auth-token');
        const user = get().user;
        return !!(token && user);
      },
    }),
    {
      name: 'auth-user-storage', // 유저 정보만 localStorage에 저장
      partialize: (state) => ({ 
        user: state.user  // 토큰은 제외하고 유저 정보만 persist
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
); 
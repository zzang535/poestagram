'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    // hydration이 완료된 후에만 인증 체크
    if (hasHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, hasHydrated, router]);

  // hydration이 완료되지 않았으면 로딩 상태
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  return <>{children}</>;
} 
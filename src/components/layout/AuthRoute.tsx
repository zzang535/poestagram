'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthRouteProps {
  children: React.ReactNode;
}

export default function AuthRoute({ children }: AuthRouteProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/feed');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 
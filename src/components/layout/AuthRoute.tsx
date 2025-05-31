'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthRouteProps {
  children: React.ReactNode;
}

export default function AuthRoute({ children }: AuthRouteProps) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);


  useEffect(() => {
    if (accessToken) {
      router.push('/feed');
    }
  }, [accessToken, router]);

  if (accessToken) {
    return null;
  }

  return <>{children}</>;
} 
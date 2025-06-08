import { cookies } from 'next/headers';

/**
 * 서버에서 인증 토큰을 가져옵니다.
 */
export async function getServerAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('auth-token');
    return tokenCookie?.value || null;
  } catch (error) {
    console.error('Failed to read auth token from cookie:', error);
    return null;
  }
}

/**
 * 서버에서 인증 상태를 확인합니다.
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const token = await getServerAuthToken();
  return !!token;
} 
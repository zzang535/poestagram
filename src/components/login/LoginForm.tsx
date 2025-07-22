"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { login } from "@/services/auth"; // login API만 사용
import TextButton from "@/components/ui/TextButton";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginForm() {
  const router = useRouter();
  const t = useTranslations('login');
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미 로그인된 사용자 처리
  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.push('/feed');
    }
  }, [hasHydrated, isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMessage(t('errors.required'));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const loginResponse = await login(identifier, password);
      useAuthStore.getState().login({
        access_token: loginResponse.access_token,
        user: {
          id: loginResponse.user_id,
          email: loginResponse.email,
          username: loginResponse.username,
          profile_image_url: loginResponse.profile_image_url,
        }
      });
      router.push("/feed");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('errors.loginFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // hydration 완료 전까지 로딩 상태
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // 이미 로그인된 경우 아무것도 렌더링하지 않음 (리다이렉트 중)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full mx-auto min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-[400px] space-y-6">
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-4">
            <Input
              label={t('identifier')}
              type="text"
              placeholder={t('identifierPlaceholder')}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            
            <Input
              label={t('password')}
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPasswordToggle={true}
            />

            {errorMessage && (
              <p className="text-sm text-red-500">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              loading={isSubmitting}
              loadingText={t('loggingIn')}
            >
              {t('loginButton')}
            </Button>
          </div>

          <div className="space-y-2 mt-6">
            <Link href="/reset-password" 
              className="block text-center text-black-100 text-sm hover:underline">
              {t('forgotPassword')}
            </Link>
            <div className="text-center">
              <TextButton
                href="/signup"
                variant="link"
                size="sm"
                className="block w-full"
              >
                {t('noAccount')}
              </TextButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

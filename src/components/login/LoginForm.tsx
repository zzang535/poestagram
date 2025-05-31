"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { login } from "@/apis/auth"; // login API만 사용
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import TextButton from "@/components/shared/TextButton";

export default function LoginForm() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 이미 로그인된 사용자 처리
  useEffect(() => {
    if (hasHydrated && accessToken) {
      router.push('/feed');
    }
  }, [hasHydrated, accessToken, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMessage("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

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
      setErrorMessage(error instanceof Error ? error.message : "로그인에 실패했습니다. 사용자명 또는 비밀번호를 확인해주세요.");
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
  if (accessToken) {
    return null;
  }

  return (
    <div className="w-full mx-auto min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-[400px] space-y-6">
        <p className="text-2xl font-bold text-white text-center">로그인</p>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
                placeholder="아이디 (이메일 또는 사용자명)"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 pr-12 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500">
                {errorMessage}
              </p>
            )}

            <button 
              type="submit"
              className="
                w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </div>

          <div className="space-y-2 mt-6">
            <Link href="/reset-password" 
              className="block text-center text-black-100 text-sm hover:underline">
              비밀번호를 잊으셨나요?
            </Link>
            <div className="text-center">
              <TextButton
                href="/signup"
                variant="link"
                size="sm"
                className="block w-full"
              >
                계정이 없으신가요? 가입하기
              </TextButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

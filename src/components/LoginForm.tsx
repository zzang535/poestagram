"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 로그인 로직 구현
    useAuthStore.getState().login();
    router.push("/feed");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[375px] space-y-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="이메일"
              className="w-full px-4 py-3 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
              // required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full px-4 py-3 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
              // required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors"
          >
            로그인
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/find-password" className="text-blue-400 text-sm hover:underline">
            비밀번호를 잊으셨나요?
          </Link>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            계정이 없으신가요?
            <Link
              href="/signup"
              className="text-blue-400 font-medium hover:underline ml-1"
            >
              가입하기
            </Link>
          </p>
        </div>

        <div className="border-t border-gray-800 pt-6 mt-8">
          <div className="flex justify-center space-x-4 text-xs text-gray-400">
            <Link href="#" className="hover:underline">
              개인정보처리방침
            </Link>
            <span>•</span>
            <Link href="#" className="hover:underline">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

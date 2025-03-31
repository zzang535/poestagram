"use client";

import Link from "next/link";
import { useState } from "react";
import { sendVerificationEmail } from "@/api/auth";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendVerification = async () => {
    if (!email) {
      setMessage("이메일을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");
      const response = await sendVerificationEmail(email);
      setMessage(response.message);
    } catch (error) {
      setMessage("인증번호 전송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-[375px] space-y-6">
        <form className="space-y-4">
          <div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-[70%] 
                  px-4 
                  py-3 
                  border 
                  border-gray-700
                  rounded-lg 
                  text-sm 
                  focus:border-white 
                  focus:ring-white 
                  bg-gray-900 
                  text-white
                "
                required
              />
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={isLoading}
                className="
                  w-[30%] bg-red-800 text-white rounded-lg 
                  font-medium hover:bg-red-900 transition-colors 
                  disabled:bg-gray-700 disabled:cursor-not-allowed
                "
              >
                {isLoading ? "전송중..." : "전송"}
              </button>
            </div>
            {message && (
              <p className={`mt-2 text-sm ${message.includes("실패") ? "text-red-500" : "text-green-500"}`}>
                {message}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="인증번호 6자리 입력"
              className="w-[70%] px-4 py-3 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
              required
            />
            <button
              type="button"
              className="w-[30%] bg-red-800 text-white rounded-lg font-medium hover:bg-red-900 transition-colors"
            >
              인증하기
            </button>
          </div>

          <div>
            <input
              type="text"
              placeholder="닉네임"
              className="w-full px-4 py-3 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
              required
            />
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 border-gray-700 text-red-800 focus:ring-0 bg-gray-900"
                  required
                />
                <span className="text-sm text-gray-300">서비스 이용약관 동의</span>
              </label>
              <button type="button" className="text-gray-400">
                <i className="fas fa-chevron-right text-sm"></i>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 border-gray-700 text-red-800 focus:ring-0 bg-gray-900"
                  required
                />
                <span className="text-sm text-gray-300">개인정보 처리방침 동의</span>
              </label>
              <button type="button" className="text-gray-400">
                <i className="fas fa-chevron-right text-sm"></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors mt-8"
          >
            가입하기
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            이미 계정이 있으신가요?
            <Link
              href="/login"
              className="text-blue-400 font-medium hover:underline ml-1"
            >
              로그인 하기
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
} 
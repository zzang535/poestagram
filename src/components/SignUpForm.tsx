"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendVerificationEmail, verifyCode, signup } from "@/apis/auth";
import { useAuthStore } from '@/store/authStore';

// 메시지 유형 정의
type MessageType = "success" | "error" | "info";

// 메시지 인터페이스 정의
interface Message {
  text: string;
  type: MessageType;
}

export default function SignUpForm() {
  const router = useRouter();
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [termsOfService, setTermsOfService] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailMessage, setEmailMessage] = useState<Message | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<Message | null>(null);
  const [submitMessage, setSubmitMessage] = useState<Message | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  

  const handleSendVerification = async () => {
    if (!email) {
      setEmailMessage({ text: "이메일을 입력해주세요.", type: "info" });
      return;
    }

    try {
      setIsSending(true);
      setEmailMessage(null);
      const response = await sendVerificationEmail(email);
      setEmailMessage({ text: response.message, type: "success" });
    } catch (error) {
      setEmailMessage({ 
        text: error instanceof Error ? error.message : "인증번호 전송에 실패했습니다.", 
        type: "error" 
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setVerificationMessage({ text: "인증번호를 입력해주세요.", type: "info" });
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationMessage(null);
      const response = await verifyCode(email, verificationCode);
      console.log(response);
      if (response.is_verified) {
        setVerificationMessage({ text: "인증이 완료되었습니다.", type: "success" });
        setIsVerified(true);
      } else {
        setVerificationMessage({ text: "인증번호가 일치하지 않습니다.", type: "error" });
      }
    } catch (error) {
      setVerificationMessage({ 
        text: error instanceof Error ? error.message : "인증번호 검증에 실패했습니다.", 
        type: "error" 
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isVerified) {
      setSubmitMessage({ text: "이메일 인증이 필요합니다.", type: "error" });
      return;
    }

    if (!nickname) {
      setSubmitMessage({ text: "닉네임을 입력해주세요.", type: "info" });
      return;
    }

    if (!termsOfService || !privacyPolicy) {
      setSubmitMessage({ text: "이용약관과 개인정보 처리방침에 동의해주세요.", type: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage(null);
      
      const response = await signup({
        email,
        nickname,
        terms_of_service: termsOfService,
        privacy_policy: privacyPolicy
      });

      setSubmitMessage({ text: response.message, type: "success" });
      
      // 토큰 저장 및 로그인 상태 설정
      if (response.access_token) {
        try {
            // Zustand 스토어에 상태 저장
            setLoggedIn(true);
            setUser({
              id: response.user_id,
              email: email,
              nickname: nickname
            });
            setToken(response.access_token, response.token_type);
        } catch (error) {
          console.error("상태 저장 중 오류 발생:", error);
        }
        
        // 회원가입 성공 시 피드 페이지로 이동
        setTimeout(() => {
          router.push("/feed");
        }, 1500);
      } else {
        // 토큰이 없는 경우 로그인 페이지로 이동
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
      
    } catch (error) {
      setSubmitMessage({ 
        text: error instanceof Error ? error.message : "회원가입에 실패했습니다. 다시 시도해주세요.", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 메시지 유형에 따른 색상 결정 함수
  const getMessageColor = (type: MessageType): string => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "info":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            회원가입
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                  disabled:bg-gray-800
                  disabled:cursor-not-allowed
                "
                required
                disabled={isVerified}
              />
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={isSending || isVerified}
                className="
                  w-[30%] bg-red-800 text-white rounded-lg 
                  font-medium hover:bg-red-900 transition-colors 
                  disabled:bg-gray-700 disabled:cursor-not-allowed
                "
              >
                {isSending ? "전송중..." : isVerified ? "인증완료" : "전송"}
              </button>
            </div>
            {emailMessage && (
              <p className={`mt-2 text-sm ${getMessageColor(emailMessage.type)}`}>
                {emailMessage.text}
              </p>
            )}
          </div>

          <div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="인증번호 6자리 입력"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="w-[70%] px-4 py-3 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white disabled:bg-gray-800 disabled:cursor-not-allowed"
                required
                disabled={isVerified}
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={isVerifying || isVerified}
                className="w-[30%] bg-red-800 text-white rounded-lg font-medium hover:bg-red-900 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
              >
                {isVerifying ? "검증중..." : isVerified ? "인증완료" : "인증하기"}
              </button>
            </div>
            {verificationMessage && (
              <p className={`mt-2 text-sm ${getMessageColor(verificationMessage.type)}`}>
                {verificationMessage.text}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
              required
            />
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={termsOfService}
                  onChange={(e) => setTermsOfService(e.target.checked)}
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
                  checked={privacyPolicy}
                  onChange={(e) => setPrivacyPolicy(e.target.checked)}
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

          {submitMessage && (
            <p className={`text-sm ${getMessageColor(submitMessage.type)}`}>
              {submitMessage.text}
            </p>
          )}

          <button
            type="submit"
            disabled={!isVerified || isSubmitting}
            className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors mt-8 disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "가입중..." : "가입하기"}
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
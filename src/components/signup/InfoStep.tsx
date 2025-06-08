"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, login } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import PrivacyPolicyModal from "@/components/policy/PrivacyPolicyModal";
import TermsOfServiceModal from "@/components/policy/TermsOfServiceModal";

interface Message {
  text: string;
  type: "success" | "error" | "info";
}

interface InfoStepProps {
  email: string;
  username: string;
  password: string;
}

export default function InfoStep({ email, username, password }: InfoStepProps) {
  const router = useRouter();
  const [termsOfService, setTermsOfService] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<Message | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const getMessageColor = (type: string): string => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsOfService || !privacyPolicy) {
      setSubmitMessage({ text: "이용약관과 개인정보 처리방침에 동의해주세요.", type: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage(null);
      
      // 회원가입 API 호출
      await signup({
        email,
        username,
        password,
        terms_of_service: termsOfService,
        privacy_policy: privacyPolicy
      });

      // 회원가입 성공 후 바로 로그인 API 호출
      const loginResponse = await login(email, password);
      
      // 로그인 상태 설정
      useAuthStore.getState().login({
        access_token: loginResponse.access_token,
        user: {
          id: loginResponse.user_id,
          email: loginResponse.email,
          username: loginResponse.username,
        }
      });
      
      // 피드 페이지로 이동
      router.push("/feed");
      
    } catch (error) {
      setSubmitMessage({ 
        text: error instanceof Error ? error.message : "회원가입에 실패했습니다. 다시 시도해주세요.", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <p className="text-gray-400 text-center">마지막 단계입니다. 약관에 동의해주세요.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <label 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setIsTermsModalOpen(true)}
            >
              <input
                type="checkbox"
                checked={termsOfService}
                className="w-5 h-5 border-gray-700 text-red-800 focus:ring-0 bg-gray-900"
                required
                readOnly
              />
              <span className="text-sm text-gray-300">서비스 이용약관 동의</span>
            </label>
            <button 
              type="button" 
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsTermsModalOpen(true)}
            >
              확인하기
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setIsPrivacyModalOpen(true)}
            >
              <input
                type="checkbox"
                checked={privacyPolicy}
                className="w-5 h-5 border-gray-700 text-red-800 focus:ring-0 bg-gray-900"
                required
                readOnly
              />
              <span className="text-sm text-gray-300">개인정보 처리방침 동의</span>
            </label>
            <button 
              type="button" 
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsPrivacyModalOpen(true)}
            >
              확인하기
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
          disabled={isSubmitting}
          className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "가입 중..." : "가입하고 시작하기"}
        </button>
      </form>

      {/* 개인정보처리방침 모달 */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onAgree={() => setPrivacyPolicy(true)}
      />

      {/* 이용약관 모달 */}
      <TermsOfServiceModal 
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAgree={() => setTermsOfService(true)}
      />
    </>
  );
} 
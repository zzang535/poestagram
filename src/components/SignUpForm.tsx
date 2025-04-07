"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendVerificationEmail, verifyCode, signup, checkEmail, login } from "@/apis/auth";
import { useAuthStore } from "@/store/authStore";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import TermsOfServiceModal from "./TermsOfServiceModal";

// 메시지 유형 정의
type MessageType = "success" | "error" | "info";

// 메시지 인터페이스 정의
interface Message {
  text: string;
  type: MessageType;
}

export default function SignUpForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "verification" | "info">("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [nickname, setNickname] = useState("");
  const [termsOfService, setTermsOfService] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailMessage, setEmailMessage] = useState<Message | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<Message | null>(null);
  const [submitMessage, setSubmitMessage] = useState<Message | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  useEffect(() => {
    if (step === "verification" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const handleVerificationInput = (index: number, value: string) => {
    if (value.length === 1 && index < 5) {
      const nextInput = document.querySelector(`input[name="verification-${index + 1}"]`) as HTMLInputElement;
      nextInput?.focus();
    }
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
  };

  const handleVerificationKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="verification-${index - 1}"]`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSendVerification = async () => {
    if (!email) {
      setEmailMessage({ text: "이메일을 입력해주세요.", type: "error" });
      return;
    }

    setIsSending(true);
    setEmailMessage(null);

    try {
      // 먼저 이메일 중복 체크
      const checkResult = await checkEmail(email);
      if (checkResult.exists) {
        setEmailMessage({ text: "이미 가입된 이메일입니다. 로그인을 진행해주세요.", type: "error" });
        return;
      }

      // 이메일이 중복되지 않으면 인증 코드 전송
      await sendVerificationEmail(email);
      setEmailMessage({ text: "인증번호가 이메일로 전송되었습니다.", type: "success" });
      setStep("verification");
      setTimeLeft(180); // 타이머 리셋
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
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setVerificationMessage({ text: "6자리 인증번호를 모두 입력해주세요.", type: "error" });
      return;
    }

    setIsVerifying(true);
    setVerificationMessage(null);

    try {
      const response = await verifyCode(email, code);
      if (response.is_verified) {
        setVerificationMessage({ text: "인증이 완료되었습니다.", type: "success" });
        setIsVerified(true);
        setStep("info");
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
      setSubmitMessage({ text: "닉네임을 입력해주세요.", type: "error" });
      return;
    }

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
        nickname,
        terms_of_service: termsOfService,
        privacy_policy: privacyPolicy
      });

      // 회원가입 성공 후 바로 로그인 API 호출
      const loginResponse = await login(email);
      
      // 로그인 상태 설정
      useAuthStore.getState().login({
        access_token: loginResponse.access_token,
        user: {
          id: loginResponse.user_id,
          email: loginResponse.email,
          nickname: loginResponse.nickname
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

  const handleBackToEmail = () => {
    // step1으로 돌아갈 때 상태 초기화
    setEmail("");
    setEmailMessage(null);
    setVerificationCode(["", "", "", "", "", ""]);
    setVerificationMessage(null);
    setTimeLeft(180);
    setStep("email");
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
    <div className="w-full mx-auto min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-[400px] space-y-6">
        {step === "email" && (
          <>
            <p className="text-gray-400 text-center">회원가입할 이메일 주소를 입력해 주세요</p>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
                  placeholder="이메일 주소"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {emailMessage && (
                <p className={`text-sm ${getMessageColor(emailMessage.type)}`}>
                  {emailMessage.text}
                </p>
              )}
              <button 
                className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                onClick={handleSendVerification}
                disabled={isSending}
              >
                {isSending ? "전송 중..." : "인증코드 받기"}
              </button>
              <Link href="/login" className="block text-center text-blue-400 text-sm hover:underline">
                이미 계정이 있으신가요? 로그인하기
              </Link>
            </div>
          </>
        )}

        {step === "verification" && (
          <>
            <p className="text-gray-400 text-center">이메일로 전송된 6자리 인증코드를 입력해 주세요</p>
            <div className="space-y-4">
              <div className="flex gap-2 justify-center mb-4">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    name={`verification-${index}`}
                    className="w-12 h-12 text-center border border-gray-700 rounded-lg focus:border-white focus:ring-white bg-gray-900 text-white text-xl"
                    value={digit}
                    onChange={(e) => handleVerificationInput(index, e.target.value)}
                    onKeyDown={(e) => handleVerificationKeyDown(index, e)}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400">
                  남은 시간: <span className="text-red-800">{formatTime(timeLeft)}</span>
                </span>
              </div>
              {verificationMessage && (
                <p className={`text-sm ${getMessageColor(verificationMessage.type)}`}>
                  {verificationMessage.text}
                </p>
              )}
              <button 
                className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                onClick={handleVerifyCode}
                disabled={isVerifying}
              >
                {isVerifying ? "확인 중..." : "인증하기"}
              </button>
              <button 
                className="w-full text-gray-400 py-2 hover:text-white transition-colors"
                onClick={handleBackToEmail}
              >
                이메일 다시 입력하기
              </button>
            </div>
          </>
        )}

        {step === "info" && (
          <>
            <p className="text-gray-400 text-center">회원 정보를 입력해 주세요</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                {isSubmitting ? "가입 중..." : "가입하기"}
              </button>
            </form>
          </>
        )}
      </div>

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
    </div>
  );
} 
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { sendVerificationEmail, verifyCode, checkEmail, login } from "@/apis/auth";

export default function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "verification">("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

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
      setEmailMessage({ type: 'error', text: '이메일을 입력해주세요.' });
      return;
    }

    setIsSending(true);
    setEmailMessage(null);

    try {
      // 먼저 이메일 체크
      const checkResult = await checkEmail(email);
      if (!checkResult.exists) {
        setEmailMessage({ type: 'error', text: '등록되지 않은 이메일입니다. 회원가입을 진행해주세요.' });
        return;
      }

      // 이메일이 존재하면 인증 코드 전송
      await sendVerificationEmail(email);
      setEmailMessage({ type: 'success', text: '인증번호가 이메일로 전송되었습니다.' });
      setStep("verification");
      setTimeLeft(180); // 타이머 리셋
    } catch (error) {
      setEmailMessage({ type: 'error', text: error instanceof Error ? error.message : '인증번호 전송에 실패했습니다.' });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setVerificationMessage({ type: 'error', text: '6자리 인증번호를 모두 입력해주세요.' });
      return;
    }

    setIsVerifying(true);
    setVerificationMessage(null);

    try {
      const response = await verifyCode(email, code);
      if (response.is_verified) {
        // 인증이 완료되면 로그인 API 호출
        const loginResponse = await login(email);
        useAuthStore.getState().login({
          access_token: loginResponse.access_token,
          user: {
            id: loginResponse.user_id,
            email: loginResponse.email,
            nickname: loginResponse.nickname
          }
        });
        router.push("/feed");
      } else {
        setVerificationMessage({ type: 'error', text: response.message || '인증에 실패했습니다.' });
      }
    } catch (error) {
      setVerificationMessage({ type: 'error', text: error instanceof Error ? error.message : '인증에 실패했습니다.' });
    } finally {
      setIsVerifying(false);
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

  return (
    <div className="w-full mx-auto min-h-screen flex items-center justify-center px-5">
      {/* 전체 박스 */}
      
      <div className="w-full max-w-[400px] space-y-6">
        {/* content box */}
        {step === "email" && (
          <>
            <p className="text-gray-400 text-center">가입하신 이메일 주소를 입력해 주세요</p>
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
                <p className={`text-sm ${emailMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
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
              <Link href="/signup" className="block text-center text-blue-400 text-sm hover:underline">
                계정이 없으신가요? 가입하기
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
                <p className={`text-sm ${verificationMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                  {verificationMessage.text}
                </p>
              )}
              <button 
                className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                onClick={handleVerifyCode}
                disabled={isVerifying}
              >
                {isVerifying ? "확인 중..." : "로그인"}
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

      </div>
    </div>
  );
}

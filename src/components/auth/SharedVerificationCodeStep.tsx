"use client";

import { useState, useEffect } from "react";
import { verifyCode, sendVerificationEmail } from "@/apis/auth";

interface Message {
  text: string;
  type: "success" | "error" | "info";
}

interface SharedVerificationCodeStepProps {
  email: string;
  onNext: (code: string) => void; // SignUpForm에서는 code를 사용하지 않음
  onBack: () => void;
}

export default function SharedVerificationCodeStep({ email, onNext, onBack }: SharedVerificationCodeStepProps) {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const getMessageColor = (type: string): string => {
    switch (type) {
      case "success": return "text-green-500";
      case "error": return "text-red-500";
      case "info": return "text-blue-400";
      default: return "text-gray-400";
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

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
        onNext(code); // ResetPasswordForm에서는 code를 사용, SignUpForm에서는 사용 안 함
      } else {
        setVerificationMessage({ text: response.message || "인증번호가 일치하지 않습니다.", type: "error" });
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

  const handleResendCode = async () => {
    setIsResending(true);
    setVerificationMessage(null);
    try {
      await sendVerificationEmail(email); // 공용 API 사용
      setVerificationMessage({ text: "인증번호가 재전송되었습니다.", type: "info"});
      setTimeLeft(180);
    } catch (error) {
      setVerificationMessage({ text: "인증번호 재전송에 실패했습니다.", type: "error"});
    } finally {
      setIsResending(false);
    }
  };

  return (
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
          <span className={`text-sm ${timeLeft === 0 ? 'text-red-500' : 'text-gray-400'}`}>
            남은 시간: <span className={timeLeft === 0 ? '' : 'text-red-800'}>{formatTime(timeLeft)}</span>
          </span>
          <button 
            className="text-sm text-blue-400 hover:underline disabled:text-gray-500 disabled:no-underline"
            onClick={handleResendCode}
            disabled={isResending || timeLeft > 0}
          >
            {isResending ? "재전송 중..." : "인증코드 재전송"}
          </button>
        </div>
        {verificationMessage && (
          <p className={`text-sm ${getMessageColor(verificationMessage.type)}`}>
            {verificationMessage.text}
          </p>
        )}
        <button 
          className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
          onClick={handleVerifyCode}
          disabled={isVerifying || verificationCode.join('').length !== 6}
        >
          {isVerifying ? "확인 중..." : "인증하기"}
        </button>
        <button 
          className="w-full text-gray-400 py-2 hover:text-white transition-colors"
          onClick={onBack}
        >
          이메일 다시 입력하기
        </button>
      </div>
    </>
  );
} 
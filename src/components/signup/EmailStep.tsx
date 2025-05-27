"use client";

import { useState } from "react";
import Link from "next/link";
import { checkEmail, sendVerificationEmail } from "@/apis/auth";

interface Message {
  text: string;
  type: "success" | "error" | "info";
}

interface EmailStepProps {
  onNext: (email: string) => void;
}

export default function EmailStep({ onNext }: EmailStepProps) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emailMessage, setEmailMessage] = useState<Message | null>(null);

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
      onNext(email);
    } catch (error) {
      setEmailMessage({ 
        text: error instanceof Error ? error.message : "인증번호 전송에 실패했습니다.", 
        type: "error" 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
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
  );
} 
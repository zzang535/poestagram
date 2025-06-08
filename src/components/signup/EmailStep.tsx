"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { checkEmail, sendVerificationEmail } from "@/services/auth";

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

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSendVerification = async () => {
    if (!email) {
      setEmailMessage({ text: "이메일 주소를 입력해 주시면 돼요.", type: "error" });
      return;
    }

    if (!validateEmail(email)) {
      setEmailMessage({ text: "올바른 이메일 형식으로 입력해 주세요.", type: "error" });
      return;
    }

    setIsSending(true);
    setEmailMessage(null);

    try {
      // 먼저 이메일 중복 체크
      const checkResult = await checkEmail(email);
      if (checkResult.exists) {
        setEmailMessage({ text: "이미 가입하신 이메일이에요. 로그인 페이지로 이동해 보세요!", type: "error" });
        return;
      }

      // 이메일이 중복되지 않으면 인증 코드 전송
      await sendVerificationEmail(email);
      setEmailMessage({ text: "인증번호를 이메일로 보내드렸어요!", type: "success" });
      onNext(email);
    } catch (error: any) {
      // 서버에서 오는 validation 에러 처리
      if (error?.response?.data?.detail && Array.isArray(error.response.data.detail)) {
        const detail = error.response.data.detail;
        
        // 이메일 형식 에러 확인
        const emailError = detail.find((d: any) => d.loc?.includes("email"));
        if (emailError) {
          setEmailMessage({ text: "올바른 이메일 형식으로 입력해 주세요.", type: "error" });
          return;
        }
        
        // 다른 validation 에러가 있는 경우
        if (detail.length > 0) {
          setEmailMessage({ text: detail[0].msg || "입력 정보를 확인해 주세요.", type: "error" });
          return;
        }
      }
      
      // 서버에서 오는 단일 에러 메시지 처리
      if (error?.response?.data?.message) {
        setEmailMessage({ text: error.response.data.message, type: "error" });
        return;
      }
      
      // 네트워크 에러나 기타 에러 처리
      if (error?.message) {
        setEmailMessage({ text: error.message, type: "error" });
        return;
      }
      
      // 알 수 없는 에러
      setEmailMessage({ 
        text: "잠시 전송이 어려워요. 다시 시도해 주세요.", 
        type: "error" 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <p className="text-gray-400 text-center">이메일 주소를 입력해 주세요</p>
      <div className="space-y-4">
        <Input
          label="이메일 주소"
            type="email"
          placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        {emailMessage && (
          <p className={`text-sm ${getMessageColor(emailMessage.type)}`}>
            {emailMessage.text}
          </p>
        )}
        <Button
          onClick={handleSendVerification}
          disabled={!email || !validateEmail(email)}
          loading={isSending}
          loadingText="전송 중..."
        >
          인증번호 받기
        </Button>
        <Link href="/login" className="block text-center text-blue-400 text-sm hover:underline">
          이미 계정이 있으시다면 로그인해 보세요
        </Link>
      </div>
    </>
  );
} 
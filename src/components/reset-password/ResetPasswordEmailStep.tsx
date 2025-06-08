"use client";

import { useState } from "react";
import Link from "next/link";
import { sendVerificationEmail, checkEmail } from "@/services/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Message {
  text: string;
  type: "success" | "error" | "info";
}

interface ResetPasswordEmailStepProps {
  onNext: (email: string) => void;
}

export default function ResetPasswordEmailStep({ onNext }: ResetPasswordEmailStepProps) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emailMessage, setEmailMessage] = useState<Message | null>(null);

  const getMessageColor = (type: string): string => {
    switch (type) {
      case "success": return "text-green-500";
      case "error": return "text-red-500";
      case "info": return "text-blue-400";
      default: return "text-gray-400";
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
      // 먼저 이메일 존재 여부 확인
      const checkResult = await checkEmail(email);
      if (!checkResult.exists) {
        setEmailMessage({ text: "등록되지 않은 이메일입니다.", type: "error" });
        setIsSending(false);
        return;
      }

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
      <p className="text-gray-400 text-center">가입하신 이메일 주소를 입력해 주세요</p>
      <div className="space-y-4">
        <Input
          label="이메일 주소"
            type="email"
            placeholder="이메일 주소"
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
          loading={isSending}
          loadingText="전송 중..."
        >
          인증번호 받기
        </Button>

        <Link href="/login" className="block text-center text-blue-400 text-sm hover:underline">
          로그인으로 돌아가기
        </Link>
      </div>
    </>
  );
} 
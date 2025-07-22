"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { checkEmail, sendVerificationEmail } from "@/services/auth";

interface Message {
  text: string;
  type: "success" | "error" | "info";
}

interface EmailStepProps {
  onNext: (email: string) => void;
}

export default function EmailStep({ onNext }: EmailStepProps) {
  const t = useTranslations('signup.email');
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
      setEmailMessage({ text: t('errors.required'), type: "error" });
      return;
    }

    if (!validateEmail(email)) {
      setEmailMessage({ text: t('errors.invalid'), type: "error" });
      return;
    }

    setIsSending(true);
    setEmailMessage(null);

    try {
      // 먼저 이메일 중복 체크
      const checkResult = await checkEmail(email);
      if (checkResult.exists) {
        setEmailMessage({ text: t('errors.exists'), type: "error" });
        return;
      }

      // 이메일이 중복되지 않으면 인증 코드 전송
      await sendVerificationEmail(email);
      setEmailMessage({ text: t('success'), type: "success" });
      onNext(email);
    } catch (error: any) {
      // 서버에서 오는 에러 처리
      setEmailMessage({ 
        text: error.message, 
        type: "error" 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <p className="text-gray-400 text-center">{t('title')}</p>
      <div className="space-y-4">
        <Input
          label={t('label')}
          type="email"
          placeholder={t('placeholder')}
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
          disabled={!email}
          loading={isSending}
          loadingText={t('sending')}
        >
          {t('sendButton')}
        </Button>
        <Link href="/login" className="block text-center text-blue-400 text-sm hover:underline">
          {t('hasAccount')}
        </Link>
      </div>
    </>
  );
} 
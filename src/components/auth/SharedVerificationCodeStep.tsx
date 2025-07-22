"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { verifyCode, sendVerificationEmail } from "@/services/auth";
import Button from "@/components/ui/Button";
import TextButton from "@/components/ui/TextButton";
import Input from "@/components/ui/Input";

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
  const t = useTranslations('verification');
  const [verificationCode, setVerificationCode] = useState("");
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

  const handleVerificationInput = (value: string) => {
    // 숫자만 입력되도록 필터링하고 최대 6자리까지만 허용
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(numericValue);
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setVerificationMessage({ text: t('errors.incomplete'), type: "error" });
      return;
    }
    setIsVerifying(true);
    setVerificationMessage(null);
    try {
      const response = await verifyCode(email, verificationCode);
      if (response.is_verified) {
        setVerificationMessage({ text: t('success'), type: "success" });
        onNext(verificationCode); // ResetPasswordForm에서는 code를 사용, SignUpForm에서는 사용 안 함
      } else {
        setVerificationMessage({ text: response.message || t('errors.invalid'), type: "error" });
      }
    } catch (error) {
      setVerificationMessage({ 
        text: error instanceof Error ? error.message : t('errors.verifyFailed'), 
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
      setVerificationMessage({ text: t('resendSuccess'), type: "info"});
      setTimeLeft(180);
    } catch (error) {
      setVerificationMessage({ text: t('errors.resendFailed'), type: "error"});
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <p className="text-gray-400 text-center">{t('title')}</p>
      <div className="space-y-4">
        <div className="mb-4">
          <Input
            label={t('label')}
            type="text"
            placeholder={t('placeholder')}
            value={verificationCode}
            onChange={(e) => handleVerificationInput(e.target.value)}
            className="text-lg tracking-widest"
          />
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className={`text-sm ${timeLeft === 0 ? 'text-red-500' : 'text-gray-400'}`}>
            {t('timeLeft')} <span className={timeLeft === 0 ? '' : 'text-red-800'}>{formatTime(timeLeft)}</span>
          </span>
          <TextButton
            onClick={handleResendCode}
            disabled={isResending}
            variant="link"
            size="sm"
          >
            {isResending ? t('resending') : t('resendButton')}
          </TextButton>
        </div>
        {verificationMessage && (
          <p className={`text-sm ${getMessageColor(verificationMessage.type)}`}>
            {verificationMessage.text}
          </p>
        )}
        <Button
          onClick={handleVerifyCode}
          disabled={verificationCode.length !== 6}
          loading={isVerifying}
          loadingText={t('verifying')}
        >
          {t('verifyButton')}
        </Button>
        <TextButton
          onClick={onBack}
          variant="default"
          className="w-full py-2"
        >
          {t('backButton')}
        </TextButton>
      </div>
    </>
  );
} 
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Message {
  text: string;
  type: "success" | "error" | "info";
}

interface PasswordStepProps {
  onNext: (password: string) => void;
}

export default function PasswordStep({ onNext }: PasswordStepProps) {
  const t = useTranslations('signup.password');
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);

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

  const validatePassword = (value: string): boolean => {
    // 최소 8자, 영문, 숫자, 특수문자 포함
    return value.length >= 8 && 
           /[a-zA-Z]/.test(value) && 
           /\d/.test(value) && 
           /[!@#$%^&*(),.?":{}|<>]/.test(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length === 0) {
      setPasswordMessage(null);
      return;
    }

    if (value.length < 8) {
      setPasswordMessage({ text: t('errors.tooShort'), type: "error" });
    } else if (!/[a-zA-Z]/.test(value)) {
      setPasswordMessage({ text: t('errors.noLetter'), type: "error" });
    } else if (!/\d/.test(value)) {
      setPasswordMessage({ text: t('errors.noNumber'), type: "error" });
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setPasswordMessage({ text: t('errors.noSpecial'), type: "error" });
    } else {
      setPasswordMessage({ text: t('success'), type: "success" });
    }
  };

  const handleNext = () => {
    if (!password) {
      setPasswordMessage({ text: t('errors.required'), type: "error" });
      return;
    }

    if (!validatePassword(password)) {
      setPasswordMessage({ text: t('errors.invalid'), type: "error" });
      return;
    }

    onNext(password);
  };

  return (
    <>
      <p className="text-gray-400 text-center">{t('title')}</p>
      <div className="space-y-4">
        <Input
          label={t('label')}
          type="password"
          placeholder={t('placeholder')}
          value={password}
          onChange={handlePasswordChange}
          showPasswordToggle={true}
          isValid={passwordMessage?.type === "success"}
        />

        {passwordMessage && (
          <p className={`text-sm ${getMessageColor(passwordMessage.type)}`}>
            {passwordMessage.text}
          </p>
        )}

        <Button
          onClick={handleNext}
          disabled={!password || !validatePassword(password)}
        >
          {t('nextButton')}
        </Button>
      </div>
    </>
  );
} 
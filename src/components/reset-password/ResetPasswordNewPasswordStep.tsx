"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { resetPasswordApi, login } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Message {
  text: string;
  type: "success" | "error" | "info";
}

interface ResetPasswordNewPasswordStepProps {
  email: string;
  code: string;
}

export default function ResetPasswordNewPasswordStep({ email, code }: ResetPasswordNewPasswordStepProps) {
  const router = useRouter();
  const t = useTranslations('resetPassword.newPassword');
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMessageColor = (type: string): string => {
    switch (type) {
      case "success": return "text-green-500";
      case "error": return "text-red-500";
      case "info": return "text-blue-400";
      default: return "text-gray-400";
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
    setNewPassword(value);

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

  const handleSubmit = async () => {
    if (!newPassword) {
      setPasswordMessage({ text: t('errors.required'), type: "error" });
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordMessage({ text: t('errors.invalid'), type: "error" });
      return;
    }

    setIsSubmitting(true);
    setPasswordMessage(null);

    try {
      await resetPasswordApi({ email, code, new_password: newPassword });
      
      // 비밀번호 변경 성공 후 자동 로그인
      const loginResponse = await login(email, newPassword);
      useAuthStore.getState().login({
        access_token: loginResponse.access_token,
        user: {
          id: loginResponse.user_id,
          email: loginResponse.email,
          username: loginResponse.username,
          profile_image_url: loginResponse.profile_image_url,
        }
      });
      router.push("/feed"); 
    } catch (error) {
      setPasswordMessage({ 
        text: error instanceof Error ? error.message : t('errors.changeFailed'), 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <p className="text-gray-400 text-center">{t('title')}</p>
      <div className="space-y-4">
        <Input
          label={t('label')}
          type="password"
          placeholder={t('placeholder')}
          value={newPassword}
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
          onClick={handleSubmit}
          loading={isSubmitting}
          loadingText={t('changing')}
          disabled={!newPassword || !validatePassword(newPassword)}
        >
          {t('completeButton')}
        </Button>
      </div>
    </>
  );
} 
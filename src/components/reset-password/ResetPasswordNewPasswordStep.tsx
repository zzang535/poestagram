"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordApi, login } from "@/apis/auth";
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
      setPasswordMessage({ text: "8자리 이상 입력해 주세요.", type: "error" });
    } else if (!/[a-zA-Z]/.test(value)) {
      setPasswordMessage({ text: "영문을 포함해 주세요.", type: "error" });
    } else if (!/\d/.test(value)) {
      setPasswordMessage({ text: "숫자를 포함해 주세요.", type: "error" });
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setPasswordMessage({ text: "특수문자를 포함해 주세요.", type: "error" });
    } else {
      setPasswordMessage({ text: "안전한 비밀번호예요!", type: "success" });
    }
  };

  const handleSubmit = async () => {
    if (!newPassword) {
      setPasswordMessage({ text: "새 비밀번호를 입력해 주세요.", type: "error" });
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordMessage({ text: "비밀번호 조건을 확인해 주세요.", type: "error" });
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
        text: error instanceof Error ? error.message : "비밀번호 변경에 실패했습니다.", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <p className="text-gray-400 text-center">새로운 비밀번호를 만들어 주세요</p>
      <div className="space-y-4">
        <Input
          label="새 비밀번호"
          type="password"
          placeholder="8자리 이상, 영문+숫자+특수문자"
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
          loadingText="변경 중..."
          disabled={!newPassword || !validatePassword(newPassword)}
        >
          완료
        </Button>
      </div>
    </>
  );
} 
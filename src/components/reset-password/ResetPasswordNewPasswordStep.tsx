"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordApi, login } from "@/apis/auth";
import { useAuthStore } from "@/store/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<Message | null>(null);
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    if (!validatePassword(value) && value.length > 0) {
      setPasswordMessage({ text: "비밀번호는 8자 이상, 대/소문자, 숫자, 특수문자를 포함해야 합니다.", type: "error" });
    } else {
      setPasswordMessage(null);
    }
    if (confirmPassword && value !== confirmPassword) {
      setConfirmMessage({ text: "비밀번호가 일치하지 않습니다.", type: "error" });
    } else if (confirmPassword && value === confirmPassword) {
      setConfirmMessage({ text: "비밀번호가 일치합니다.", type: "success" });
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== newPassword && value.length > 0) {
      setConfirmMessage({ text: "비밀번호가 일치하지 않습니다.", type: "error" });
    } else if (value === newPassword && value.length > 0) {
      setConfirmMessage({ text: "비밀번호가 일치합니다.", type: "success" });
    } else {
      setConfirmMessage(null);
    }
  };

  const handleSubmit = async () => {
    if (!validatePassword(newPassword)) {
      setPasswordMessage({ text: "유효한 비밀번호를 입력해주세요.", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmMessage({ text: "비밀번호가 일치하지 않습니다.", type: "error" });
      return;
    }
    setIsSubmitting(true);
    setPasswordMessage(null);
    setConfirmMessage(null);
    try {
      await resetPasswordApi({ email, code, new_password: newPassword });
      // 비밀번호 변경 성공 후 자동 로그인
      const loginResponse = await login(email, newPassword); // username 대신 email 사용
      useAuthStore.getState().login({
        access_token: loginResponse.access_token,
        user: {
          id: loginResponse.user_id,
          email: loginResponse.email,
          username: loginResponse.username,
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
      <p className="text-gray-400 text-center">새로운 비밀번호를 설정해 주세요</p>
      <div className="space-y-4">
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            className="w-full px-4 py-3 pr-12 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
            <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full px-4 py-3 pr-12 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 최소 8자리 이상</p>
          <p>• 대문자, 소문자, 숫자, 특수문자(@$!%*?&) 각각 1개 이상</p>
        </div>
        {passwordMessage && <p className={`text-sm ${getMessageColor(passwordMessage.type)}`}>{passwordMessage.text}</p>}
        {confirmMessage && <p className={`text-sm ${getMessageColor(confirmMessage.type)}`}>{confirmMessage.text}</p>}
        <button 
          className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isSubmitting || !validatePassword(newPassword) || newPassword !== confirmPassword}
        >
          {isSubmitting ? "변경 중..." : "확인"}
        </button>
      </div>
    </>
  );
} 
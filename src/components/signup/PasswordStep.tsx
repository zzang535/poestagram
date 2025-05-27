"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface Message {
  text: string;
  type: "success" | "error" | "info";
}

interface PasswordStepProps {
  onNext: (password: string) => void;
}

export default function PasswordStep({ onNext }: PasswordStepProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<Message | null>(null);

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
    // 최소 8자, 대문자 1개, 소문자 1개, 숫자 1개, 특수문자 1개
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(value);
  };

  const getPasswordStrength = (value: string): { strength: string; color: string } => {
    if (value.length === 0) return { strength: "", color: "" };
    
    let score = 0;
    
    // 길이 체크
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    
    // 문자 종류 체크
    if (/[a-z]/.test(value)) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[@$!%*?&]/.test(value)) score++;
    
    if (score <= 2) return { strength: "약함", color: "text-red-500" };
    if (score <= 4) return { strength: "보통", color: "text-yellow-500" };
    return { strength: "강함", color: "text-green-500" };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length === 0) {
      setPasswordMessage(null);
      return;
    }

    if (value.length < 8) {
      setPasswordMessage({ text: "비밀번호는 8자리 이상이어야 합니다.", type: "error" });
    } else if (!/(?=.*[a-z])/.test(value)) {
      setPasswordMessage({ text: "소문자를 포함해야 합니다.", type: "error" });
    } else if (!/(?=.*[A-Z])/.test(value)) {
      setPasswordMessage({ text: "대문자를 포함해야 합니다.", type: "error" });
    } else if (!/(?=.*\d)/.test(value)) {
      setPasswordMessage({ text: "숫자를 포함해야 합니다.", type: "error" });
    } else if (!/(?=.*[@$!%*?&])/.test(value)) {
      setPasswordMessage({ text: "특수문자(@$!%*?&)를 포함해야 합니다.", type: "error" });
    } else if (validatePassword(value)) {
      const { strength, color } = getPasswordStrength(value);
      setPasswordMessage({ text: `비밀번호 강도: ${strength}`, type: "success" });
    }

    // 비밀번호 확인 재검증
    if (confirmPassword && value !== confirmPassword) {
      setConfirmMessage({ text: "비밀번호가 일치하지 않습니다.", type: "error" });
    } else if (confirmPassword && value === confirmPassword) {
      setConfirmMessage({ text: "비밀번호가 일치합니다.", type: "success" });
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value.length === 0) {
      setConfirmMessage(null);
      return;
    }

    if (value !== password) {
      setConfirmMessage({ text: "비밀번호가 일치하지 않습니다.", type: "error" });
    } else {
      setConfirmMessage({ text: "비밀번호가 일치합니다.", type: "success" });
    }
  };

  const handleNext = () => {
    if (!password) {
      setPasswordMessage({ text: "비밀번호를 입력해주세요.", type: "error" });
      return;
    }

    if (!validatePassword(password)) {
      setPasswordMessage({ text: "올바른 비밀번호를 입력해주세요.", type: "error" });
      return;
    }

    if (!confirmPassword) {
      setConfirmMessage({ text: "비밀번호 확인을 입력해주세요.", type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setConfirmMessage({ text: "비밀번호가 일치하지 않습니다.", type: "error" });
      return;
    }

    onNext(password);
  };

  return (
    <>
      <p className="text-gray-400 text-center">비밀번호를 설정해 주세요</p>
      <div className="space-y-4">
        {/* 비밀번호 입력 */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 pr-12 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
            placeholder="비밀번호"
            value={password}
            onChange={handlePasswordChange}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        {/* 비밀번호 확인 입력 */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full px-4 py-3 pr-12 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 최소 8자리 이상</p>
          <p>• 대문자, 소문자, 숫자, 특수문자(@$!%*?&) 각각 1개 이상</p>
        </div>

        {passwordMessage && (
          <p className={`text-sm ${getMessageColor(passwordMessage.type)}`}>
            {passwordMessage.text}
          </p>
        )}

        {confirmMessage && (
          <p className={`text-sm ${getMessageColor(confirmMessage.type)}`}>
            {confirmMessage.text}
          </p>
        )}
        
        <button 
          className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={!password || !confirmPassword || !validatePassword(password) || password !== confirmPassword}
        >
          다음
        </button>
      </div>
    </>
  );
} 
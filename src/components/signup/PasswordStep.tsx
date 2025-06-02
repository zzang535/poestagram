"use client";

import { useState } from "react";
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

  const handleNext = () => {
    if (!password) {
      setPasswordMessage({ text: "비밀번호를 입력해 주세요.", type: "error" });
      return;
    }

    if (!validatePassword(password)) {
      setPasswordMessage({ text: "비밀번호 조건을 확인해 주세요.", type: "error" });
      return;
    }

    onNext(password);
  };

  return (
    <>
      <p className="text-gray-400 text-center">안전한 비밀번호를 만들어 주세요</p>
      <div className="space-y-4">
        <Input
          label="비밀번호"
          type="password"
          placeholder="8자리 이상, 영문+숫자+특수문자"
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
          다음
        </Button>
      </div>
    </>
  );
} 
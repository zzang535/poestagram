"use client";

import { useState } from "react";
import { checkUsername } from "@/apis/auth";

interface Message {
  text: string;
  type: "success" | "error" | "info";
}

interface UsernameStepProps {
  onNext: (username: string) => void;
}

export default function UsernameStep({ onNext }: UsernameStepProps) {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState<Message | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

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

  const validateUsername = (value: string): boolean => {
    // 영문소문자, 숫자 만 허용, 4-20글자
    const usernameRegex = /^[a-z0-9]{4,20}$/;
    return usernameRegex.test(value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setIsValidated(false);

    if (value.length === 0) {
      setUsernameMessage(null);
      return;
    }

    if (value.length < 4) {
      setUsernameMessage({ text: "사용자명은 4글자 이상이어야 합니다.", type: "error" });
    } else if (value.length > 20) {
      setUsernameMessage({ text: "사용자명은 20글자 이하여야 합니다.", type: "error" });
    } else if (!/^[a-z0-9]*$/.test(value)) {
      setUsernameMessage({ text: "영문 소문자와 숫자만 사용할 수 있습니다.", type: "error" });
    } else if (validateUsername(value)) {
      setUsernameMessage({ text: "형식이 올바릅니다.", type: "info" });
    } else {
      // validateUsername(value)가 false인 경우는 정규식은 통과했으나 길이가 맞지 않는 경우인데,
      // 위에서 길이 체크를 이미 했으므로 이 경우는 발생하지 않아야 함.
      // 하지만 방어적으로 메시지 초기화
      setUsernameMessage(null);
    }
  };

  const handleNext = async () => {
    if (!username) {
      setUsernameMessage({ text: "사용자명을 입력해주세요.", type: "error" });
      return;
    }

    if (!validateUsername(username)) {
      setUsernameMessage({ text: "올바른 사용자명을 입력해주세요.", type: "error" });
      return;
    }

    // 이미 검증된 경우 바로 다음 단계로
    if (isValidated) {
      onNext(username);
      return;
    }

    // 중복 확인 진행
    setIsChecking(true);
    setUsernameMessage(null);

    try {
      const checkResult = await checkUsername(username);
      if (checkResult.exists) {
        setUsernameMessage({ text: "이미 사용 중인 사용자명입니다.", type: "error" });
        setIsValidated(false);
      } else {
        setUsernameMessage({ text: "사용 가능한 사용자명입니다.", type: "success" });
        setIsValidated(true);
        // 중복 확인 성공 시 바로 다음 단계로
        onNext(username);
      }
    } catch (error) {
      setUsernameMessage({ 
        text: error instanceof Error ? error.message : "사용자명 중복 확인에 실패했습니다.", 
        type: "error" 
      });
      setIsValidated(false);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <p className="text-gray-400 text-center">사용자명을 입력해 주세요</p>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
            placeholder="사용자명 (영문소문자, 숫자 허용, 4-20글자)"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 영문 소문자와 숫자만 사용 가능</p>
          <p>• 4글자 이상 20글자 이하</p>
        </div>

        {usernameMessage && (
          <p className={`text-sm ${getMessageColor(usernameMessage.type)}`}>
            {usernameMessage.text}
          </p>
        )}
        
        <button 
          className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={!username || !validateUsername(username) || isChecking}
        >
          {isChecking ? "확인 중..." : isValidated ? "다음" : "중복 확인 후 다음"}
        </button>
      </div>
    </>
  );
} 
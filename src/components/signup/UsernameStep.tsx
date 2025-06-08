"use client";

import { useState } from "react";
import { checkUsername } from "@/services/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
      setUsernameMessage({ text: "조금 더 길게 작성해 주세요. 4글자 이상이면 좋겠어요.", type: "error" });
    } else if (value.length > 20) {
      setUsernameMessage({ text: "조금 더 짧게 작성해 주세요. 20글자 이하면 좋겠어요.", type: "error" });
    } else if (!/^[a-z0-9]*$/.test(value)) {
      setUsernameMessage({ text: "영문 소문자와 숫자만 사용해 주세요.", type: "error" });
    } else if (validateUsername(value)) {
      setUsernameMessage({ text: "좋은 사용자 이름이네요!", type: "info" });
    } else {
      // validateUsername(value)가 false인 경우는 정규식은 통과했으나 길이가 맞지 않는 경우인데,
      // 위에서 길이 체크를 이미 했으므로 이 경우는 발생하지 않아야 함.
      // 하지만 방어적으로 메시지 초기화
      setUsernameMessage(null);
    }
  };

  const handleNext = async () => {
    if (!username) {
      setUsernameMessage({ text: "사용자 이름을 입력해 주세요.", type: "error" });
      return;
    }

    if (!validateUsername(username)) {
      setUsernameMessage({ text: "사용자 이름을 다시 확인해 주세요.", type: "error" });
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
        setUsernameMessage({ text: "이미 사용 중인 사용자 이름이에요. 다른 이름은 어떠세요?", type: "error" });
        setIsValidated(false);
      } else {
        setUsernameMessage({ text: "사용하실 수 있는 멋진 사용자 이름이에요!", type: "success" });
        setIsValidated(true);
        // 중복 확인 성공 시 바로 다음 단계로
        onNext(username);
      }
    } catch (error) {
      setUsernameMessage({ 
        text: error instanceof Error ? error.message : "잠시 확인이 어려워요. 다시 시도해 주세요.", 
        type: "error" 
      });
      setIsValidated(false);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <p className="text-gray-400 text-center">원하시는 사용자 이름을 만들어 보세요</p>
      <div className="space-y-4">
        <Input
          label="사용자 이름"
          type="text"
          placeholder="영문소문자+숫자, 4-20자 (예: user123)"
          value={username}
          onChange={handleUsernameChange}
        />

        {usernameMessage && (
          <p className={`text-sm ${getMessageColor(usernameMessage.type)}`}>
            {usernameMessage.text}
          </p>
        )}
        
        <Button
          onClick={handleNext}
          disabled={!username || !validateUsername(username)}
          loading={isChecking}
          loadingText="확인 중..."
        >
          {isValidated ? "다음" : "다음"}
        </Button>
      </div>
    </>
  );
} 
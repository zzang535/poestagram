"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { checkUsername } from "@/services/auth";
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
  const t = useTranslations('signup.username');
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
      setUsernameMessage({ text: t('errors.tooShort'), type: "error" });
    } else if (value.length > 20) {
      setUsernameMessage({ text: t('errors.tooLong'), type: "error" });
    } else if (!/^[a-z0-9]*$/.test(value)) {
      setUsernameMessage({ text: t('errors.invalidChars'), type: "error" });
    } else if (validateUsername(value)) {
      setUsernameMessage({ text: t('info'), type: "info" });
    } else {
      // validateUsername(value)가 false인 경우는 정규식은 통과했으나 길이가 맞지 않는 경우인데,
      // 위에서 길이 체크를 이미 했으므로 이 경우는 발생하지 않아야 함.
      // 하지만 방어적으로 메시지 초기화
      setUsernameMessage(null);
    }
  };

  const handleNext = async () => {
    if (!username) {
      setUsernameMessage({ text: t('errors.required'), type: "error" });
      return;
    }

    if (!validateUsername(username)) {
      setUsernameMessage({ text: t('errors.invalid'), type: "error" });
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
        setUsernameMessage({ text: t('errors.exists'), type: "error" });
        setIsValidated(false);
      } else {
        setUsernameMessage({ text: t('success'), type: "success" });
        setIsValidated(true);
        // 중복 확인 성공 시 바로 다음 단계로
        onNext(username);
      }
    } catch (error) {
      setUsernameMessage({ 
        text: error instanceof Error ? error.message : t('errors.checkFailed'), 
        type: "error" 
      });
      setIsValidated(false);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <p className="text-gray-400 text-center">{t('title')}</p>
      <div className="space-y-4">
        <Input
          label={t('label')}
          type="text"
          placeholder={t('placeholder')}
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
          loadingText={t('checking')}
        >
          {t('nextButton')}
        </Button>
      </div>
    </>
  );
} 
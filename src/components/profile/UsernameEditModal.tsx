"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { updateUsername } from "@/services/users";

interface UsernameEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  onUpdateSuccess: (newUsername: string) => void;
}

export default function UsernameEditModal({ 
  isOpen, 
  onClose, 
  currentUsername,
  onUpdateSuccess 
}: UsernameEditModalProps) {
  const [username, setUsername] = useState(currentUsername);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('profileEdit.usernameModal');

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // 입력값 검증
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError(t('required'));
      return;
    }

    if (trimmedUsername === currentUsername) {
      setError(t('sameUsername'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      await updateUsername(trimmedUsername);
      
      // 성공 시 콜백 호출
      onUpdateSuccess(trimmedUsername);
      onClose();
    } catch (error: any) {
      console.error("사용자명 변경 실패:", error);
      setError(error.message || t('updateFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setUsername(currentUsername);
    setError(null);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={t('title')}
      standardFooter={{
        onCancel: handleClose,
        onConfirm: handleSubmit,
        cancelText: t('cancel'),
        confirmText: t('confirm'),
        confirmDisabled: !username.trim() || username.trim() === currentUsername,
        confirmLoading: isSubmitting,
        confirmLoadingText: t('updating')
      }}
    >
      <div className="p-4">
        <Input
          label={t('title')}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) setError(null); // 입력 시 에러 초기화
          }}
          placeholder={t('placeholder')}
          error={error}
          disabled={isSubmitting}
        />
      </div>
    </Modal>
  );
} 
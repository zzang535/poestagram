"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { updateUsername } from "@/services/users";

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

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // 입력값 검증
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError("사용자명을 입력해주세요.");
      return;
    }

    if (trimmedUsername === currentUsername) {
      setError("현재 사용자명과 동일합니다.");
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
      setError(error.message || "사용자명 변경에 실패했습니다.");
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
      title="사용자명 변경"
      standardFooter={{
        onCancel: handleClose,
        onConfirm: handleSubmit,
        cancelText: "취소",
        confirmText: "변경",
        confirmDisabled: !username.trim() || username.trim() === currentUsername,
        confirmLoading: isSubmitting,
        confirmLoadingText: "변경 중..."
      }}
    >
      <div className="p-4">
        <Input
          label="사용자명"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) setError(null); // 입력 시 에러 초기화
          }}
          placeholder="새로운 사용자명을 입력하세요"
          error={error}
          disabled={isSubmitting}
        />
      </div>
    </Modal>
  );
} 
"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { updateUsername } from "@/apis/users";

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
      footer={
        <div className="bg-zinc-900 border-t border-zinc-700 flex justify-center items-center h-full">
          <div className="flex items-center gap-4 px-4 w-full max-w-[768px]">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !username.trim() || username.trim() === currentUsername}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "변경 중..." : "변경"}
            </button>
          </div>
        </div>
      }
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
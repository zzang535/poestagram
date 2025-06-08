"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import TextArea from "@/components/ui/TextArea";
import { updateBio } from "@/services/users";

interface BioEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBio: string;
  onUpdateSuccess: (newBio: string) => void;
}

const MAX_BIO_LENGTH = 100;

export default function BioEditModal({ 
  isOpen, 
  onClose, 
  currentBio,
  onUpdateSuccess 
}: BioEditModalProps) {
  const [bio, setBio] = useState(currentBio || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = bio !== currentBio;

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      await updateBio(bio);
      
      // 성공 시 콜백 호출
      onUpdateSuccess(bio);
      onClose();
    } catch (error: any) {
      console.error("소개글 변경 실패:", error);
      setError(error.message || "소개글 변경에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setBio(currentBio || "");
    setError(null);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="소개 변경"
      standardFooter={{
        onCancel: handleClose,
        onConfirm: handleSubmit,
        cancelText: "취소",
        confirmText: "변경",
        confirmDisabled: !hasChanges,
        confirmLoading: isSubmitting,
        confirmLoadingText: "변경 중..."
      }}
    >
      <div className="p-4">
        <TextArea
          label="소개"
          value={bio}
          onChange={(e) => {
            setBio(e.target.value);
            if (error) setError(null); // 입력 시 에러 초기화
          }}
          placeholder="자신을 소개해주세요"
          rows={6}
          error={error}
          disabled={isSubmitting}
          maxLength={MAX_BIO_LENGTH}
          showCharCount={true}
        />
      </div>
    </Modal>
  );
} 
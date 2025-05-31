"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import TextArea from "@/components/ui/TextArea";
import { updateBio } from "@/apis/users";

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
              disabled={isSubmitting || !hasChanges}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "변경 중..." : "변경"}
            </button>
          </div>
        </div>
      }
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
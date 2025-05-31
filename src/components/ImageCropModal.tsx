"use client";

import { useRef } from "react";
import Modal from "@/components/shared/Modal";
import ImageCropView, { ImageCropViewRef } from "./ImageCropView";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  onCropComplete: (croppedBlob: Blob) => void;
}

export default function ImageCropModal({ 
  isOpen, 
  onClose, 
  imageFile, 
  onCropComplete 
}: ImageCropModalProps) {
  const imageCropRef = useRef<ImageCropViewRef>(null);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="프로필 사진 편집"
      footer={
        <div className="bg-zinc-900 border-t border-zinc-700 flex justify-center items-center h-full">
          <div className="flex items-center gap-4 px-4 w-full max-w-[768px]">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => {
                imageCropRef.current?.handleCrop();
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              완료
            </button>
          </div>
        </div>
      }
    >
      {imageFile ? (
        <ImageCropView
          ref={imageCropRef}
          imageFile={imageFile}
          onCropComplete={onCropComplete}
          onCancel={onClose}
        />
      ) : (
        <div className="p-6 text-center text-gray-400">
          이미지를 선택해주세요.
        </div>
      )}
    </Modal>
  );
} 
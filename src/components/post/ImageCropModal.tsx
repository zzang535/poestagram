"use client";

import { useRef } from "react";
import Modal from "@/components/ui/Modal";
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
      standardFooter={{
        onCancel: onClose,
        onConfirm: () => {
          imageCropRef.current?.handleCrop();
        },
        cancelText: "취소",
        confirmText: "완료"
      }}
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
"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations('imageCrop');

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('title')}
      standardFooter={{
        onCancel: onClose,
        onConfirm: () => {
          imageCropRef.current?.handleCrop();
        },
        cancelText: t('cancel'),
        confirmText: t('complete')
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
          {t('selectImage')}
        </div>
      )}
    </Modal>
  );
} 
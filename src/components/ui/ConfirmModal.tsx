'use client';

import { useEffect, useState } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else {
      // 애니메이션 종료 후 컴포넌트 언마운트
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'unset';
      }, 300); // 애니메이션 시간과 일치
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose(); // 확인 후 모달 닫기
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)' }}
      onClick={onClose} // 배경 클릭 시 닫기
    >
      <div 
        className={`bg-zinc-800 rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 transition-transform duration-300 ease-in-out ${isOpen ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
      >
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
} 
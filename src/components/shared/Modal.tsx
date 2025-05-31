import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  topBarHeight?: number;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  footer,
  topBarHeight = 60 
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden'; // 모달 열리면 스크롤 방지

      // 모달 애니메이션 처리
      setTimeout(() => {
        setIsVisible(true);
      }, 100);

      if (modalRef.current) {
        modalRef.current.style.transform = `translateY(0px)`;
      }
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset'; // 모달 닫히면 스크롤 허용

      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 h-[100dvh]">
      {/* dim */}
      <div 
        className="fixed inset-0 bg-black/70"
        style={{
          backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)',
          opacity: isVisible ? 1 : 0,
          transition: 'background-color 0.3s ease, opacity 0.3s ease'
        }}
        onClick={onClose} 
      />
      <div 
        ref={modalRef}
        className="
          absolute left-0 right-0 bottom-0
          bg-zinc-900 
          rounded-t-[20px] mx-auto max-w-[1280px] 
        "
        style={{
          transform: `${!isVisible ? 'translateY(100%)' : ''}`,
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          height: `calc(100dvh - ${topBarHeight}px)`
        }}
      >
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="w-full px-[16px] flex items-center justify-between h-[60px] flex-shrink-0">
            <div className="w-[24px]" /> {/* 좌측 여백 */}
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white w-[24px]">
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>

          {/* 내용 영역 */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* 푸터 영역 */}
          {footer && (
            <div className="flex-shrink-0 h-[64px]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
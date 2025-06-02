import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

interface StandardFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  confirmLoadingText?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  standardFooter?: StandardFooterProps;
  topBarHeight?: number;
  enableKeyboardAdjustment?: boolean;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  footer,
  standardFooter,
  topBarHeight = 60,
  enableKeyboardAdjustment = false
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  // 배경 스크롤 방지 함수들
  const preventBackgroundScroll = () => {
    // 현재 스크롤 위치 저장
    scrollPositionRef.current = window.pageYOffset;
    
    // body 스타일 변경으로 스크롤 방지
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    
    // 터치 이벤트 방지 (iOS Safari 대응) - 키보드 조정이 활성화된 경우에만
    if (enableKeyboardAdjustment) {
      document.addEventListener('touchmove', preventTouchMove, { passive: false });
    }
  };

  const restoreBackgroundScroll = () => {
    // body 스타일 복원
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    
    // 스크롤 위치 복원
    window.scrollTo(0, scrollPositionRef.current);
    
    // 터치 이벤트 리스너 제거
    if (enableKeyboardAdjustment) {
      document.removeEventListener('touchmove', preventTouchMove);
    }
  };

  const preventTouchMove = (e: TouchEvent) => {
    // 모달 내부의 스크롤 가능한 요소인지 확인
    const target = e.target as HTMLElement;
    const modalContent = modalRef.current;
    
    if (modalContent && modalContent.contains(target)) {
      // 모달 내부에서 스크롤 가능한 요소 찾기
      let scrollableParent = target;
      while (scrollableParent && scrollableParent !== modalContent) {
        const overflow = window.getComputedStyle(scrollableParent).overflow;
        if (overflow === 'auto' || overflow === 'scroll' || scrollableParent.classList.contains('overflow-y-auto')) {
          // 모달 내부 스크롤은 허용
          return;
        }
        scrollableParent = scrollableParent.parentElement as HTMLElement;
      }
    }
    
    // 모달 외부 또는 스크롤 불가능한 영역의 터치는 방지
    e.preventDefault();
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      preventBackgroundScroll(); // 강력한 배경 스크롤 방지

      // 모달 애니메이션 처리
      setTimeout(() => {
        setIsVisible(true);
      }, 100);

      if (modalRef.current) {
        modalRef.current.style.transform = `translateY(0px)`;
      }
    } else {
      setIsVisible(false);
      restoreBackgroundScroll(); // 배경 스크롤 복원

      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      restoreBackgroundScroll();
    };
  }, [isOpen, enableKeyboardAdjustment]);

  // 키보드 감지 (모바일) - enableKeyboardAdjustment가 true일 때만 동작
  useEffect(() => {
    if (!isOpen || !enableKeyboardAdjustment) return;

    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        const keyboardHeight = window.innerHeight - window.visualViewport.height;
        setKeyboardHeight(Math.max(0, keyboardHeight));
      }
    };

    const handleResize = () => {
      // Visual Viewport API가 지원되지 않는 경우의 fallback
      if (!window.visualViewport) {
        const currentHeight = window.innerHeight;
        const standardHeight = window.screen.height;
        const heightDiff = standardHeight - currentHeight;
        setKeyboardHeight(Math.max(0, heightDiff - 100)); // 100px 여유
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      } else {
        window.removeEventListener('resize', handleResize);
      }
      setKeyboardHeight(0);
    };
  }, [isOpen, enableKeyboardAdjustment]);

  if (!shouldRender) return null;

  const modalHeight = `calc(100dvh - ${topBarHeight}px)`;
  const adjustedModalHeight = (enableKeyboardAdjustment && keyboardHeight > 0) 
    ? `calc(100dvh - ${topBarHeight}px - ${keyboardHeight}px)` 
    : modalHeight;

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
          bg-zinc-950
          rounded-t-[20px] mx-auto max-w-[1280px] 
        "
        style={{
          transform: `${!isVisible ? 'translateY(100%)' : ''}`,
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          height: adjustedModalHeight,
          bottom: (enableKeyboardAdjustment && keyboardHeight > 0) ? `${keyboardHeight}px` : '0'
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
          <div 
            className="flex-1 overflow-y-auto"
            style={{
              height: footer 
                ? `calc(100% - 60px - 64px)` 
                : `calc(100% - 60px)`
            }}
          >
            {children}
          </div>

          {/* 푸터 영역 */}
          {(footer || standardFooter) && (
            <div className="flex-shrink-0 h-[74px]">
              {footer || (standardFooter && (
                <div className="bg-zinc-950 border-t border-zinc-900 flex justify-center items-center h-full">
                  <div className="flex items-center gap-4 px-4 w-full max-w-[768px]">
                    <Button
                      onClick={standardFooter.onCancel}
                      variant="secondary"
                      className="flex-1"
                    >
                      {standardFooter.cancelText || "취소"}
                    </Button>
                    <Button
                      onClick={standardFooter.onConfirm}
                      disabled={standardFooter.confirmDisabled}
                      loading={standardFooter.confirmLoading}
                      loadingText={standardFooter.confirmLoadingText}
                      variant="primary"
                      className="flex-1"
                    >
                      {standardFooter.confirmText || "확인"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
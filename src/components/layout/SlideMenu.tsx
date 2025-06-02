import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faSignInAlt, faUserPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string | null;
  onLogout: () => void;
  onOpenPrivacyModal: () => void;
  onOpenTermsModal: () => void;
}

export default function SlideMenu({ 
  isOpen, 
  onClose, 
  accessToken, 
  onLogout,
  onOpenPrivacyModal,
  onOpenTermsModal
}: SlideMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      // 메뉴가 열릴 때 약간의 지연 후 애니메이션 시작
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      // 애니메이션이 완료된 후 컴포넌트 제거
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // transition duration과 동일하게 설정
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 h-[100dvh]">
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)',
          opacity: isVisible ? 1 : 0,
          transition: 'background-color 0.3s ease, opacity 0.3s ease'
        }}
        onClick={onClose} 
      />
      <div 
        className="border-l border-zinc-950"
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          right: 0,
          width: '16rem',
          backgroundColor: 'black',
          transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.3s ease, opacity 0.3s ease'
        }}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">메뉴</h2>
            <button 
              className="text-gray-400 hover:text-white transition-colors"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>
          <div className="space-y-4 flex-1">
            {accessToken ? (
              // 로그인 상태일 때 보여줄 메뉴
              <>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-3 text-white p-3 hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              // 로그아웃 상태일 때 보여줄 메뉴
              <>
                <Link
                  href="/login"
                  className="w-full flex items-center space-x-3 text-white p-3 hover:bg-zinc-900 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <span>로그인</span>
                </Link>
                <Link
                  href="/signup"
                  className="w-full flex items-center space-x-3 text-white p-3 hover:bg-zinc-900 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <span>회원가입</span>
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 border-t border-zinc-950">
            <div className="flex justify-center space-x-4 text-xs text-gray-400">
              <button 
                onClick={onOpenPrivacyModal} 
                className="hover:underline"
              >
                개인정보처리방침
              </button>
              <span>•</span>
              <button 
                onClick={onOpenTermsModal} 
                className="hover:underline"
              >
                이용약관
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree?: () => void;
}

export default function TermsOfServiceModal({ isOpen, onClose, onAgree }: TermsOfServiceModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      // 모달이 열릴 때 약간의 지연 후 애니메이션 시작
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
        className="fixed inset-0 bg-black/70"
        style={{
          backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)',
          opacity: isVisible ? 1 : 0,
          transition: 'background-color 0.3s ease, opacity 0.3s ease'
        }}
        onClick={onClose} 
      />
      <div 
        className="fixed left-0 right-0 bottom-0 bg-black rounded-t-2xl mx-auto max-w-[1280px] h-[calc(100dvh-60px)]"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.3s ease, opacity 0.3s ease'
        }}
      >
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-lg font-medium">서비스 이용약관</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>

          {/* 내용 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">1. 목적</h3>
              <p className="text-gray-300">
                이 약관은 Poestagram(이하 "회사")이 제공하는 서비스(이하 "서비스")의 이용조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">2. 약관의 효력 및 변경</h3>
              <p className="text-gray-300">
                이 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다. 회사는 약관의 규제에 관한 법률 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">3. 서비스의 제공</h3>
              <p className="text-gray-300">
                회사는 다음과 같은 서비스를 제공합니다:
              </p>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>게시물 저장 및 공유 서비스</li>
                <li>사용자 프로필 관리</li>
                <li>기타 회사가 추가 개발하거나 제휴를 통해 제공하는 서비스</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">4. 서비스 이용 규칙</h3>
              <p className="text-gray-300">
                회원은 다음 행위를 해서는 안 됩니다:
              </p>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>법령 또는 약관에 위배되는 행위</li>
                <li>서비스의 정상적인 운영을 방해하는 행위</li>
                <li>다른 회원의 개인정보를 수집, 저장, 공개하는 행위</li>
                <li>회사의 지적재산권을 침해하는 행위</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">5. 서비스 중단</h3>
              <p className="text-gray-300">
                회사는 다음과 같은 경우 서비스 제공을 중단할 수 있습니다:
              </p>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>시스템 점검, 보수, 교체 등의 경우</li>
                <li>천재지변, 전쟁, 기간통신사업자의 서비스 중단 등의 불가항력적인 사유가 있는 경우</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">6. 회원의 의무</h3>
              <p className="text-gray-300">
                회원은 다음 사항을 준수해야 합니다:
              </p>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>회원가입 신청 시 사실에 맞는 정보를 제공할 것</li>
                <li>회원정보가 변경된 경우 변경사항을 즉시 등록할 것</li>
                <li>서비스 이용 시 관련법령과 약관을 준수할 것</li>
              </ul>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                닫기
              </button>
              {onAgree && (
                <button 
                  onClick={() => {
                    onAgree();
                    onClose();
                  }}
                  className="flex-1 bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors"
                >
                  동의하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
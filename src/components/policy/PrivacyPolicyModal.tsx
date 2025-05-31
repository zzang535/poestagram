import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree?: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose, onAgree }: PrivacyPolicyModalProps) {
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
            <h2 className="text-lg font-medium">개인정보 처리방침</h2>
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
              <h3 className="text-lg font-medium">1. 개인정보의 처리 목적</h3>
              <p className="text-gray-300">
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">2. 개인정보의 처리 및 보유기간</h3>
              <p className="text-gray-300">
                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">3. 정보주체의 권리·의무 및 행사방법</h3>
              <p className="text-gray-300">
                정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
              </p>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">4. 개인정보 보호책임자</h3>
              <p className="text-gray-300">
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-300">▶ 개인정보 보호책임자</p>
                <p className="text-gray-300">- 성명: 황윤</p>
                <p className="text-gray-300">- 직책: 개발자</p>
                <p className="text-gray-300">- 연락처: 010-1234-5678</p>
                <p className="text-gray-300">- 이메일: privacy@poestagram.com</p>
              </div>
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
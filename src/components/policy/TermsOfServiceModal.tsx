import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree?: () => void;
}

export default function TermsOfServiceModal({ isOpen, onClose, onAgree }: TermsOfServiceModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="서비스 이용약관"
      footer={
        <div className="bg-zinc-950 border-t border-zinc-900 flex justify-center items-center h-full">
          <div className="flex items-center gap-4 px-4 w-full max-w-[768px]">
            <Button
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              닫기
            </Button>
            {onAgree && (
              <Button
                onClick={() => {
                  onAgree();
                  onClose();
                }}
                variant="primary"
                className="flex-1"
              >
                동의하기
              </Button>
            )}
          </div>
        </div>
      }
    >
      {/* 내용 */}
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">1. 목적</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            이 약관은 Poestagram(이하 "회사")이 제공하는 서비스(이하 "서비스")의 이용조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">2. 약관의 효력 및 변경</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            이 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다. 회사는 약관의 규제에 관한 법률 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">3. 서비스의 제공</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회사는 다음과 같은 서비스를 제공합니다:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>게시물 저장 및 공유 서비스</li>
            <li>사용자 프로필 관리</li>
            <li>기타 회사가 추가 개발하거나 제휴를 통해 제공하는 서비스</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">4. 서비스 이용 규칙</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회원은 다음 행위를 해서는 안 됩니다:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>법령 또는 약관에 위배되는 행위</li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
            <li>다른 회원의 개인정보를 수집, 저장, 공개하는 행위</li>
            <li>회사의 지적재산권을 침해하는 행위</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">5. 서비스 중단</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회사는 다음과 같은 경우 서비스 제공을 중단할 수 있습니다:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>시스템 점검, 보수, 교체 등의 경우</li>
            <li>천재지변, 전쟁, 기간통신사업자의 서비스 중단 등의 불가항력적인 사유가 있는 경우</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">6. 회원의 의무</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회원은 다음 사항을 준수해야 합니다:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>회원가입 신청 시 사실에 맞는 정보를 제공할 것</li>
            <li>회원정보가 변경된 경우 변경사항을 즉시 등록할 것</li>
            <li>서비스 이용 시 관련법령과 약관을 준수할 것</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
} 
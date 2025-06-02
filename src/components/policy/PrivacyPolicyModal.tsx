import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree?: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose, onAgree }: PrivacyPolicyModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="개인정보 처리방침"
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
          <h3 className="text-lg font-semibold text-white">1. 개인정보의 처리 목적</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">2. 개인정보의 처리 및 보유기간</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">3. 정보주체의 권리·의무 및 행사방법</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리정지 요구</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">4. 개인정보 보호책임자</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <div className="bg-zinc-800 p-4 rounded-lg">
            <p className="text-sm text-gray-300">▶ 개인정보 보호책임자</p>
            <p className="text-sm text-gray-300">- 성명: 황윤</p>
            <p className="text-sm text-gray-300">- 직책: 개발자</p>
            <p className="text-sm text-gray-300">- 연락처: 010-1234-5678</p>
            <p className="text-sm text-gray-300">- 이메일: privacy@poestagram.com</p>
          </div>
        </div>
      </div>
    </Modal>
  );
} 
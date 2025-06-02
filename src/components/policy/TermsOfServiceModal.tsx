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
            이 약관은 싱잉버드(이하 "회사")가 제공하는 poestagram 서비스(이하 "서비스")의 이용조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
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
            <li>게임영상, 사진 등 미디어 콘텐츠 업로드 및 공유</li>
            <li>다른 사용자와의 소셜 네트워킹 (팔로우, 좋아요, 댓글)</li>
            <li>사용자 프로필 관리 및 개인화 서비스</li>
            <li>콘텐츠 검색 및 추천 서비스</li>
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
            <li>타인의 콘텐츠를 무단으로 복제, 배포하는 행위</li>
            <li>허위 정보나 조작된 콘텐츠 업로드</li>
            <li>자동화된 프로그램을 이용한 서비스 이용</li>
            <li>상업적 목적의 무단 광고 게시</li>
            <li>미성년자에게 부적절한 콘텐츠 제공</li>
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

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">7. 콘텐츠 정책</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회원이 업로드하는 콘텐츠는 다음 기준을 준수해야 합니다:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>게임영상, 사진 등 업로드 콘텐츠의 저작권 준수 의무</li>
            <li>타인의 지적재산권을 침해하는 콘텐츠 금지</li>
            <li>음란물, 폭력적 콘텐츠, 혐오 표현 등 부적절한 콘텐츠 금지</li>
            <li>게임 제작사의 가이드라인 준수 (게임 영상의 경우)</li>
            <li>개인정보가 포함된 콘텐츠 업로드 금지</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">8. 콘텐츠 라이선스</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회원이 서비스에 업로드한 콘텐츠에 대하여:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>회원은 해당 콘텐츠에 대한 소유권을 유지합니다</li>
            <li>회사는 서비스 제공, 개선, 홍보 목적으로 콘텐츠를 사용할 수 있습니다</li>
            <li>콘텐츠 삭제 시 관련 라이선스는 종료됩니다</li>
            <li>회원은 콘텐츠에 대한 모든 법적 책임을 집니다</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">9. 커뮤니티 가이드라인</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            소셜 기능 이용 시 다음 사항을 준수해야 합니다:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>댓글, 좋아요 등 상호작용 시 예의와 존중 유지</li>
            <li>스팸, 광고성 댓글 금지</li>
            <li>사이버불링, 괴롭힘, 협박 금지</li>
            <li>타인의 개인정보 무단 공개 금지</li>
            <li>건전하고 건설적인 소통 문화 조성</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">10. 신고 및 제재</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            부적절한 콘텐츠나 행위에 대하여:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>회원은 신고 기능을 통해 문제를 신고할 수 있습니다</li>
            <li>회사는 위반 사항에 대해 경고, 콘텐츠 삭제, 계정 정지/삭제 등의 조치를 취할 수 있습니다</li>
            <li>제재 조치에 대해 이의제기 절차를 제공합니다</li>
            <li>심각한 위반의 경우 즉시 계정 삭제 조치가 가능합니다</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">11. 개인정보 보호</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            개인정보 처리에 관하여:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>프로필 정보, 게시물, 활동 기록 등을 수집 및 이용합니다</li>
            <li>타 사용자와의 정보 공유 범위는 개인정보처리방침에 따릅니다</li>
            <li>계정 삭제 시 관련 데이터는 일정 기간 후 삭제됩니다</li>
            <li>자세한 내용은 별도의 개인정보처리방침을 참고하십시오</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">12. 미성년자 보호</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            미성년자 보호를 위하여:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>만 14세 미만의 경우 법정대리인의 동의가 필요합니다</li>
            <li>미성년자 대상 유해 콘텐츠는 제한됩니다</li>
            <li>미성년자의 개인정보는 특별히 보호됩니다</li>
            <li>미성년자 관련 문제 발생 시 즉시 조치합니다</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
} 
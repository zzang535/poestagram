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
            싱잉버드(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>회원 가입 및 관리</li>
            <li>게임영상, 사진 등 콘텐츠 업로드 및 공유 서비스 제공</li>
            <li>소셜 네트워킹 기능 (팔로우, 좋아요, 댓글) 제공</li>
            <li>개인화된 콘텐츠 추천 및 맞춤형 서비스 제공</li>
            <li>커뮤니티 관리 및 부정 이용 방지</li>
            <li>고객 지원 및 서비스 개선</li>
            <li>법령 및 이용약관 위반 행위에 대한 대응</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">2. 수집하는 개인정보 항목</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회사는 다음과 같은 개인정보를 수집합니다:
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-white">▶ 필수 수집 항목</p>
              <ul className="list-disc pl-5 text-xs text-gray-300 space-y-1 leading-relaxed">
                <li>이메일 주소, 비밀번호, 유저네임</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-white">▶ 선택 수집 항목</p>
              <ul className="list-disc pl-5 text-xs text-gray-300 space-y-1 leading-relaxed">
                <li>프로필 사진, 자기소개</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-white">▶ 서비스 이용 과정에서 생성되는 정보</p>
              <ul className="list-disc pl-5 text-xs text-gray-300 space-y-1 leading-relaxed">
                <li>업로드한 게임영상, 사진 및 관련 메타데이터</li>
                <li>댓글, 좋아요, 팔로우 등 활동 기록</li>
                <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">3. 개인정보 수집 방법</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회사는 다음과 같은 방법으로 개인정보를 수집합니다:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>회원가입 및 서비스 이용 과정에서 이용자가 직접 제공</li>
            <li>소셜 로그인 서비스 이용 시 해당 플랫폼으로부터 제공받는 정보</li>
            <li>서비스 이용 과정에서 자동으로 생성되어 수집되는 정보</li>
            <li>고객센터를 통한 상담 과정에서 수집</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">4. 개인정보의 처리 및 보유기간</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>회원정보: 회원탈퇴 시까지 (단, 법령에 따른 보관 의무기간 제외)</li>
            <li>게시물 및 댓글: 사용자가 삭제하거나 회원탈퇴 시까지</li>
            <li>서비스 이용기록: 3개월</li>
            <li>부정이용 및 분쟁 관련 기록: 1년</li>
            <li>관련 법령에 따른 보존이 필요한 경우: 해당 법령에서 정한 기간</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">5. 개인정보의 제3자 제공</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>이용자가 사전에 동의한 경우</li>
            <li>서비스 특성상 다른 이용자에게 공개되는 정보 (프로필, 게시물 등)</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">6. 개인정보 안전성 확보 조치</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>개인정보 취급 직원의 최소화 및 교육</li>
            <li>개인정보에 대한 접근 제한</li>
            <li>개인정보를 안전하게 저장·전송할 수 있는 암호화 기술 사용</li>
            <li>해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손 방지를 위한 보안시스템 구축</li>
            <li>개인정보 처리시스템 접근기록 보관 및 위변조 방지</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">7. 쿠키 및 자동수집 도구</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회사는 서비스 개선과 맞춤형 서비스 제공을 위해 쿠키를 사용합니다:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>쿠키 수집 목적: 로그인 상태 유지, 서비스 이용 분석, 맞춤형 콘텐츠 제공</li>
            <li>쿠키 설정 거부 방법: 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다</li>
            <li>쿠키 거부 시: 로그인이 필요한 일부 서비스 이용에 제한이 있을 수 있습니다</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">8. 미성년자 개인정보 보호</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회사는 만 14세 미만 아동의 개인정보 보호에 특별한 주의를 기울입니다:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>만 14세 미만 아동의 회원가입 시 법정대리인의 동의 필요</li>
            <li>미성년자 개인정보는 더욱 엄격하게 관리</li>
            <li>미성년자에게 부적절한 콘텐츠 노출 방지 조치</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">9. 정보주체의 권리·의무 및 행사방법</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리정지 요구</li>
          </ul>
          <p className="text-xs text-gray-400 leading-relaxed mt-2">
            권리 행사는 서비스 내 설정 메뉴 또는 개인정보 보호책임자에게 서면, 전화, 전자우편을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">10. 개인정보 보호책임자</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <div className="bg-zinc-800 p-4 rounded-lg">
            <p className="text-sm text-gray-300">▶ 개인정보 보호책임자</p>
            <p className="text-sm text-gray-300">- 회사명: 싱잉버드</p>
            <p className="text-sm text-gray-300">- 담당부서: 개발팀</p>
            <p className="text-sm text-gray-300">- 담당자: 황윤</p>
            <p className="text-sm text-gray-300">- 이메일: poestagramer@gmail.com</p>
            <p className="text-sm text-gray-300">- 고객센터: 010-2849-0490</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">11. 개인정보 처리방침의 변경</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
          </p>
        </div>
      </div>
    </Modal>
  );
} 
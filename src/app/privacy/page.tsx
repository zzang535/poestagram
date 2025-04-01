export const metadata = {
  title: '개인정보처리방침 - Poestagram',
  description: 'Poestagram의 개인정보처리방침을 확인하세요.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">개인정보처리방침</h1>
      
      <div className="space-y-8 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">1. 개인정보의 처리 목적</h2>
          <p className="leading-relaxed">
            Poestagram(이하 '회사')은 다음의 목적을 위하여 개인정보를 처리하고 있으며, 
            다음의 목적 이외의 용도로는 이용하지 않습니다.
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>회원 가입 및 관리</li>
            <li>게시물 저장 및 공유 서비스 제공</li>
            <li>이용자 식별 및 본인 인증</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">2. 개인정보의 처리 및 보유 기간</h2>
          <p className="leading-relaxed">
            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
            동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">3. 정보주체의 권리·의무 및 행사방법</h2>
          <p className="leading-relaxed">
            이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리정지 요구</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">4. 처리하는 개인정보 항목</h2>
          <p className="leading-relaxed">회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>이메일 주소</li>
            <li>비밀번호</li>
            <li>프로필 정보 (닉네임, 프로필 이미지)</li>
            <li>서비스 이용 기록</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">5. 개인정보의 파기</h2>
          <p className="leading-relaxed">
            회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
            지체없이 해당 개인정보를 파기합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">6. 개인정보 보호책임자</h2>
          <p className="leading-relaxed">
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 
            정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 
            지정하고 있습니다.
          </p>
          <div className="mt-4 bg-gray-900 p-4 rounded-lg">
            <p className="font-medium text-white">개인정보 보호책임자</p>
            <ul className="mt-2 space-y-1">
              <li>이름: [이름]</li>
              <li>직책: [직책]</li>
              <li>연락처: [이메일 주소]</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="mt-12 text-sm text-gray-400">
        <p>시행일자: 2024년 3월 31일</p>
      </div>
    </div>
  );
} 
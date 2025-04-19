"use client";

export default function LoginPageSpec() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-12">
      <h1 className="text-3xl font-bold mb-8">📄 로그인 화면 기획서</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">화면 명</h2>
        <p>로그인 페이지 (Login Page)</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">주요 기능 및 구성</h2>
        <h3 className="text-lg font-medium mt-4 mb-1">입력 필드</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>이메일: 텍스트 입력 필드</li>
          <li>비밀번호: 마스킹 처리된 입력 필드</li>
        </ul>

        <h3 className="text-lg font-medium mt-4 mb-1">버튼</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>로그인: 클릭 시 `/home` 페이지로 이동</li>
          <li>비밀번호를 잊으셨나요?: 비밀번호 재설정 페이지로 이동</li>
          <li>가입하기: `/signup`으로 이동</li>
          <li>개인정보처리방침 / 이용약관: 정책 문서 페이지로 이동</li>
        </ul>
      </section>
    </div>
  );
} 
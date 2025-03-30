"use client";

export default function AccessControlPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">접근 권한 기획서</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. 현재 상태</h2>
        <div className="bg-gray-900 p-6 rounded-lg">
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>/create 경로만 로그인 후 접근 가능</li>
            <li>나머지 모든 경로는 비로그인 상태에서도 접근 가능</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. 접근 권한 구분</h2>
        <div className="bg-gray-900 p-6 rounded-lg">
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>비로그인 사용자 (Guest)</li>
            <li>로그인 사용자 (User)</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. 경로별 접근 권한</h2>
        <div className="bg-gray-900 p-6 rounded-lg">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-3">공개 페이지</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>/ (메인 페이지)</li>
                <li>/login (로그인 페이지)</li>
                <li>/signup (회원가입 페이지)</li>
                <li>/user-feed/[username] (사용자 피드 페이지)</li>
                <li>/profile (프로필 페이지)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-3">로그인 필요 페이지</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>/create (게시물 작성)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
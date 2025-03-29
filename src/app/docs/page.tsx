"use client";

import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-12">
      <h1 className="text-3xl font-bold mb-8">문서 목록</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">기획서</h2>
          <div className="grid gap-4">
            <Link 
              href="/docs/common" 
              className="block p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-lg font-medium mb-2">공통 디자인 가이드</h3>
              <p className="text-gray-400">전체 서비스의 디자인 컨셉과 인터랙션 정의</p>
            </Link>
            <Link 
              href="/docs/login" 
              className="block p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-lg font-medium mb-2">로그인 화면 기획서</h3>
              <p className="text-gray-400">로그인 화면의 UI/UX 및 기능 명세</p>
            </Link>
            {/* 추후 다른 기획서들도 여기에 추가 */}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">개발 문서</h2>
          <div className="grid gap-4">
            {/* 추후 개발 문서들 추가 */}
          </div>
        </section>
      </div>
    </div>
  );
} 
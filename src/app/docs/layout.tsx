"use client";

import Link from "next/link";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="flex">
        <div className="w-64 p-6 border-r border-gray-800">
          <Link href="/docs">
            <h1 className="text-2xl font-bold mb-8 hover:text-gray-300 transition-colors">문서 목록</h1>
          </Link>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">기획서</h2>
              <div className="space-y-2">
                <Link 
                  href="/docs/common" 
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  공통 디자인 가이드
                </Link>
                <Link 
                  href="/docs/login" 
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  로그인 페이지
                </Link>
                <Link 
                  href="/docs/access-control" 
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  페이지별 접근 권한
                </Link>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">개발 문서</h2>
              <div className="space-y-2">
                <Link 
                  href="/docs/work-log" 
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  작업일지
                </Link>
                <Link 
                  href="/docs/tech-stack" 
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  기술 스택
                </Link>
              </div>
            </section>
          </div>
        </div>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 
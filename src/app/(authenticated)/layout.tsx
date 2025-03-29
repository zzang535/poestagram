"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCreatePage = pathname === "/create";

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="fixed top-0 w-full bg-gray-900 border-b border-gray-800 z-50">
        <div className="max-w-8xl mx-auto px-4 h-14 flex items-center justify-between">
          {isCreatePage ? (
            <h1 className="text-xl font-medium text-white">새 게시물</h1>
          ) : (
            <h1 className="font-['Pacifico'] text-xl text-white">poe2stagram</h1>
          )}
        </div>
      </nav>

      <main className="mt-14 mb-16">
        {children}
      </main>

      <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800">
        <div className="grid grid-cols-3 h-16">
          <Link href="/home" className="flex flex-col items-center justify-center">
            <i className="fa-solid fa-house text-xl text-red-800"></i>
            <span className="text-xs mt-1 text-white">홈</span>
          </Link>

          <Link href="/create" className="flex flex-col items-center justify-center">
            <i className="fa-solid fa-plus text-xl text-white"></i>
            <span className="text-xs mt-1 text-white">만들기</span>
          </Link>

          <Link href="/profile" className="flex flex-col items-center justify-center">
            <i className="fa-solid fa-user text-xl text-white"></i>
            <span className="text-xs mt-1 text-white">프로필</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

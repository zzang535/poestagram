"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHouse, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCreatePage = pathname === "/create";

  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white flex-1">
            {isCreatePage ? "새 게시물" : "poe2stagram"}
          </h1>
          <button className="text-white p-2 hover:bg-gray-900 rounded-lg transition-colors ml-auto">
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
        </div>
      </header>

      <main className="pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 h-16">
            <Link href="/home" className="flex flex-col items-center justify-center">
              <FontAwesomeIcon icon={faHouse} className="text-xl text-red-800" />
              <span className="text-xs mt-1 text-white">홈</span>
            </Link>

            <Link href="/create" className="flex flex-col items-center justify-center">
              <FontAwesomeIcon icon={faPlus} className="text-xl text-white" />
              <span className="text-xs mt-1 text-white">만들기</span>
            </Link>

            <Link href="/profile" className="flex flex-col items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-xl text-white" />
              <span className="text-xs mt-1 text-white">프로필</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

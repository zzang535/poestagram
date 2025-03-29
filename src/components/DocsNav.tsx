"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DocsNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "bg-gray-800" : "hover:bg-gray-800";
  };

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-gray-900 p-4">
      <div className="mb-8">
        <Link href="/docs" className="text-xl font-bold">
          📚 문서
        </Link>
      </div>
      
      <div className="space-y-2">
        <Link 
          href="/docs/common" 
          className={`block px-4 py-2 rounded-lg transition-colors ${isActive("/docs/common")}`}
        >
          공통 디자인 가이드
        </Link>
        <Link 
          href="/docs/login" 
          className={`block px-4 py-2 rounded-lg transition-colors ${isActive("/docs/login")}`}
        >
          로그인 화면 기획서
        </Link>
      </div>
    </nav>
  );
} 
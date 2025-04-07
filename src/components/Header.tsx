'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";

interface HeaderProps {
  onMenuOpen: () => void;
}

export default function Header({ onMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = () => {
    switch (pathname) {
      case '/feed':
        return 'poestagram';
      case '/create':
        return '새 게시물';
      case '/login':
        return '로그인';
      case '/signup':
        return '회원가입';
      default:
        if (pathname?.startsWith('/user/')) {
          return '게시물';
        }
        return 'poestagram';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 z-20 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between relative">
        <button 
          className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors absolute left-4 top-1/2 -translate-y-1/2"
          onClick={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
        </button>
        <h1 className="text-xl font-bold text-white w-full text-center">
          {getPageTitle()}
        </h1>
        <button 
          className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors absolute right-4 top-1/2 -translate-y-1/2"
          onClick={onMenuOpen}
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>
      </div>
    </header>
  );
} 
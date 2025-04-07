'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  isUserFeedPage: boolean;
  isCreatePage: boolean;
  onBack: () => void;
  onMenuOpen: () => void;
}

export default function Header({ isUserFeedPage, isCreatePage, onBack, onMenuOpen }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 z-20 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {isUserFeedPage ? (
          <>
            <button 
              className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={onBack}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </button>
            <h1 className="text-xl font-bold text-white">게시물</h1>
            <div className="w-8" /> {/* 오른쪽 정렬을 위한 빈 공간 */}
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-white flex-1">
              {isCreatePage ? "새 게시물" : "poestagram"}
            </h1>
            <button 
              className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors ml-auto"
              onClick={onMenuOpen}
            >
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
          </>
        )}
      </div>
    </header>
  );
} 
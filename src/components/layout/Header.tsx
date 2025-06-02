'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onMenuOpen: () => void;
  title: string;
  showBackButton?: boolean;
}

export default function Header({ onMenuOpen, title, showBackButton = false }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="
      fixed 
      top-0 
      left-0 
      right-0 
      bg-black/73
      backdrop-blur-sm 
      z-30
      border-b
      border-zinc-900
    ">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="text-white hover:text-gray-300 mr-4"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
              </button>
            )}
            <h1 className="text-xl font-bold text-white">{title}</h1>
          </div>
          <button
            onClick={onMenuOpen}
            className="text-white hover:text-gray-300"
          >
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
} 
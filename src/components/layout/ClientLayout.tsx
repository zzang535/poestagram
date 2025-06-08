"use client";

import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  
  faPlus, 
  faUser, 
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Header from "@/components/layout/Header";
import PrivacyPolicyModal from "@/components/policy/PrivacyPolicyModal";
import TermsOfServiceModal from "@/components/policy/TermsOfServiceModal";
import SlideMenu from "@/components/layout/SlideMenu";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  
  // docs 경로에서는 기본 레이아웃만 적용
  if (pathname.startsWith("/docs")) {
    return <>{children}</>;
  }
  
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // 현재 경로에 따른 네비게이션 활성화 상태
  const isFeedActive = pathname === "/feed";
  const isCreateActive = pathname === "/create-post";
  const isProfileActive = pathname.includes("/profile");

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const { logout, user } = useAuthStore();

  const getPageTitle = () => {
    if (pathname === '/create-post') {
      return '새 게시물';
    } else if (pathname === '/login') {
      return '로그인';
    } else if (pathname === '/signup') {
      return '회원가입';
    } else if (pathname === '/feed') {
      return 'poestagram';
    } else if (pathname?.startsWith('/user/') && pathname?.endsWith('/feed')) {
      return '게시물';
    } else if (pathname === '/edit-profile') {
      return '프로필 편집';
    } else if (pathname?.includes('/profile')) {
      return '프로필';
    } else if (pathname === '/reset-password') {
      return '비밀번호 재설정';
    } else {
      return 'poestagram';
    }
  };

  const shouldShowBackButton = () => {
    return pathname === '/feed' ? false : true;
  };

  const noShowGnb = () => {
    return pathname === '/login' || pathname === '/signup' || pathname === '/reset-password' || pathname === '/create-post';
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/login");
  };

  const handleNavigation = (path: string) => {
    if (path === "/create-post" ) {
      if (isAuthenticated) {
        router.push(path);
      } else {
        router.push("/login");
      }
    } else if (path === "/profile") {
      if (isAuthenticated) {
        router.push(`/user/${user?.id}/profile`);
      } else {
        router.push("/login");
      }
    } else if (path === "/feed") {
      router.push("/feed");
    } else {
      router.push(path);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col h-[100svh]">
      <Header 
        onMenuOpen={toggleMenu}
        title={getPageTitle()}
        showBackButton={shouldShowBackButton()}
      />

      <main className="flex-grow overflow-y-auto min-h-0">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {!noShowGnb() && (
        <nav className="
              fixed 
              bottom-0 
              left-0 
              right-0 
              bg-black/73
              backdrop-blur-sm 
              border-t 
              border-zinc-900
              z-20
            ">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-3 h-16">
              <button 
                onClick={() => handleNavigation("/feed")}
                className={`flex flex-col items-center justify-center ${
                  isFeedActive ? "text-red-800" : "text-white"
                }`}
              >
                <FontAwesomeIcon icon={faHome} className="text-xl" />
              </button>

              <button 
                onClick={() => handleNavigation("/create-post")}
                className={`flex flex-col items-center justify-center ${
                  isCreateActive ? "text-red-800" : "text-white"
                }`}
              >
                <FontAwesomeIcon icon={faPlus} className="text-xl" />
              </button>

              <button 
                onClick={() => handleNavigation("/profile")}
                className={`flex flex-col items-center justify-center ${
                  isProfileActive ? "text-red-800" : "text-white"
                }`}
              >
                <FontAwesomeIcon icon={faUser} className="text-xl" />
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* 슬라이드 메뉴 */}
      <SlideMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenTermsModal={() => setIsTermsModalOpen(true)}
      />

      {/* 개인정보처리방침 모달 */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* 이용약관 모달 */}
      <TermsOfServiceModal 
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
} 
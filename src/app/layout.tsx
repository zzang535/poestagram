"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faNewspaper, 
  faPlus, 
  faUser, 
  faSignOutAlt, 
  faSignInAlt,
  faUserPlus,
  faHome,
  faBars,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import "./globals.css";
import { useAuthStore } from "@/store/authStore";
import Header from "@/components/layout/Header";
import PrivacyPolicyModal from "@/components/policy/PrivacyPolicyModal";
import TermsOfServiceModal from "@/components/policy/TermsOfServiceModal";
import SlideMenu from "@/components/layout/SlideMenu";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // docs 경로에서는 기본 레이아웃만 적용
  if (pathname.startsWith("/docs")) {
    return (
      <html lang="ko">
        <body>
          {children}
        </body>
      </html>
    );
  }

  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // 현재 경로에 따른 네비게이션 활성화 상태
  const isFeedActive = pathname === "/feed";
  const isCreateActive = pathname === "/create";
  const isProfileActive = pathname.startsWith("/profile");

  const accessToken = useAuthStore((s) => s.accessToken);
  const { logout, user } = useAuthStore();

  const getPageTitle = () => {
    if (pathname === '/create') {
      return '새 게시물';
    } else if (pathname === '/login') {
      return '로그인';
    } else if (pathname === '/signup') {
      return '회원가입';
    } else if (pathname === '/feed') {
      return 'poestagram';
    } else if (pathname?.startsWith('/user/') && pathname?.endsWith('/feed')) {
      return '게시물';
    } else if (pathname === '/profile/edit') {
      return '프로필 편집';
    } else if (pathname?.startsWith('/profile/')) {
      return '프로필';
    } else {
      return 'poestagram';
    }
  };

  const shouldShowBackButton = () => {
    return pathname === '/feed' ? false : true;
  };

  const shouldShowGnb = () => {
    return pathname !== '/login' && pathname !== '/signup';
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/feed");
  };

  const handleDeleteAccount = () => {
    // TODO: 회원 탈퇴 로직 구현
    console.log("회원 탈퇴");
    router.push("/login");
  };

  const handleNavigation = (path: string) => {
    if (path === "/create" ) {
      if (accessToken) {
        router.push(path);
      } else {
        router.push("/login");
      }
    } else if (path === "/profile") {
      if (accessToken) {
        router.push(`/profile/${user?.id}`);
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
    <html lang="ko">
      <body>
        <div className="min-h-screen bg-black flex flex-col">
          <Header 
            onMenuOpen={toggleMenu}
            title={getPageTitle()}
            showBackButton={shouldShowBackButton()}
          />

          <main className="h-[100dvh] overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

          {shouldShowGnb() && (
            <nav className="
                  fixed 
                  bottom-0 
                  left-0 
                  right-0 
                  bg-black/73
                  backdrop-blur-sm 
                  border-t 
                  border-gray-800 
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
                    onClick={() => handleNavigation("/create")}
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
        </div>

        {/* 슬라이드 메뉴 */}
        <SlideMenu 
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          accessToken={accessToken}
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
      </body>
    </html>
  );
}

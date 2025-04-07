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
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "./globals.css";
import { useAuthStore } from "@/store/authStore";
import Header from "@/components/Header";

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

  // 현재 경로에 따른 네비게이션 활성화 상태
  const isFeedActive = pathname === "/feed";
  const isCreateActive = pathname === "/create";
  const isProfileActive = pathname === "/profile";

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  const handleLogout = () => {
    useAuthStore.getState().logout();
    setIsMenuOpen(false);
    router.push("/feed");
  };

  const handleDeleteAccount = () => {
    // TODO: 회원 탈퇴 로직 구현
    console.log("회원 탈퇴");
    router.push("/login");
  };


  const handleNavigation = (path: string) => {
    if (path === "/create" || path === "/profile") {

      if (isLoggedIn) {
        router.push(path);
      } else {
        router.push("/login");
      }
    } else {
      router.push(path);
    }
  };



  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen bg-black flex flex-col">
          <Header 
            onMenuOpen={() => setIsMenuOpen(true)}
          />

          {/* 메뉴가 열려있을 때 배경을 어둡게 */}
          {isMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-30 transition-opacity z-30"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {/* 오른쪽 슬라이드 메뉴 */}
          <div className={`fixed inset-y-0 right-0 w-64 bg-black border-l border-gray-800 transform transition-transform duration-300 ease-in-out z-40 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white">메뉴</h2>
                <button 
                  className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              <div className="space-y-4 flex-1">
                {isLoggedIn ? (
                  // 로그인 상태일 때 보여줄 메뉴
                  <>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 text-white p-3 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
                      <span>로그아웃</span>
                    </button>
                  </>
                ) : (
                  // 로그아웃 상태일 때 보여줄 메뉴
                  <>
                    <Link
                      href="/login"
                      className="w-full flex items-center space-x-3 text-white p-3 hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faSignInAlt} className="text-xl" />
                      <span>로그인</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="w-full flex items-center space-x-3 text-white p-3 hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="text-xl" />
                      <span>회원가입</span>
                    </Link>
                  </>
                )}
              </div>
              {isLoggedIn && (
                <div className="pt-4 border-t border-gray-800">
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full text-gray-400 text-sm p-2 hover:text-white transition-colors"
                  >
                    회원 탈퇴
                  </button>
                </div>
              )}
            </div>
          </div>

          <main className="h-[100dvh] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>

          <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-20">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-3 h-16">
                <button 
                  onClick={() => handleNavigation("/feed")}
                  className={`flex flex-col items-center justify-center ${
                    isFeedActive ? "text-red-800" : "text-white"
                  }`}
                >
                  <FontAwesomeIcon icon={faNewspaper} className="text-xl" />
                  <span className="text-xs mt-1">피드</span>
                </button>

                <button 
                  onClick={() => handleNavigation("/create")}
                  className={`flex flex-col items-center justify-center ${
                    isCreateActive ? "text-red-800" : "text-white"
                  }`}
                >
                  <FontAwesomeIcon icon={faPlus} className="text-xl" />
                  <span className="text-xs mt-1">만들기</span>
                </button>

                <button 
                  onClick={() => handleNavigation("/profile")}
                  className={`flex flex-col items-center justify-center ${
                    isProfileActive ? "text-red-800" : "text-white"
                  }`}
                >
                  <FontAwesomeIcon icon={faUser} className="text-xl" />
                  <span className="text-xs mt-1">프로필</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}

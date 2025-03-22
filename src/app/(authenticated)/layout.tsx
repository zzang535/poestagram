export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 h-14 border-b border-white/10 flex items-center px-4 bg-black z-10">
        <h1 className="font-['Pacifico'] text-xl text-white">poe2stagram</h1>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 pt-14 pb-16 px-4 overflow-auto">{children}</main>

      {/* 하단 GNB */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-white/10 flex justify-around items-center bg-black z-10">
        {/* 홈 버튼 */}
        <button className="flex flex-col items-center justify-center w-1/3 h-full text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="text-xs mt-1">홈</span>
        </button>

        {/* 검색 버튼 */}
        <button className="flex flex-col items-center justify-center w-1/3 h-full text-white/70 hover:text-white/100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span className="text-xs mt-1">검색</span>
        </button>

        {/* 프로필 버튼 */}
        <button className="flex flex-col items-center justify-center w-1/3 h-full text-white/70 hover:text-white/100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="text-xs mt-1">프로필</span>
        </button>
      </nav>
    </>
  );
}

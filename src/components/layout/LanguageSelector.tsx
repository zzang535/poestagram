import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
// import { setUserLocale, getUserLocale, getLocaleDisplayName } from "@/utils/locale";

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('en');
  const t = useTranslations('menu');

  const availableLocales = ['ko', 'en'];
  const router = useRouter(); // 추가

  useEffect(() => {
    setCurrentLocale(getUserLocale());
  }, []);

  const handleLocaleChange = (locale: string) => {
    setUserLocale(locale);
    setIsOpen(false);
  };


  /**
  * 사용자가 선택한 언어를 쿠키에 저장하고 페이지를 새로고침합니다.
  */
  function setUserLocale(locale: string) {
    // 쿠키에 언어 설정 저장 (1년간 유지)
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    
    // 페이지 새로고침으로 언어 변경 적용
    // window.location.reload();

    // client state - locale state 업데이트 (바로 반영)
    setCurrentLocale(locale);

    // 서버 컴포넌트 리로드, 클라이언트 컴포넌트는 자동으로 리로드됨
    router.refresh();
  }
  
  /**
  * 현재 설정된 언어를 쿠키에서 가져옵니다.
  */
  function getUserLocale(): string {
    if (typeof document === 'undefined') return 'en';
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    return match ? match[1] : 'en';
  }
  
  /**
  * 언어 코드에 해당하는 표시명을 반환합니다.
  */
  function getLocaleDisplayName(locale: string): string {
    const displayNames: Record<string, string> = {
      ko: '한국어',
      en: 'English'
    };
    
    return displayNames[locale] || locale;
  } 

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-white p-3 hover:bg-zinc-900 rounded-lg transition-colors"
      >
        <span>{t('language')}</span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {getLocaleDisplayName(currentLocale)}
          </span>
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className={`text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10">
          {availableLocales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`w-full text-left px-3 py-2 hover:bg-zinc-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                currentLocale === locale ? 'text-red-400' : 'text-white'
              }`}
            >
              {getLocaleDisplayName(locale)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 
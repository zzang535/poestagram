import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { setUserLocale, getUserLocale, getLocaleDisplayName } from "@/utils/locale";

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('en');
  const t = useTranslations('menu');

  const availableLocales = ['ko', 'en'];

  useEffect(() => {
    setCurrentLocale(getUserLocale());
  }, []);

  const handleLocaleChange = (locale: string) => {
    setUserLocale(locale);
    setIsOpen(false);
  };

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
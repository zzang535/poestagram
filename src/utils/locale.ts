/**
 * 사용자가 선택한 언어를 쿠키에 저장하고 페이지를 새로고침합니다.
 */
export function setUserLocale(locale: string) {
  // 쿠키에 언어 설정 저장 (1년간 유지)
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  
  // 페이지 새로고침으로 언어 변경 적용
  window.location.reload();
}

/**
 * 현재 설정된 언어를 쿠키에서 가져옵니다.
 */
export function getUserLocale(): string {
  if (typeof document === 'undefined') return 'en';
  
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  return match ? match[1] : 'en';
}

/**
 * 언어 코드에 해당하는 표시명을 반환합니다.
 */
export function getLocaleDisplayName(locale: string): string {
  const displayNames: Record<string, string> = {
    ko: '한국어',
    en: 'English'
  };
  
  return displayNames[locale] || locale;
} 
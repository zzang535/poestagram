import type { Metadata } from 'next'
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { MaintenanceContent } from "@/app/maintenance/page";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: {
    template: '%s | poestagram',
    default: 'poestagram - POE 패스오브 엑자일 유저를 위한 커뮤니티'
  },
  description: 'POE 패스오브 엑자일 유저를 위한 커뮤니티입니다. 게임 플레이 영상과 스크린샷을 공유하고 소통해보세요.',
  keywords: ['피오이스타그램', 'poestagram', 'POE', '패스오브 엑자일', '게임커뮤니티'],
  authors: [{ name: '싱잉버드' }],
  creator: '싱잉버드',
  publisher: '싱잉버드',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://poestagram.com'),
  openGraph: {
    title: 'poestagram - POE 패스오브 엑자일 유저를 위한 커뮤니티',
    description: 'POE 패스오브 엑자일 유저를 위한 커뮤니티입니다. 게임 플레이 영상과 스크린샷을 공유하고 소통해보세요.',
    type: 'website',
    siteName: 'poestagram',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'poestagram - POE 패스오브 엑자일 유저를 위한 커뮤니티',
    description: 'POE 패스오브 엑자일 유저를 위한 커뮤니티입니다. 게임 플레이 영상과 스크린샷을 공유하고 소통해보세요.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console 인증 코드가 있다면 여기에 추가
    // google: 'your-google-verification-code',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 메인터넌스 모드 체크
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  
  // next-intl에서 로케일 가져오기
  const locale = await getLocale();

  // 개발 환경에서 디버깅
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Layout Debug:', {
      MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
      isMaintenanceMode,
    });
  }

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-[100svh] flex flex-col bg-black">
        {isMaintenanceMode ? (
          <MaintenanceContent />
        ) : (
          <NextIntlClientProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </NextIntlClientProvider>
        )}
      </body>
    </html>
  );
}

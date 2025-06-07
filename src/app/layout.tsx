import type { Metadata } from 'next'
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: {
    template: '%s | poestagram',
    default: 'poestagram - POE 패스오브 엑자일 유저를 위한 커뮤니티'
  },
  description: 'POE 패스오브 엑자일 유저를 위한 커뮤니티입니다. 게임 플레이 영상과 스크린샷을 공유하고 소통해보세요.',
  keywords: ['패스오브 엑자일', 'POE', 'poe', '게임', '영상', '사진', '소셜', '커뮤니티', 'poestagram', '게이머', '스크린샷', '게임플레이'],
  authors: [{ name: '싱잉버드' }],
  creator: '싱잉버드',
  publisher: '싱잉버드',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://poestagram.bird89.com'),
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-[100svh] flex flex-col bg-black">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

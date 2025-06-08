import { Suspense } from 'react';
import { Metadata } from 'next';
import AllFeeds from "@/components/feed/AllFeeds";
import { getAllFeedsServer } from "@/services/feeds.server";
import { getServerAuthToken } from "@/utils/auth.server";
import type { Feed, FeedItemProps } from "@/types/feeds";

export const metadata: Metadata = {
  title: 'poestagram',
  description: 'POE 패스오브 엑자일 유저를 위한 커뮤니티입니다. 게임 플레이 영상과 스크린샷을 공유하고 소통해보세요.',
  keywords: ['패스오브 엑자일', 'POE', 'poe', '게임', '영상', '사진', '소셜', '커뮤니티', 'poestagram', '게이머', '스크린샷', '게임플레이'],
  openGraph: {
    title: 'poestagram',
    description: 'POE 패스오브 엑자일 유저를 위한 커뮤니티입니다. 게임 플레이 영상과 스크린샷을 공유하고 소통해보세요.',
    type: 'website',
  },
}

// 서버에서 초기 피드 데이터 가져오기
async function getInitialFeedData(accessToken?: string): Promise<FeedItemProps[]> {
  const limit = 3;

  try {
    const res = await getAllFeedsServer(0, limit, accessToken);
    
    const transformed = res.feeds.map((feed: Feed): FeedItemProps => ({
      id: feed.id,
      description: feed.description,
      frame_ratio: feed.frame_ratio,
      created_at: feed.created_at,
      updated_at: feed.updated_at,
      files: feed.files,
      is_liked: feed.is_liked,
      user: feed.user,
      likes_count: feed.likes_count,
    }));

    return transformed;
  } catch (error) {
    console.error('Initial feed data fetch failed:', error);
    return [];
  }
}

export default async function Feed() {
  // 서버에서 인증 토큰 가져오기
  const accessToken = await getServerAuthToken();
  
  const initialFeedData = await getInitialFeedData(accessToken || undefined);
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
          <p className="text-center text-gray-400">로딩 중...</p>
        </div>
      </div>
    </div>}>
      <AllFeeds initialData={initialFeedData} />
    </Suspense>
  );
} 
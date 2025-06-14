import { Suspense } from 'react';
import { Metadata } from 'next';
import AllFeeds from "@/components/feed/AllFeeds";
import { getAllFeedsServer } from "@/services/feeds.server";
import { getServerAuthToken } from "@/utils/auth.server";
import type { Feed, FeedItemProps } from "@/types/feeds";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const accessToken = await getServerAuthToken();
    const { feeds } = await getAllFeedsServer(0, 1, accessToken || undefined);

    if (feeds.length === 0) {
      throw new Error('No feeds found');
    }

    const firstFeed = feeds[0];
    const username = firstFeed.user?.username || '유저';
    
    const firstFile = firstFeed.files?.[0];
    let imageUrl;
    if (firstFile) {
      imageUrl = firstFile.url_thumbnail || firstFile.url;
    }
    
    const description = firstFeed.description || '';
    const shortDescription = description.length > 100 
      ? description.substring(0, 100) + '...' 
      : description;
    
    const feedTitle = shortDescription 
      ? `${username}: ${shortDescription}`
      : `${username}의 POE 게임 콘텐츠`;

    const fullDescription = `${username}의 POE 패스오브 엑자일 게임 콘텐츠: ${description || '게임 플레이 영상과 스크린샷을 확인해보세요.'}`;

    return {
      title: 'poestagram - 피드',
      description: 'POE 패스오브 엑자일 유저들의 피드를 확인하고 소통해보세요.',
      keywords: ['피오이스타그램', 'poestagram', 'POE', '패스오브 엑자일', '게임커뮤니티', '피드'],
      openGraph: {
        title: feedTitle,
        description: fullDescription,
        type: 'website',
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: `${username}의 게임 콘텐츠`,
          }
        ] : undefined,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Failed to fetch first feed for metadata:', error);
    
    return {
      title: 'poestagram',
      description: 'POE 패스오브 엑자일 유저를 위한 커뮤니티입니다. 게임 플레이 영상과 스크린샷을 공유하고 소통해보세요.',
      keywords: ['피오이스타그램', 'poestagram', 'POE', '패스오브 엑자일', '게임커뮤니티'],
      openGraph: {
        title: 'poestagram',
        description: 'POE 패스오브 엑자일 유저를 위한 커뮤니티입니다. 게임 플레이 영상과 스크린샷을 공유하고 소통해보세요.',
        type: 'website',
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
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
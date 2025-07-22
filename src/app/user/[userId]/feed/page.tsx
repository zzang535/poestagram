import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import UserFeeds from "@/components/feed/UserFeeds";
import { getUserFeedsServer, getFeedIndexServer, getFeedDetailServer } from "@/services/feeds.server";
import { getServerAuthToken } from "@/utils/auth.server";
import { Feed, FeedItemProps } from "@/types/feeds";

interface UserFeedPageProps {
  params: Promise<{
    userId: string;
  }>;
  searchParams: Promise<{
    feed_id?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: UserFeedPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const userId = Number(resolvedParams.userId);
  const feedId = Number(resolvedSearchParams.feed_id); // 무조건 존재한다고 가정

  try {
    const accessToken = await getServerAuthToken();
    const feedDetail = await getFeedDetailServer(feedId, accessToken || undefined);
    
    // 피드 작성자 정보
    const username = feedDetail.user?.username || `User ${userId}`;
    
    // 피드의 첫 번째 파일에서 이미지 URL 가져오기 (비디오인 경우 썸네일 사용)
    const firstFile = feedDetail.files?.[0];
    let imageUrl;
    if (firstFile) {
      imageUrl = firstFile.url_thumbnail || firstFile.url;
    }
    
    // 피드 설명
    const description = feedDetail.description || '';
    const shortDescription = description.length > 100 
      ? description.substring(0, 100) + '...' 
      : description;
    
    const feedTitle = shortDescription 
      ? `${username}: ${shortDescription}`
      : `${username}의 POE 게임 콘텐츠`;

    return {
      title: `${feedTitle} - poestagram`,
      description: `${username}의 POE 패스오브 엑자일 게임 콘텐츠: ${description || '게임 플레이 영상과 스크린샷을 확인해보세요.'}`,
      keywords: ['피오이스타그램', 'poestagram', 'POE', '패스오브 엑자일', '게임커뮤니티', username],
      openGraph: {
        title: feedTitle,
        description: `${username}의 POE 게임 콘텐츠: ${description || '게임 플레이 영상과 스크린샷을 확인해보세요.'}`,
        type: 'article',
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
    console.error('Failed to fetch feed detail for metadata:', error);
    
    // 피드 정보를 가져올 수 없는 경우 기본 메타데이터
    return {
      title: 'poestagram',
      description: 'POE 패스오브 엑자일 유저를 위한 커뮤니티입니다. 게임 플레이 영상과 스크린샷을 공유하고 소통해보세요.???',
      keywords: ['피오이스타그램', 'poestagram', 'POE', '패스오브 엑자일', '게임커뮤니티'],
      openGraph: {
        title: 'poestagram',
        description: 'POE 패스오브 엑자일 유저를 위한 커뮤니티입니다. 게임 플레이 영상과 스크린샷을 공유하고 소통해보세요.',
        type: 'article',
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

export default async function UserFeed({ params, searchParams }: UserFeedPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const userId = Number(resolvedParams.userId);
  const feedId = Number(resolvedSearchParams.feed_id!); // feedId는 무조건 존재
  const limit = 3;
  const t = await getTranslations('common');

  if (isNaN(userId) || isNaN(feedId)) {
    notFound();
  }

  try {
    // feedId 인덱스 조회 후 해당 피드까지 포함한 데이터 가져오기
    const { index } = await getFeedIndexServer(userId, feedId);
    const initialLimit = index + limit;
    const res = await getUserFeedsServer(userId, 0, initialLimit);
    
    const initialData = res.feeds.map((feed: Feed): FeedItemProps => ({
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

    return <UserFeeds userId={userId} initialData={initialData} targetFeedIndex={index} targetFeedId={feedId} />;
  } catch (error) {
    console.error("피드 데이터 조회 실패:", error);
    
    return (
      <div className="min-h-screen bg-black text-white p-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-center text-red-500">{t('loadError')}</p>
            <p className="text-center text-gray-400">{t('refreshPage')}</p>
          </div>
        </div>
      </div>
    );
  }
} 
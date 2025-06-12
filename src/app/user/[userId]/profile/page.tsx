import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Profile from "@/components/profile/Profile";
import { getUserProfileServer, getUserFeedsServer } from "@/services/feeds.server";
import { getServerAuthToken } from "@/utils/auth.server";
import { Feed } from "@/types/feeds";
import { UserProfile } from "@/types/users";

interface UserProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  try {
    const userProfile = await getUserProfileServer(userId);
    
    // 프로필 이미지 URL
    const imageUrl = userProfile.profile_image_url;
    
    // 프로필 설명 (bio가 있으면 사용, 없으면 기본 설명)
    const profileDescription = userProfile.bio || 
      `${userProfile.username}님의 POE 패스오브 엑자일 게임 콘텐츠를 확인해보세요.`;
    
    const profileTitle = `${userProfile.username} - poestagram`;

    return {
      title: profileTitle,
      description: `${userProfile.username}님의 프로필 페이지입니다. ${profileDescription}`,
      keywords: ['피오이스타그램', 'poestagram', 'POE', '패스오브 엑자일', '게임커뮤니티', userProfile.username],
      openGraph: {
        title: profileTitle,
        description: `${userProfile.username}님의 프로필: ${profileDescription}`,
        type: 'profile',
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 400,
            height: 400,
            alt: `${userProfile.username}님의 프로필 사진`,
          }
        ] : undefined,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Failed to fetch user profile for metadata:', error);
    
    // 프로필 정보를 가져올 수 없는 경우 기본 메타데이터
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

export default async function ProfilePage({ params }: UserProfilePageProps) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    notFound();
  }

  try {
    // 프로필 정보와 피드 정보를 병렬로 가져오기
    const [userProfile, userFeedsResponse] = await Promise.all([
      getUserProfileServer(userId),
      getUserFeedsServer(userId, 0, 100)
    ]);

    return (
      <Profile 
        userId={resolvedParams.userId} 
        initialProfile={userProfile}
        initialFeeds={userFeedsResponse.feeds}
      />
    );
  } catch (error) {
    console.error("프로필 데이터 조회 실패:", error);
    
    return (
      <div className="min-h-screen bg-black text-white p-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-center text-red-500">프로필을 불러오는 중 오류가 발생했습니다.</p>
            <p className="text-center text-gray-400">페이지를 새로고침해 주세요.</p>
          </div>
        </div>
      </div>
    );
  }
} 
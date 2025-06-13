import { MetadataRoute } from 'next'

// 사이트맵용 사용자 정보 타입 정의
interface UserForSitemap {
  id: number;
  updated_at: string;
}

// 사이트맵용 피드 정보 타입 정의
interface FeedForSitemap {
  id: number;
  user_id: number;
  updated_at: string;
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://poestagram.com'
  
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/feed`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  // 동적 사이트맵
  // 사용자 URL 가져오기
  let userUrls: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/for-sitemap`);
    if (!response.ok) throw new Error('Failed to fetch users for sitemap');
    const users: UserForSitemap[] = await response.json();
    userUrls = users.map(user => ({
      url: `${baseUrl}/user/${user.id}`,
      lastModified: new Date(user.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching users for sitemap:", error);
  }

  // 피드 URL 가져오기
  let feedUrls: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feeds/for-sitemap`);
    if (!response.ok) throw new Error('Failed to fetch feeds for sitemap');
    const feeds: FeedForSitemap[] = await response.json();
    feedUrls = feeds.map(feed => ({
      url: `${baseUrl}/user/${feed.user_id}/feed?feed_id=${feed.id}`,
      lastModified: new Date(feed.updated_at),
      changeFrequency: 'daily', // 피드는 더 자주 업데이트될 수 있으므로 'daily'로 설정
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error fetching feeds for sitemap:", error);
  }

  return [...staticRoutes, ...userUrls, ...feedUrls];
} 
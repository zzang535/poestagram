"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUserFeeds } from "@/apis/feeds";

import { useAuthStore } from "@/store/authStore";

interface ProfileProps {
  userId: string | number;
}

interface FeedFile {
  id: number;
  file_name: string;
  base_url: string;
  s3_key: string;
  file_type: string;
  file_size: number;
  created_at: string;
  updated_at: string | null;
}

interface Feed {
  id: number;
  description: string;
  user_id: number;
  created_at: string;
  updated_at: string | null;
  files: FeedFile[];
}

export default function Profile({ userId }: ProfileProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [totalFeeds, setTotalFeeds] = useState(0);

  // 내 피드 불러오기
  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        setLoading(true);
        const response = await getUserFeeds(Number(userId), 0, 100); // 최대 100개 가져오기
        setFeeds(response.feeds);
        setTotalFeeds(response.total);
      } catch (error) {
        console.error("피드를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  const handlePostClick = (feedId: number) => {
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      router.push(`/user/${currentUser.id}/feed?feed_id=${feedId}`);
    }
  };

  // 파일 URL 생성 함수
  const getFileUrl = (file: FeedFile) => {
    return `${file.base_url}/${file.s3_key}`;
  };

  return (
    <div className="bg-gray-950 text-white py-[73px]">
      {/* 프로필 정보 섹션 */}
      <section className="px-5 py-6 border-b border-gray-800">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src="/no-profile.svg"
              alt="프로필 이미지"
              className="w-20 h-20 rounded-full object-cover bg-gray-700"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{useAuthStore.getState().user?.nickname}</h2>
            <p className="text-gray-400 mt-1">{totalFeeds} 게시물</p>
          </div>
        </div>
      </section>

      {/* 로딩 상태 표시 */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-400">피드를 불러오는 중...</p>
        </div>
      )}

      {/* 게시물 그리드 */}
      {!loading && feeds.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-400">게시물이 없습니다.</p>
        </div>
      )}

      {/* 게시물 그리드 */}
      {!loading && feeds.length > 0 && (
        <section className="grid grid-cols-3 gap-px">
          {feeds.map((feed) => (
            <div 
              key={feed.id} 
              className="relative aspect-square group cursor-pointer"
              onClick={() => handlePostClick(feed.id)}
            >
              {feed.files.length > 0 && (
                <img
                  src={getFileUrl(feed.files[0])}
                  alt={`게시물 ${feed.id}`}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* 파일이 없는 경우 대체 내용 표시 */}
              {feed.files.length === 0 && (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <p className="text-gray-400 text-xs p-2 text-center truncate">
                    {feed.description || "텍스트 게시물"}
                  </p>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6">
                {feed.files.length > 1 && (
                  <div className="absolute top-2 right-2 text-white">
                    <i className="fa-solid fa-images"></i>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
} 
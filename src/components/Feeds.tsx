"use client";

import { useAuthStore } from '@/store/authStore';
import FeedItem from "@/components/FeedItem";
import { getUserFeeds } from "@/apis/feeds";
import { useState, useEffect } from "react";

interface FeedData {
  userImage: string;
  userRole: string;
  postImage: string;
  likes: number;
  username: string;
  content: string;
  comments: number;
}

interface FeedsProps {
  userId?: number;
}

export default function Feeds({ userId }: FeedsProps) {
  const { user } = useAuthStore();
  const [feedData, setFeedData] = useState<FeedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      if (userId) {
        // 특정 유저의 피드 가져오기
        try {
          setLoading(true);
          const response = await getUserFeeds(userId, 0, 100);
          
          // API 응답을 FeedData 형식으로 변환
          const transformedFeeds = response.feeds.map(feed => ({
            userImage: "/no-profile.svg", // 기본 프로필 이미지
            userRole: "게이머", // 기본 역할
            postImage: feed.files.length > 0 ? `${feed.files[0].base_url}/${feed.files[0].s3_key}` : "",
            likes: 0, // 기본값
            username: user?.nickname || "익명",
            content: feed.description,
            comments: 0 // 기본값
          }));

          setFeedData(transformedFeeds);
        } catch (error) {
          console.error("피드 데이터를 가져오는 중 오류 발생:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // 전체 피드 (더미 데이터)
        const dummyFeeds: FeedData[] = [
          {
            userImage: "/no-profile.svg",
            userRole: "게이머",
            postImage: "https://picsum.photos/800/600",
            likes: 123,
            username: "게이머1",
            content: "오늘의 게임 플레이! #게임 #플레이",
            comments: 45
          },
          {
            userImage: "/no-profile.svg",
            userRole: "게이머",
            postImage: "https://picsum.photos/800/600",
            likes: 456,
            username: "게이머2",
            content: "새로 산 게임 기어! #게임기어 #새장비",
            comments: 78
          },
          {
            userImage: "/no-profile.svg",
            userRole: "게이머",
            postImage: "https://picsum.photos/800/600",
            likes: 789,
            username: "게이머3",
            content: "게임 클리어! #클리어 #게임",
            comments: 112
          }
        ];
        setFeedData(dummyFeeds);
        setLoading(false);
      }
    };

    fetchFeeds();
  }, [user, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400">피드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* 피드 내용 */}
        <div className="space-y-4">
          {feedData.map((feed, index) => (
            <FeedItem
              key={index}
              userImage={feed.userImage}
              userRole={feed.userRole}
              postImage={feed.postImage}
              likes={feed.likes}
              username={feed.username}
              content={feed.content}
              comments={feed.comments}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 
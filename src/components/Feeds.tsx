"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from '@/store/authStore';
import FeedItem from "@/components/FeedItem";
import { getUserFeeds, getAllFeeds, getFeedIndex } from "@/apis/feeds";

interface FeedData {
  id: number;
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
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [feedData, setFeedData] = useState<FeedData[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(3);
  
  const feedId = searchParams.get('feed_id');

  const scrollThrottle = useRef(false);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const targetFeedRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);


  useEffect(() => {
    // 스크롤 되는 영역 찾기
    const container = document.querySelector("main");
    if (!container) return;
  
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
  
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (!loadingRef.current && hasMoreRef.current && !scrollThrottle.current) {
          scrollThrottle.current = true; // 🔒 막기
          setOffset(prev => prev + limit);
          setTimeout(() => { scrollThrottle.current = false; }, 1000); // ← 이 시간 동안 재호출 방지
        }
      }
    };
  
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  
  useEffect(() => {
    const fetchFeedIndex = async () => {
      if (!userId) return;
      const { index } = await getFeedIndex(Number(userId), Number(feedId));

      const initialLimit = index + limit;
      const response = await getUserFeeds(Number(userId), 0, initialLimit);

      const transformedFeeds = response.feeds.map(feed => ({
        id: feed.id,
        userImage: "/no-profile.svg",
        userRole: "게이머",
        postImage: feed.files.length > 0 ? `${feed.files[0].base_url}/${feed.files[0].s3_key}` : "",
        likes: 0,
        username: user?.nickname || "익명",
        content: feed.description,
        comments: 0
      }));

      setFeedData(transformedFeeds);
      setIsReady(true);
      setOffset(initialLimit);
    };
    fetchFeedIndex();
  }, []);


  useEffect(() => {
    if (isReady && targetFeedRef.current) {
      // 스크롤 되는 영역 찾기
      const container = document.querySelector("main");
      if (!container) return;
  
      const containerTop = container.getBoundingClientRect().top;
      const targetTop = targetFeedRef.current.getBoundingClientRect().top;
      const headerHeight = 64;
  
      const scrollPosition = targetTop - containerTop + container.scrollTop - headerHeight - 12;
  
      container.scrollTo({
        top: scrollPosition,
        behavior: "auto",
      });
    }
  }, [isReady]);

  useEffect(() => {
    const fetchFeeds = async () => {
        console.log("fetchFeeds");
      try {
        setLoading(true);
        loadingRef.current = true;

        // ✅ 1초(1000ms) 지연
        await new Promise(resolve => setTimeout(resolve, 2000));

        let response;
        if (userId) {
          if (!isReady) return;
          response = await getUserFeeds(userId, offset, limit);
        } else {
          response = await getAllFeeds(offset, limit);
        }
        
        const transformedFeeds = response.feeds.map(feed => ({
          id: feed.id,
          userImage: "/no-profile.svg",
          userRole: "게이머",
          postImage: feed.files.length > 0 ? `${feed.files[0].base_url}/${feed.files[0].s3_key}` : "",
          likes: 0,
          username: user?.nickname || "익명",
          content: feed.description,
          comments: 0
        }));
        setFeedData(prevFeeds => [...prevFeeds, ...transformedFeeds]);
        hasMoreRef.current = response.feeds.length === limit;
      } catch (error) {
        console.error("피드 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    fetchFeeds();
  }, [offset]);

    if (feedData.length === 0 && loading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
          </div>
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
            <div key={index} ref={feed.id === Number(feedId) ? targetFeedRef : null}>
              <FeedItem
                userImage={feed.userImage}
                userRole={feed.userRole}
                postImage={feed.postImage}
                likes={feed.likes}
                username={feed.username}
                content={feed.content}
                comments={feed.comments}
              />
            </div>
          ))}
        </div>
        {loading && feedData.length > 0 && (
          <div className="flex flex-col items-center justify-center space-y-4 mt-4">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
} 
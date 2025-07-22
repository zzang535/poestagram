"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getUserFeeds, getFeedIndex } from "@/services/feeds";
import FeedItem from "@/components/feed/FeedItem";
import { Feed, FeedItemProps } from "@/types/feeds";

interface UserFeedsProps {
  userId: number;
  initialData: FeedItemProps[];
  targetFeedIndex?: number;
  targetFeedId: number;
}

export default function UserFeeds({ userId, initialData, targetFeedIndex = 0, targetFeedId }: UserFeedsProps) {
  const limit = 3;
  const t = useTranslations('feeds');
  
  const [feedData, setFeedData] = useState<FeedItemProps[]>(initialData);
  const [offset, setOffset] = useState(initialData.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.length === limit || initialData.length > limit);
  const [error, setError] = useState<string | null>(null);
  
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const offsetRef = useRef(0);
  const errorRef = useRef<string | null>(null);

  const targetFeedRef = useRef<HTMLDivElement | null>(null);

  // refs 업데이트
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    errorRef.current = error;
  }, [error]);

  // 피드 아이템 삭제 핸들러
  const handleDeleteFeedItem = (feedIdToDelete: number) => {
    setFeedData(prevFeedData => prevFeedData.filter(feed => feed.id !== feedIdToDelete));
    setOffset(prevOffset => Math.max(0, prevOffset - 1));
  };

  const fetchFeeds = async (offsetVal: number, limitVal: number) => {
    setLoading(true);
    setError(null);
    
    // 1초 지연
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const res = await getUserFeeds(userId, offsetVal, limitVal);

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

      setFeedData(prev => [...prev, ...transformed]);
      setHasMore(res.feeds.length === limitVal);
    } catch (e) {
      console.error("피드 로딩 실패:", e);
      setError(t('loadError'));
    } finally {
      setLoading(false);
    }
  };

  // 재시도 함수 (무한스크롤 재시도)
  const handleRetry = () => {
    fetchFeeds(offset, limit);
  };

  // 무한 스크롤
  useEffect(() => {
    const container = document.querySelector("main");
    if (!container) return;
  
    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >= container.scrollHeight - 100 &&
        !loadingRef.current &&
        hasMoreRef.current &&
        !errorRef.current
      ) {
        const nextOffset = offsetRef.current;
        setOffset(nextOffset + limit);
        fetchFeeds(nextOffset, limit);
      }
    };
  
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []); 

  // 특정 피드로 스크롤
  useEffect(() => {
    if (targetFeedId && targetFeedRef.current) {
      const container = document.querySelector("main");
      if (!container) return;

      const scrollPosition =
        targetFeedRef.current.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop -
        64 -
        12;

      container.scrollTo({ top: scrollPosition, behavior: "auto" });
    }
  }, [targetFeedId]);

  return (
    <div className="min-h-screen bg-black text-white pt-[64px] pb-[78px]">
      <div className="max-w-4xl mx-auto">
        {/* 게시물이 없는 경우 */}
        {feedData.length === 0 && !loading && !error && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-142px)] px-4">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">{t('noPosts')}</h3>
              </div>
            </div>
          </div>
        )}

        {/* 게시물 목록 */}
        {feedData.length > 0 && (
          <div className="space-y-4">
            {feedData.map((feed) => (
              <div key={feed.id} ref={feed.id === targetFeedId ? targetFeedRef : null}>
                <FeedItem
                  id={feed.id}
                  files={feed.files}
                  description={feed.description}
                  frame_ratio={feed.frame_ratio}
                  created_at={feed.created_at}
                  updated_at={feed.updated_at}
                  is_liked={feed.is_liked}
                  user={feed.user}
                  likes_count={feed.likes_count}
                  onDeleteSuccess={handleDeleteFeedItem}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* 로딩 상태 */}
        {loading && (
          <div className="flex flex-col items-center justify-center space-y-4 mt-4">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        {/* 더 이상 게시물이 없는 경우 */}
        {!loading && !hasMore && feedData.length > 0 && !error && (
          <div className="flex flex-col items-center justify-center space-y-4 mt-4 p-4">
            <div className="text-center text-gray-400">
              <p className="text-sm">{t('noMorePosts')}</p>
            </div>
          </div>
        )}
        
        {/* 에러 상태 */}
        {error && (
          <div className="flex flex-col items-center justify-center space-y-4 mt-4 p-4">
            <div className="text-center text-red-500">
              {error}
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('retry')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
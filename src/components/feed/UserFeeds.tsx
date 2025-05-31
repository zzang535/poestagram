"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getUserFeeds, getFeedIndex } from "@/apis/feeds";
import { useAuthStore } from "@/store/authStore";
import FeedItem from "@/components/feed/FeedItem";
import { Feed, FeedItemProps } from "@/types/feeds";

interface UserFeedsProps {
  userId: number;
}

export default function UserFeeds({ userId }: UserFeedsProps) {
  const searchParams = useSearchParams();
  const limit = 3;
  
  const [feedData, setFeedData] = useState<FeedItemProps[]>([]);
  const [offset, setOffset] = useState(0);
  const [initDone, setInitDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const didInitRef = useRef(false);

  // 유저 피드 플로우에 필요한 데이터
  const feedId = searchParams.get('feed_id');
  const accessToken = useAuthStore((s) => s.accessToken);
  const targetFeedRef = useRef<HTMLDivElement | null>(null);
  const [targetFeedIndex, setTargetFeedIndex] = useState(0);

  // 피드 아이템 삭제 핸들러
  const handleDeleteFeedItem = (feedIdToDelete: number) => {
    setFeedData(prevFeedData => prevFeedData.filter(feed => feed.id !== feedIdToDelete));
    setOffset(prevOffset => Math.max(0, prevOffset - 1));
  };

  // 로그아웃 시 상태 초기화
  useEffect(() => {
    setOffset(0);
    setFeedData([]);
    setInitDone(false);
    setLoading(false);
    setHasMore(true);
    setError(null);
    didInitRef.current = false;
  }, [accessToken]); 

  // 첫 로딩
  useEffect(() => {
    if (didInitRef.current) return; 
    didInitRef.current = true;

    const init = async () => {
      try {
        if (feedId) {
          const { index } = await getFeedIndex(userId, Number(feedId));
          setTargetFeedIndex(index);
          const initialLimit = index + limit;
          await fetchFeeds(0, initialLimit);
        } else {
          await fetchFeeds(0, limit);
        }
        setInitDone(true);
      } catch (e) {
        console.error("초기 로딩 실패:", e);
        setError("피드를 불러오는 중 오류가 발생했습니다.");
        setInitDone(true);
      }
    };
    init();
  }, [accessToken, userId, feedId]);

  const fetchFeeds = async (offsetVal: number, limitVal: number) => {
    setLoading(true);
    setError(null);
    
    // 1초 지연
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // 자동 재시도 제거 - 일반 fetch만 사용
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
      setError("피드를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 재시도 함수
  const handleRetry = () => {
    if (feedData.length === 0) {
      // 초기 로딩 재시도
      const init = async () => {
        try {
          if (feedId) {
            const { index } = await getFeedIndex(userId, Number(feedId));
            setTargetFeedIndex(index);
            const initialLimit = index + limit;
            await fetchFeeds(0, initialLimit);
          } else {
            await fetchFeeds(0, limit);
          }
        } catch (e) {
          console.error("재시도 실패:", e);
          setError("피드를 불러오는 중 오류가 발생했습니다.");
        }
      };
      init();
    } else {
      // 무한스크롤 재시도
      const nextOffset = offset + targetFeedIndex + limit;
      fetchFeeds(nextOffset, limit);
    }
  };

  // 무한 스크롤
  useEffect(() => {
    if (!initDone) return;

    const container = document.querySelector("main");
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >= container.scrollHeight - 100 &&
        !loadingRef.current &&
        hasMoreRef.current &&
        !error
      ) {
        const nextOffset = offset + targetFeedIndex + limit;
        setOffset(nextOffset);
        setTargetFeedIndex(0);
        fetchFeeds(nextOffset, limit);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [offset, initDone, error, targetFeedIndex]);

  // 특정 피드로 스크롤
  useEffect(() => {
    if (initDone && targetFeedRef.current) {
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
  }, [initDone]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  if (!initDone) {
    return (
      <div className="min-h-screen bg-black text-white p-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4">
            {error ? (
              <>
                <div className="text-center text-red-500 mb-4">
                  {error}
                </div>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  다시 시도
                </button>
              </>
            ) : (
              <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-[64px] pb-[78px]">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {feedData.map((feed, index) => (
            <div key={index} ref={feed.id === Number(feedId) ? targetFeedRef : null}>
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
        
        {/* 로딩 상태 */}
        {loading && feedData.length > 0 && (
          <div className="flex flex-col items-center justify-center space-y-4 mt-4">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* 에러 상태 */}
        {error && feedData.length > 0 && (
          <div className="flex flex-col items-center justify-center space-y-4 mt-4 p-4">
            <div className="text-center text-red-500">
              {error}
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
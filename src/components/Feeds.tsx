"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getUserFeeds, getAllFeeds, getFeedIndex } from "@/apis/feeds";
import { useAuthStore } from "@/store/authStore";
import FeedItem from "@/components/FeedItem";
import { Feed, FeedItemProps } from "@/types/feeds";
import { fetchWithRetry } from "@/utils/ferch-utils";
interface FeedsProps {
  userId?: number;
}

export default function Feeds({ userId }: FeedsProps) {
  
  const searchParams = useSearchParams();
  const limit = 3;
  
  const [feedData, setFeedData] = useState<FeedItemProps[]>([]);
  const [offset, setOffset] = useState(0);
  const [initDone, setInitDone] = useState(false);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const didInitRef = useRef(false);

  // 유저 피드 플로우에 필요한 데이터
  const feedId = searchParams.get('feed_id');
  const accessToken = useAuthStore((s) => s.accessToken);
  const targetFeedRef = useRef<HTMLDivElement | null>(null);
  const [targetFeedIndex, setTargetFeedIndex] = useState(0);


  // feed 페이지에서 로그아웃 되는 경우 대응
  useEffect(() => {
    setOffset(0);
    setFeedData([]);
    setInitDone(false);
    setLoading(false);
    setHasMore(true);
    didInitRef.current = false;
  }, [accessToken]); 

  // 첫 로딩
  useEffect(() => {

    // 개발모드에서 두 번째 실행 방지
    if (didInitRef.current) return; 
    didInitRef.current = true;


    const init = async () => {
      if (userId && feedId) {
        const { index } = await getFeedIndex(Number(userId), Number(feedId));
        setTargetFeedIndex(index);
        const initialLimit = index + limit;
        await fetchFeeds(0, initialLimit);
      } else {
        await fetchFeeds(0, limit);
      }
      setInitDone(true);
    };
    init();
  }, [accessToken]);


  const fetchFeeds = async (offsetVal: number, limitVal: number) => {
    setLoading(true);
    // don 에 붙기 전에 1초 지연
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const fetchFn = () => {
        if (userId) {
          return getUserFeeds(userId, offsetVal, limitVal);
        } else {
          return getAllFeeds(offsetVal, limitVal);
        }
      };
  
      // fetch 실패한 경우 1번더 시도
      const res = await fetchWithRetry(fetchFn);

      console.log(res);

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
      setHasMore(res.feeds.length == limitVal);
    } catch (e) {
      console.error("피드 로딩 실패:", e);
    } finally {

   
      setLoading(false);
    }
  };


  // 무한 스크롤
  useEffect(() => {

    if (!initDone) return;

    const container = document.querySelector("main");
    if (!container) return;

    const handleScroll = () => {
      // 무한스크롤이 작동하는 조건 : 
      // 스크롤 되는 영역 진입
      // 로딩중이 아님
      // 더 불러올 데이터가 있음
      // 스크롤 애니메이션 중이 아님
      if (
        container.scrollTop + container.clientHeight >= container.scrollHeight - 100 &&
        !loadingRef.current &&
        hasMoreRef.current 
      ) {
        const nextOffset = offset + targetFeedIndex + limit;
        setOffset(nextOffset);
        setTargetFeedIndex(0);
        fetchFeeds(nextOffset, limit);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [offset, initDone]);

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
            <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-black text-white pt-[64px] pb-[78px]">
        <div className="max-w-4xl mx-auto">
          {/* 피드 내용 */}
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

  
} 
"use client";

import { useAuthStore } from '@/store/authStore';
import FeedItem from "@/components/FeedItem";
import { getUserFeeds, getAllFeeds } from "@/apis/feeds";
import { useState, useEffect, useRef, useCallback } from "react";

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
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 3;
  const isInitialMount = useRef(true);
  
  const observer = useRef<IntersectionObserver | null>(null);

  const lastFeedElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prevOffset => prevOffset + limit);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        if (isInitialMount.current) {
          setLoading(true);
          isInitialMount.current = false;
        }

        let response;
        if (userId) {
          response = await getUserFeeds(userId, offset, limit);
        } else {
          response = await getAllFeeds(offset, limit);
        }
        
        const transformedFeeds = response.feeds.map(feed => ({
          userImage: "/no-profile.svg",
          userRole: "게이머",
          postImage: feed.files.length > 0 ? `${feed.files[0].base_url}/${feed.files[0].s3_key}` : "",
          likes: 0,
          username: user?.nickname || "익명",
          content: feed.description,
          comments: 0
        }));

        if (offset === 0) {
          setFeedData(transformedFeeds);
        } else {
          setFeedData(prevFeeds => [...prevFeeds, ...transformedFeeds]);
        }
        setHasMore(response.feeds.length === limit);
      } catch (error) {
        console.error("피드 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, [user, userId, offset]);

  if (feedData.length === 0 && loading) {
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
            <div
              key={index}
              ref={index === feedData.length - 1 ? lastFeedElementRef : null}
            >
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
          <div className="text-center text-gray-400 mt-4">
            <p>더 많은 피드를 불러오는 중...</p>
          </div>
        )}
        {/* {!hasMore && feedData.length > 0 && (
          <div className="text-center text-gray-400 mt-4">
            <p>모든 피드를 불러왔습니다.</p>
          </div>
        )} */}
      </div>
    </div>
  );
} 
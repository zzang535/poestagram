"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getUserFeeds } from "@/apis/feeds";
import { getUserProfile } from "@/apis/users";
import { Feed, FeedFile } from "@/types/feeds";
import { UserProfile } from "@/types/users";
import { useAuthStore } from "@/store/authStore";

export default function Profile() {
  const router = useRouter();
  const params = useParams();
  const userIdFromParams = params.userId as string;

  const [profileLoading, setProfileLoading] = useState(true);
  const [feedsLoading, setFeedsLoading] = useState(true);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const authUser = useAuthStore.getState().user;

  useEffect(() => {
    if (!userIdFromParams) return;
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        const profileData = await getUserProfile(userIdFromParams);
        setUserProfile(profileData);
      } catch (error) {
        console.error("사용자 프로필 정보를 불러오는 중 오류 발생:", error);
        router.push("/not-found");
      } finally {
        setProfileLoading(false);
      }
    };
    fetchUserProfile();
  }, [userIdFromParams, router]);

  useEffect(() => {
    if (!userIdFromParams) return;
    const fetchUserFeeds = async () => {
      try {
        setFeedsLoading(true);
        const response = await getUserFeeds(Number(userIdFromParams), 0, 100);
        setFeeds(response.feeds);
      } catch (error) {
        console.error("피드를 불러오는 중 오류 발생:", error);
      } finally {
        setFeedsLoading(false);
      }
    };
    fetchUserFeeds();
  }, [userIdFromParams]);

  const handlePostClick = (feedId: number) => {
    if (userIdFromParams) {
      router.push(`/user/${userIdFromParams}/feed?feed_id=${feedId}`);
    }
  };

  const getFileUrl = (file: FeedFile) => {
    return `${file.base_url}/${file.s3_key}`;
  };

  const getThumbnailUrl = (file: FeedFile) => {
    return file.s3_key_thumbnail ? `${file.base_url}/${file.s3_key_thumbnail}` : getFileUrl(file);
  };

  const isLoading = profileLoading || feedsLoading;

  if (isLoading) {
    return (
      <div className="bg-gray-950 text-white py-[73px] min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="bg-gray-950 text-white py-[73px] min-h-screen flex justify-center items-center">
        <p className="text-gray-400">사용자 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white py-[73px]">
      <section className="px-5 py-6 border-b border-gray-800">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={userProfile.profileImage || "/default-profile.svg"}
              alt={`${userProfile.username} 프로필 이미지`}
              className="w-20 h-20 rounded-full object-cover bg-gray-700"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{userProfile.username}</h2>
            <p className="text-gray-400 mt-1">{userProfile.postCount} 게시물</p>
          </div>
        </div>
      </section>

      {feedsLoading && feeds.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-400">피드를 불러오는 중...</p>
        </div>
      )}

      {!feedsLoading && feeds.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-400">게시물이 없습니다.</p>
        </div>
      )}

      {!feedsLoading && feeds.length > 0 && (
        <section className="grid grid-cols-3 gap-px">
          {feeds.map((feed) => (
            <div 
              key={feed.id} 
              className="relative aspect-square group cursor-pointer"
              onClick={() => handlePostClick(feed.id)}
            >
              {feed.files.length > 0 && (
                <img
                  src={feed.files[0].content_type.startsWith('video') 
                    ? getThumbnailUrl(feed.files[0])
                    : getFileUrl(feed.files[0])}
                  alt={`게시물 ${feed.id}`}
                  className="w-full h-full object-cover"
                />
              )}
              
              {feed.files.length === 0 && (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <p className="text-gray-400 text-xs p-2 text-center truncate">
                    {feed.description || "텍스트 게시물"}
                  </p>
                </div>
              )}
              
              {feed.files.length > 1 && (
                  <div className="absolute top-2 right-2 text-white bg-black/50 p-1 rounded-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 12l4.179 2.25M6.429 9.75L2.25 12l4.179 2.25m0 0l5.571 3m5.571-3l-5.571-3m0 0l5.571-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.001c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
} 
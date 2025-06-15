"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getUserFeeds } from "@/services/feeds";
import { getUserProfile } from "@/services/users";
import { Feed, FeedFile } from "@/types/feeds";
import { UserProfile } from "@/types/users";
import { useAuthStore } from "@/store/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

interface ProfileProps {
  userId: string;
  initialProfile?: UserProfile;
  initialFeeds?: Feed[];
}

export default function Profile({ userId, initialProfile, initialFeeds }: ProfileProps) {
  const router = useRouter();

  const [profileLoading, setProfileLoading] = useState(!initialProfile);
  const [feedsLoading, setFeedsLoading] = useState(!initialFeeds);
  const [feeds, setFeeds] = useState<Feed[]>(initialFeeds || []);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialProfile || null);
  const [showMenu, setShowMenu] = useState(false);
  const authUser = useAuthStore((s) => s.user);
  const menuRef = useRef<HTMLDivElement>(null);

  // 현재 프로필이 로그인한 유저의 것인지 확인
  const isOwnProfile = authUser && userProfile && authUser.id === Number(userId);

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    // 초기 프로필 데이터가 없는 경우에만 fetch
    if (!userId || initialProfile) return;
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        const profileData = await getUserProfile(userId);
        setUserProfile(profileData);
      } catch (error) {
        console.error("사용자 프로필 정보를 불러오는 중 오류 발생:", error);
        router.push("/not-found");
      } finally {
        setProfileLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId, router, initialProfile]);

  useEffect(() => {
    // 초기 피드 데이터가 없는 경우에만 fetch
    if (!userId || initialFeeds) return;
    const fetchUserFeeds = async () => {
      try {
        setFeedsLoading(true);
        const response = await getUserFeeds(Number(userId), 0, 100);
        setFeeds(response.feeds);
      } catch (error) {
        console.error("피드를 불러오는 중 오류 발생:", error);
      } finally {
        setFeedsLoading(false);
      }
    };
    fetchUserFeeds();
  }, [userId, initialFeeds]);

  const handlePostClick = (feedId: number) => {
    if (userId) {
      router.push(`/user/${userId}/feed?feed_id=${feedId}`);
    }
  };

  const getFileUrl = (file: FeedFile) => {
    return file.url;
  };

  const getThumbnailUrl = (file: FeedFile) => {
    return file.url_thumbnail || file.url;
  };



  const isLoading = profileLoading || feedsLoading;

  if (isLoading) {
    return (
      <div className="bg-black text-white py-[73px] min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="bg-black text-white py-[73px] min-h-screen flex justify-center items-center">
        <p className="text-gray-400">사용자 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-[73px]">
      <section className="px-5 py-6 border-b border-zinc-900">
        <div className="flex items-center space-x-6 relative">
          <div className="relative">
            <img
              src={userProfile.profile_image_url || "/default-profile.svg"}
              alt={`${userProfile.username} 프로필 이미지`}
              className="w-20 h-20 rounded-full object-cover bg-gray-700"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{userProfile.username}</h2>
            <p className="text-gray-400 mt-1">{userProfile.feeds_count} 게시물</p>
            {userProfile.bio && (
              <p className="text-gray-300 mt-2 text-sm">{userProfile.bio}</p>
            )}
          </div>
          {/* 본인 프로필인 경우 더보기 버튼 표시 */}
          {isOwnProfile && (
            <div className="absolute top-0 right-0">
              <button 
                className="text-gray-400 hover:text-white p-2"
                onClick={() => setShowMenu(!showMenu)}
              >
                <FontAwesomeIcon icon={faEllipsis} className="text-lg" />
              </button>
              {showMenu && (
                <div 
                  ref={menuRef}
                  className="absolute right-0 mt-1 w-32 bg-zinc-800 rounded-md shadow-lg z-10 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      router.push('/edit-profile');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700 transition-colors"
                  >
                    프로필 편집
                  </button>
                </div>
              )}
            </div>
          )}
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
                <Image
                  src={feed.files[0].content_type.startsWith('video') 
                    ? getThumbnailUrl(feed.files[0])
                    : getFileUrl(feed.files[0])}
                  alt={`게시물 ${feed.id}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
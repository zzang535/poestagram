"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faHeart as faSolidHeart, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart, faComment, faBookmark } from "@fortawesome/free-regular-svg-icons";
import CommentModal from "@/components/comment/CommentModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { FeedItemProps } from "@/types/feeds";
import { toggleLikeFeedApi, deleteFeed } from "@/apis/feeds";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";


export default function FeedItem({
  id,
  files,
  description,
  frame_ratio,
  created_at,
  updated_at,
  is_liked,
  user,
  likes_count,
  onDeleteSuccess,
}: FeedItemProps & { onDeleteSuccess?: (feedId: number) => void }) {

  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const currentUser = useAuthStore((s) => s.user);

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentIsLiked, setCurrentIsLiked] = useState(is_liked);
  const [currentLikesCount, setCurrentLikesCount] = useState(likes_count || 0);
  const [activeMenuFeedId, setActiveMenuFeedId] = useState<number | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 터치 드래그 관련 상태
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [touchDirection, setTouchDirection] = useState<'horizontal' | 'vertical' | null>(null);

  // 화면 크기 감지 (768px 이상을 PC로 간주)
  const [isMobile, setIsMobile] = useState(false);

  // 최소 드래그 거리 (px) - 슬라이드 완료를 위한 threshold
  const minSwipeDistance = 50;
  // 컨테이너 너비의 30% 이상 드래그해야 슬라이드
  const swipeThreshold = 0.3;
  // 방향 판단을 위한 최소 움직임 거리
  const directionThreshold = 10;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuFeedId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 화면 크기 감지
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < files.length - 1 ? prev + 1 : prev));
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // 터치 이벤트 핸들러
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
    setIsDragging(false);
    setDragOffset(0);
    setTouchDirection(null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
    
    const deltaX = currentTouch.x - touchStart.x;
    const deltaY = currentTouch.y - touchStart.y;
    
    // 방향이 아직 결정되지 않았고, 충분한 움직임이 있을 때 방향 판단
    if (!touchDirection && (Math.abs(deltaX) > directionThreshold || Math.abs(deltaY) > directionThreshold)) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 수평 드래그 의도
        setTouchDirection('horizontal');
        setIsDragging(true);
        e.preventDefault(); // 스크롤 방지
      } else {
        // 수직 스크롤 의도
        setTouchDirection('vertical');
        return; // 드래그 처리하지 않음
      }
    }
    
    // 수평 드래그가 확정된 경우에만 드래그 오프셋 계산
    if (touchDirection === 'horizontal' && isDragging) {
      // 첫 번째 이미지에서 오른쪽으로 드래그하거나 마지막 이미지에서 왼쪽으로 드래그하는 경우 제한
      if ((currentImageIndex === 0 && deltaX > 0) || 
          (currentImageIndex === files.length - 1 && deltaX < 0)) {
        setDragOffset(deltaX * 0.3); // 저항감 있게 조금만 움직임
      } else {
        setDragOffset(deltaX);
      }
      
      setTouchEnd(currentTouch.x);
      e.preventDefault(); // 스크롤 방지
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !isDragging || touchDirection !== 'horizontal') {
      // 상태 초기화
      setIsDragging(false);
      setDragOffset(0);
      setTouchDirection(null);
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }
    
    const distance = touchStart.x - touchEnd;
    const containerWidth = window.innerWidth; // 또는 실제 컨테이너 너비
    const threshold = containerWidth * swipeThreshold;
    
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe && currentImageIndex < files.length - 1) {
      // 좌측 스와이프 - 다음 이미지
      handleNextImage();
    } else if (isRightSwipe && currentImageIndex > 0) {
      // 우측 스와이프 - 이전 이미지
      handlePrevImage();
    }
    
    // 드래그 상태 초기화
    setIsDragging(false);
    setDragOffset(0);
    setTouchDirection(null);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const onClickLike = () => {
    if(!accessToken) {
      router.push("/login");
      return;
    }
    const newIsLikedState = !currentIsLiked;
    const newLikeCount = newIsLikedState ? currentLikesCount + 1 : currentLikesCount - 1;
    setCurrentIsLiked(newIsLikedState);
    setCurrentLikesCount(newLikeCount);
    toggleLikeFeedApi(id, currentIsLiked);
  }

  const handleDeleteFeed = async () => {
    if (!currentUser || currentUser.id !== user.id) {
      alert("삭제 권한이 없습니다.");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const executeDeleteFeed = async () => {
    try {
      await deleteFeed(id);
      setActiveMenuFeedId(null);
      if (onDeleteSuccess) {
        onDeleteSuccess(id);
      }
    } catch (error) {
      console.error("피드 삭제 실패:", error);
      alert(error instanceof Error ? error.message : "피드 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <article className="bg-black rounded-lg mb-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center"
            onClick={() => router.push(`/profile/${user.id}`)}
          >
            <img
              src={user?.profile_image_url || "/default-profile.svg"}
              alt={`${user?.username} 프로필`}
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-semibold text-white">{user?.username}</p>
              <p className="text-xs text-gray-400">{user?.username}</p>
            </div>
          </div>
          {currentUser && currentUser.id === user.id && (
            <div className="relative">
              <button 
                className="text-gray-400 hover:text-white p-2"
                onClick={() => setActiveMenuFeedId(activeMenuFeedId === id ? null : id)}
              >
                <FontAwesomeIcon icon={faEllipsis} className="text-lg" />
              </button>
              {activeMenuFeedId === id && (
                <div 
                  ref={menuRef}
                  className="absolute right-0 mt-1 w-24 bg-zinc-800 rounded-md shadow-lg z-10 overflow-hidden"
                >
                  <button
                    onClick={handleDeleteFeed}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-700 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div 
          className="relative overflow-hidden"
          style={{
            aspectRatio: `1/${frame_ratio}`
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {files.length > 0 && (
            <>
              {/* 슬라이드 컨테이너 */}
              <div 
                className={`flex h-full ${!isDragging ? 'transition-transform duration-300 ease-in-out' : ''}`}
                style={{
                  width: `${files.length * 100}%`,
                  transform: `translateX(calc(-${currentImageIndex * (100 / files.length)}% + ${dragOffset}px))`
                }}
              >
                {files.map((file, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0"
                    style={{ width: `${100 / files.length}%` }}
                  >
                    {file.content_type.startsWith("image") && (
                      <img
                        src={`${file.base_url}/${file.s3_key}`}
                        alt="게임 포스트"
                        className="w-full h-full bg-black"
                        style={{
                          objectFit: (() => {
                            const ratio = frame_ratio;
                            const imageRatio = file.height / file.width;
                            
                            if(imageRatio > ratio) {
                              return "cover";
                            } else {
                              return "contain";
                            }
                          })()
                        }}
                      />
                    )}
                    {file.content_type.startsWith("video") && (
                      <video
                        src={`${file.base_url}/${file.s3_key}`}
                        className="w-full h-full bg-black"
                        controls
                        autoPlay={index === currentImageIndex}
                        loop
                        muted
                        style={{
                          objectFit: (() => {
                            const ratio = frame_ratio;
                            const imageRatio = file.height / file.width;
                            
                            if(imageRatio > ratio) {
                              return "cover";
                            } else {
                              return "contain";
                            }
                          })()
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* 좌우 버튼 - PC에서만 표시 */}
              {!isMobile && files.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white w-10 h-10 rounded-md hover:bg-black/90 transition-colors z-10 flex items-center justify-center ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentImageIndex === 0}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white w-10 h-10 rounded-md hover:bg-black/90 transition-colors z-10 flex items-center justify-center ${currentImageIndex === files.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentImageIndex === files.length - 1}
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Dot 페이지네이션 - 이미지 아래 별도 영역 */}
        {files.length > 1 && (
          <div className="flex justify-center py-3">
            <div className="flex space-x-2">
              {files.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'bg-white w-6' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="px-4 pt-4 pb-3 border-t border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-3">
              <button
                className="flex items-center gap-[5px] text-2xl text-white"
                onClick={onClickLike}
              >
                <FontAwesomeIcon
                  icon={currentIsLiked ? faSolidHeart : faRegularHeart}
                  className={currentIsLiked ? "text-red-500" : ""}
                />
                {currentLikesCount > 0 && <span className="text-sm">{currentLikesCount}</span>}
              </button>
              <button 
                className="flex items-center gap-[5px] text-2xl text-white"
                onClick={() => setIsCommentModalOpen(true)}
              >
                <FontAwesomeIcon icon={faComment} />
              </button>
            </div>
          </div>
          <p className="text-sm text-white mt-2">
            <span className="font-semibold mr-1">{user.username}</span>
            {description}
          </p>
        </div>
      </article>

      <CommentModal
        feedId={id}
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
      />
      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={executeDeleteFeed}
        title="게시물 삭제"
        message="이 게시물을 삭제하시겠어요?"
      />
    </>
  );
} 
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faHeart as faSolidHeart, faEllipsis, faPlay, faPause, faExpand } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart, faComment, faBookmark } from "@fortawesome/free-regular-svg-icons";
import CommentModal from "@/components/comment/CommentModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { FeedItemProps } from "@/types/feeds";
import { toggleLikeFeedApi, deleteFeed } from "@/services/feeds";
import { useAuthStore } from "@/store/authStore";
import { useVideoStore } from "@/store/videoStore";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const currentUser = useAuthStore((s) => s.user);
  const { currentPlayingVideo, setCurrentPlayingVideo } = useVideoStore();

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentIsLiked, setCurrentIsLiked] = useState(is_liked);
  const [currentLikesCount, setCurrentLikesCount] = useState(likes_count || 0);
  const [activeMenuFeedId, setActiveMenuFeedId] = useState<number | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 비디오 재생바 관련 상태
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // 비디오 ref들을 저장할 배열
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isIntersectingRef = useRef(false);
  const currentImageIndexRef = useRef(0);

  // Intersection Observer로 100% 보이는지 감지
  const { ref: containerRef, isIntersecting } = useIntersectionObserver({
    threshold: 1.0,
  });

  // refs 업데이트
  useEffect(() => {
    isIntersectingRef.current = isIntersecting;
  }, [isIntersecting]);

  useEffect(() => {
    currentImageIndexRef.current = currentImageIndex;
  }, [currentImageIndex]);

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

  // 시간 포맷팅 함수
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 비디오 이벤트 리스너 설정
  const setupVideoEventListeners = useCallback((video: HTMLVideoElement, index: number) => {
    const handleTimeUpdate = () => {
      if (index === currentImageIndexRef.current && !isDraggingProgress) {
        setCurrentTime(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (index === currentImageIndexRef.current) {
        setDuration(video.duration);
      }
    };

    const handlePlay = () => {
      if (index === currentImageIndexRef.current) {
        setIsPlaying(true);
      }
    };

    const handlePause = () => {
      if (index === currentImageIndexRef.current) {
        setIsPlaying(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isDraggingProgress]);

  // 재생바 클릭/드래그 핸들러
  const handleProgressBarInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const currentVideo = videoRefs.current[currentImageIndex];
    const progressBar = progressBarRef.current;
    
    if (!currentVideo || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clickPosition = (clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    currentVideo.currentTime = Math.max(0, Math.min(newTime, duration));
    setCurrentTime(newTime);
  }, [currentImageIndex, duration]);

  const handleProgressMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDraggingProgress(true);
    handleProgressBarInteraction(e);
  }, [handleProgressBarInteraction]);

  const handleProgressTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDraggingProgress(true);
    handleProgressBarInteraction(e);
  }, [handleProgressBarInteraction]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingProgress) {
        const mockEvent = { clientX: e.clientX } as React.MouseEvent;
        handleProgressBarInteraction(mockEvent);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingProgress(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingProgress) {
        e.preventDefault();
        const mockEvent = { touches: e.touches } as unknown as React.TouchEvent;
        handleProgressBarInteraction(mockEvent);
      }
    };

    const handleTouchEnd = () => {
      setIsDraggingProgress(false);
    };

    if (isDraggingProgress) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDraggingProgress, handleProgressBarInteraction]);

  // 재생/일시정지 토글
  const handlePlayPause = useCallback(() => {
    const currentVideo = videoRefs.current[currentImageIndex];
    if (!currentVideo) return;

    if (isPlaying) {
      currentVideo.pause();
    } else {
      currentVideo.play();
    }
  }, [currentImageIndex, isPlaying]);

  // 비디오 재생 함수
  const playVideo = useCallback((videoElement: HTMLVideoElement, videoId: string) => {
    if (currentPlayingVideo !== videoId) {
      setCurrentPlayingVideo(videoId);
      videoElement.muted = false;
      videoElement.play().catch(console.error);
    }
  }, [currentPlayingVideo, setCurrentPlayingVideo]);

  // 비디오 정지 함수
  const pauseVideo = useCallback((videoElement: HTMLVideoElement) => {
    videoElement.pause();
    videoElement.muted = true;
  }, []);

  // 전체 비디오 정지 함수
  const stopCurrentVideo = useCallback(() => {
    setCurrentPlayingVideo(null);
  }, [setCurrentPlayingVideo]);

  // 초기 로드 시 자동재생 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentVideoId = `${id}-${currentImageIndex}`;
      const currentFile = files[currentImageIndex];
      const currentVideoElement = videoRefs.current[currentImageIndex];

      if (currentFile?.content_type.startsWith("video") && currentVideoElement && isIntersectingRef.current) {
        playVideo(currentVideoElement, currentVideoId);
        if (currentVideoElement.duration) {
          setDuration(currentVideoElement.duration);
        }
      }
    }, 100); // 100ms 지연 후 체크

    return () => clearTimeout(timer);
  }, [id, currentImageIndex, files]);

  // Intersection 변경에 따른 비디오 제어
  useEffect(() => {
    const currentVideoId = `${id}-${currentImageIndexRef.current}`;
    const currentFile = files[currentImageIndexRef.current];
    const currentVideoElement = videoRefs.current[currentImageIndexRef.current];

    if (currentFile?.content_type.startsWith("video") && currentVideoElement) {
      if (isIntersecting) {
        // 100% 보이면 재생
        playVideo(currentVideoElement, currentVideoId);
      } else {
        // 안 보이면 정지
        if (currentPlayingVideo === currentVideoId) {
          pauseVideo(currentVideoElement);
          stopCurrentVideo();
        }
      }
    } else {
      // 현재 슬라이드가 비디오가 아닌 경우
      if (currentPlayingVideo?.startsWith(`${id}-`)) {
        stopCurrentVideo();
      }
    }
  }, [isIntersecting]);

  // 슬라이드 변경에 따른 비디오 제어
  useEffect(() => {
    const currentVideoId = `${id}-${currentImageIndex}`;
    const currentFile = files[currentImageIndex];
    const currentVideoElement = videoRefs.current[currentImageIndex];

    // 이전 슬라이드의 모든 비디오 정지
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentImageIndex) {
        video.pause();
        video.muted = true;
        video.currentTime = 0;
      }
    });

    // 현재 슬라이드 상태 초기화
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    // 현재 슬라이드가 비디오이고 화면에 보이면 재생
    if (currentFile?.content_type.startsWith("video") && currentVideoElement && isIntersectingRef.current) {
      playVideo(currentVideoElement, currentVideoId);
      // 비디오 메타데이터가 로드되면 duration 설정
      if (currentVideoElement.duration) {
        setDuration(currentVideoElement.duration);
      }
    } else {
      // 현재 재생중인 비디오가 이 피드의 것이라면 정지
      if (currentPlayingVideo?.startsWith(`${id}-`)) {
        stopCurrentVideo();
      }
    }
  }, [currentImageIndex]);

  // 다른 피드의 비디오가 재생되면 현재 피드의 비디오 정지
  useEffect(() => {
    const currentVideoId = `${id}-${currentImageIndexRef.current}`;
    const currentVideoElement = videoRefs.current[currentImageIndexRef.current];

    if (currentPlayingVideo && !currentPlayingVideo.startsWith(`${id}-`) && currentVideoElement) {
      pauseVideo(currentVideoElement);
    }
  }, [currentPlayingVideo]);

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
    if(!isAuthenticated) {
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

  // 전체화면 토글
  const handleFullscreen = useCallback(() => {
    const currentVideo = videoRefs.current[currentImageIndex];
    if (!currentVideo) return;

    if (currentVideo.requestFullscreen) {
      currentVideo.requestFullscreen();
    } else if ((currentVideo as any).webkitRequestFullscreen) {
      // Safari 지원
      (currentVideo as any).webkitRequestFullscreen();
    } else if ((currentVideo as any).msRequestFullscreen) {
      // IE/Edge 지원
      (currentVideo as any).msRequestFullscreen();
    }
  }, [currentImageIndex]);

  return (
    <>
      <article ref={containerRef} className="bg-black rounded-lg mb-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-zinc-900">
          <button 
            className="flex items-center text-left hover:opacity-80 transition-opacity"
            onClick={() => router.push(`/profile/${user.id}`)}
          >
            <img
              src={user?.profile_image_url || "/default-profile.svg"}
              alt={`${user?.username} 프로필`}
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-semibold text-white">{user?.username}</p>
            </div>
          </button>
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
                      <div className="relative w-full h-full">
                      <video
                          ref={(el) => {
                            if (el) {
                              videoRefs.current[index] = el;
                              // 이벤트 리스너 설정
                              const cleanup = setupVideoEventListeners(el, index);
                              // cleanup 함수는 컴포넌트 언마운트시 자동으로 호출됨
                            }
                          }}
                        src={`${file.base_url}/${file.s3_key}`}
                        className="w-full h-full bg-black"
                        loop
                          muted
                          playsInline
                          preload="metadata"
                          onMouseEnter={() => setShowControls(true)}
                          onMouseLeave={() => setShowControls(false)}
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

                        {/* 비디오 컨트롤 오버레이 - 현재 슬라이드인 경우만 표시 */}
                        {index === currentImageIndex && file.content_type.startsWith("video") && (
                          <>
                            {/* 모바일에서는 터치로 컨트롤 표시 */}
                            <div 
                              className={`absolute inset-0 transition-opacity duration-300 ${
                                showControls || isMobile ? 'opacity-100' : 'opacity-100'
                              }`}
                              onTouchStart={() => setShowControls(true)}
                              onTouchEnd={() => setTimeout(() => setShowControls(false), 3000)}
                            >
                              {/* 재생바와 작은 재생 버튼 */}
                              <div className="absolute bottom-1 left-2 right-2">
                                <div className="flex items-center gap-3 text-white text-sm">
                                  {/* 작은 재생/일시정지 버튼 */}
                                  <button
                                    onClick={handlePlayPause}
                                    className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors flex-shrink-0"
                                  >
                                    <FontAwesomeIcon 
                                      icon={isPlaying ? faPause : faPlay} 
                                      className="text-xs"
                                    />
                                  </button>
                                  
                                  <span className="min-w-[40px] text-xs text-right">
                                    {formatTime(currentTime)}
                                  </span>
                                  <div 
                                    ref={progressBarRef}
                                    className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer relative group"
                                    onMouseDown={handleProgressMouseDown}
                                    onTouchStart={handleProgressTouchStart}
                                  >
                                    {/* 재생 진행률 */}
                                    <div 
                                      className="h-full bg-white rounded-full transition-all duration-150"
                                      style={{ 
                                        width: `${duration ? (currentTime / duration) * 100 : 0}%` 
                                      }}
                                    />
                                    {/* 드래그 핸들 */}
                                    <div 
                                      className="absolute top-0 bottom-0 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 my-auto"
                                      style={{ 
                                        left: `${duration ? (currentTime / duration) * 100 : 0}%`,
                                        transform: 'translateX(-50%)'
                                      }}
                                    />
                                  </div>
                                  <span className="min-w-[40px] text-xs text-left">
                                    {formatTime(duration)}
                                  </span>
                                  
                                  {/* 전체화면 버튼 */}
                                  <button
                                    onClick={handleFullscreen}
                                    className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors flex-shrink-0"
                                  >
                                    <FontAwesomeIcon 
                                      icon={faExpand} 
                                      className="text-xs"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
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
          <div className="flex justify-center py-2">
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

        <div className={
          `p-4
          ${files.length > 1 ? 'pt-0' : ''}
          `
        }>
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
            <button 
              onClick={() => router.push(`/profile/${user.id}`)}
              className="font-semibold mr-1 hover:text-gray-300 transition-colors cursor-pointer"
            >
              {user.username}
            </button>
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
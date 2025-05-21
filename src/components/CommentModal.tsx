import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { createComment, getComments, deleteComment, toggleCommentLikeApi } from "@/apis/comments";
import { useAuthStore } from "@/store/authStore";
import { Comment } from "@/types/comments";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

import { dummyComments } from "@/data/dummy-comments";


const topBarHeight = 60;

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedId: number;
}

export default function CommentModal({ isOpen, onClose, feedId }: CommentModalProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMenuCommentId, setActiveMenuCommentId] = useState<number | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuCommentId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 댓글 목록 가져오기
  const fetchComments = async () => {
    if (!feedId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await getComments(feedId);
      console.log(response);
      setComments(response.comments);
    } catch (error) {
      console.error("댓글 로딩 실패:", error);
      setError("댓글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && feedId) {
      fetchComments();
    }
  }, [isOpen, feedId]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden'; // 모달 열리면 스크롤 방지

      // 모달 애니메이션 처리
      setTimeout(() => {
        setIsVisible(true);
      }, 100);

      if (modalRef.current) {
        modalRef.current.style.transform = `translateY(0px)`;
      }
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset'; // 모달 닫히면 스크롤 허용

      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);


  // 낙관적 업데이트를 적용한 좋아요 토글 함수
  const toggleLike = (commentId: number) => {
    if(!accessToken) {
      router.push("/login");
      return;
    }
    
    // 현재 상태 확인
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;
    
    // 낙관적 업데이트
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            is_liked: !comment.is_liked,
            likes_count: comment.is_liked ? comment.likes_count - 1 : comment.likes_count + 1,
          };
        }
        return comment;
      })
    );
    
    // API 호출
    toggleCommentLikeApi(commentId, comment.is_liked)
      .then(success => {
        if (!success) {
          // API 호출 실패 시 원래 상태로 되돌림
          setComments(prevComments => 
            prevComments.map(c => {
              if (c.id === commentId) {
                return {
                  ...c,
                  is_liked: comment.is_liked,
                  likes_count: comment.likes_count,
                };
              }
              return c;
            })
          );
        }
      });
  };

  const handleSubmitComment = async () => {
    if (!commentInput.trim() || isSubmitting) return;

    if (!accessToken) {
      router.push("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      await createComment(feedId, commentInput.trim());
      
      // 댓글 입력 초기화
      setCommentInput("");
      
      // 댓글 목록 새로 불러오기
      await fetchComments();
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  // 댓글 삭제 함수
  const handleDeleteComment = async (commentId: number) => {
    try {
      // 삭제 API 호출
      await deleteComment(commentId);
      
      // 삭제 후 목록 갱신
      await fetchComments();
      
      // 메뉴 닫기
      setActiveMenuCommentId(null);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 h-[100dvh]">
      {/* dim */}
      <div 
        className="fixed inset-0 bg-black/70"
        style={{
          backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)',
          opacity: isVisible ? 1 : 0,
          transition: 'background-color 0.3s ease, opacity 0.3s ease'
        }}
        onClick={onClose} 
      />
      <div 
        ref={modalRef}
        className="
          absolute left-0 right-0 bottom-0
          bg-zinc-900 
          rounded-t-[20px] mx-auto max-w-[1280px] 
        "
        style={{
          transform: `${!isVisible ? 'translateY(100%)' : ''}`,
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          height: `calc(100dvh - ${topBarHeight}px)`
        }}
      >
        <div className="flex flex-col h-full">

          {/* 댓글 헤더  */}
          <div className="w-full px-[16px] flex items-center justify-between h-[60px]">
            <div className="w-[24px]" /> {/* 좌측 여백 */}
            <h2 className="text-lg font-semibold text-white">댓글</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white w-[24px]">
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>

          <div className="
                flex-1 
                overflow-y-auto 
              ">
            {isLoading && (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
              </div>
            )}

            {error && (
              <div className="p-4 text-center text-red-500">
                {error}
                <button
                  onClick={fetchComments}
                  className="ml-2 underline hover:text-red-400"
                >
                  다시 시도
                </button>
              </div>
            )}

            {!isLoading && !error && comments.length === 0 && (
              <div className="p-4 text-center text-gray-400">
                첫 댓글을 남겨보세요.
              </div>
            )}

            {comments.map((comment) => (
              <div key={comment.id} className="p-[16px]">
                <div className="flex items-start gap-[10px]">
                  <div className="flex-shrink-0">
                    <img 
                      src={comment.user.profileImage || "/default-profile.svg"} 
                      alt={`${comment.user.nickname}의 프로필`}
                      className="w-[40px] h-[40px] rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-[2px]">
                      <span className="text-sm font-semibold text-white">{comment.user.nickname}</span>
                      {accessToken && user && user.id === comment.user.id && (
                        <div className="relative">
                          <button 
                            className="text-gray-400 hover:text-white"
                            onClick={() => setActiveMenuCommentId(activeMenuCommentId === comment.id ? null : comment.id)}
                          >
                            <FontAwesomeIcon icon={faEllipsis} className="text-sm" />
                          </button>
                          
                          {activeMenuCommentId === comment.id && (
                            <div 
                              ref={menuRef}
                              className="absolute right-0 mt-1 w-24 bg-zinc-800 rounded-md shadow-lg z-10 overflow-hidden"
                            >
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-700 transition-colors"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center gap-[10px]">
                      <div>
                        <p className="text-white text-sm break-keep">{comment.content}</p>
                        <span className="text-xs text-gray-400">{comment.created_at}</span>
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <button 
                          onClick={() => toggleLike(comment.id)}
                          className="text-sm"
                        >
                          <FontAwesomeIcon 
                            icon={comment.is_liked ? faSolidHeart : faRegularHeart} 
                            className={comment.is_liked ? "text-red-500" : "text-gray-400"}
                          />
                        </button>
                        <span className="text-xs text-gray-400 h-[16px] min-w-[14px] text-center">
                          {comment.likes_count > 0 ? comment.likes_count : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 댓글 입력 영역 */}
          {accessToken && (
            <div className="flex items-center gap-[10px] p-4">
              <div className="flex-shrink-0">
                <img 
                src="https://i.pravatar.cc/40?img=1" 
                alt="내 프로필"
                className="w-[40px] h-[40px] rounded-full"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="댓글을 입력하세요..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="
                  w-full
                  px-4 py-2 
                  bg-zinc-900 text-white rounded-full 
                  focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div className="flex-shrink-0">
              <button 
                className={`
                  rounded-full p-2
                  ${isSubmitting || !commentInput.trim() 
                    ? 'bg-zinc-700 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600'
                  }
                  text-white transition-colors
                `}
                onClick={handleSubmitComment}
                disabled={isSubmitting || !commentInput.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          )}

          </div>
        </div>
      {/* </div> */}
    </div>
  );
} 
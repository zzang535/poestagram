import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState, useRef } from "react";
import { Comment, dummyComments } from "@/data/dummy-comments";
import { createComment } from "@/apis/feeds";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedId: number;
}

export default function CommentModal({ isOpen, onClose, feedId }: CommentModalProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  console.log(feedId)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden'; // 모달 열리면 스크롤 방지

      // 모달 애니메이션 처리
      setTimeout(() => {
        setIsVisible(true);
      }, 100);

      // setTranslateY(0);
      if (modalRef.current) {
        modalRef.current.style.transform = `translateY(0px)`;
      }
      setComments(dummyComments);
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


  const toggleLike = (commentId: number) => {
    if(!accessToken) {
      router.push("/login");
      return;
    }
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1,
          };
        }
        return comment;
      })
    );
  };

  const handleSubmitComment = async () => {
    if (!commentInput.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newComment = await createComment(feedId, commentInput.trim());

      // 낙관적 업데이트
      setComments(prev => [newComment, ...prev]);
      setCommentInput("");

      // 서버 동기화 로직 추가
      // ..
      // ..
    } catch (error) {
      console.error("Failed to create comment:", error);
      // TODO: 에러 처리
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
          h-[calc(100dvh-30px)]
        "
        style={{
          transform: `${!isVisible ? 'translateY(100%)' : ''}`,
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.3s ease, opacity 0.3s ease'
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
            {comments.map((comment) => (
              <div key={comment.id} className="p-[16px]">
                <div className="flex items-start gap-[10px]">
                  <div className="flex-shrink-0">
                    <img 
                      src={comment.profileImage || "/default-profile.svg"} 
                      alt={`${comment.username}의 프로필`}
                      className="w-[40px] h-[40px] rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-[2px]">
                      <span className="text-sm font-semibold text-white">{comment.username}</span>
                      <span className="ml-[6px] text-xs text-gray-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-white text-sm break-keep">{comment.content}</p>
                  </div>
                  <div className="flex flex-col items-center flex-shrink-0 pt-[6px]">
                    <button 
                      onClick={() => toggleLike(comment.id)}
                      className="text-sm"
                    >
                      <FontAwesomeIcon 
                        icon={comment.isLiked ? faSolidHeart : faRegularHeart} 
                        className={comment.isLiked ? "text-red-500" : "text-gray-400"}
                      />
                    </button>
                    {comment.likeCount > 0 && (
                      <span className="text-xs text-gray-400">
                        {comment.likeCount}
                      </span>
                    )}
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
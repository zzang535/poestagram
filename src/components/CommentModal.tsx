import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState, useRef } from "react";
import { Comment, dummyComments } from "@/data/dummy-comments";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentModal({ isOpen, onClose }: CommentModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const [translateY, setTranslateY] = useState(0);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const translateYRef = useRef(0);

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
      translateYRef.current = 0;
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

  // 드래그 시작
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e) {
      e.preventDefault(); // 모바일에서 기본 스크롤 방지
    }
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
  };

  // 드래그 중
  const handleDrag = (e: TouchEvent | MouseEvent) => {

    if (dragStartY === null) return;
    if ('touches' in e) {
      e.preventDefault(); // 모바일에서 기본 스크롤 방지
    }
    
    let clientY = 0;
    if (e instanceof TouchEvent) {
      clientY = e.touches[0].clientY;
    } else if (e instanceof MouseEvent) {
      clientY = e.clientY;
    } else {
      return;
    }

    const deltaY = clientY - dragStartY;
    if (deltaY > 0) {
      if (modalRef.current) {
        modalRef.current.style.transform = `translateY(${deltaY}px)`;
      }
      translateYRef.current = deltaY;
    }
  };

  // 드래그 끝
  const handleDragEnd = () => {
    if (translateYRef.current > 100) { // 100px 이상 드래그 시 닫기
      onClose();
      translateYRef.current = 0;
    } else {
      if (modalRef.current) {
        modalRef.current.style.transform = `translateY(0px)`;
      }
      translateYRef.current = 0;
    }
    setDragStartY(null);
  };

  useEffect(() => {
    if (dragStartY !== null) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('touchmove', handleDrag, { passive: false });
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('touchmove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [dragStartY]);

  const toggleLike = (commentId: number) => {
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

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 h-[100dvh]">
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
          fixed left-0 right-0 bottom-0 bg-zinc-900 
          rounded-t-[10px] mx-auto max-w-[1280px] 
          h-[calc(100dvh-30px)]
        "
        style={{
          transform: `translateY(${translateY}px) ${!isVisible ? 'translateY(100%)' : ''}`,
          opacity: isVisible ? 1 : 0,
          transition: dragStartY === null ? 'transform 0.3s ease, opacity 0.3s ease' : 'none'
        }}
      >
        <div className="flex flex-col h-[100dvh]">
          {/* 댓글 헤더  */}
          <div 
            className="
              fixed top-0 left-0 right-0 
              flex flex-col items-center 
              border-b border-gray-800 bg-zinc-900
              rounded-t-[10px]
              pt-2 pb-3
              cursor-grab active:cursor-grabbing
            "
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            {/* Drawer Handle */}
            <div className="w-[36px] h-[4px] bg-gray-600 rounded-full mb-4" />
            
            <div className="w-full px-[16px] flex items-center justify-between">
              <div className="w-[24px]" /> {/* 좌측 여백 */}
              <h2 className="text-lg font-semibold text-white">댓글</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white w-[24px]">
                <FontAwesomeIcon icon={faXmark} className="text-xl" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pt-[80px] pb-[110px]">
            {comments.map((comment) => (
              <div key={comment.id} className="p-[16px]">
                <div className="flex items-start gap-[10px]">
                  <div className="flex-shrink-0">
                    <img 
                      src={comment.profileImage} 
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
          <div className="
                fixed bottom-0 left-0 right-0 p-4 
                border-t border-gray-800 z-50
                bg-zinc-900
                w-fullq
              ">
            <div className="flex items-center gap-[10px]">
              <div className="flex-shrink-0">
                <img 
                  src="https://i.pravatar.cc/40?img=1" 
                  alt="내 프로필"
                  className="w-[40px] h-[40px] rounded-full"
                />
              </div>
              <input
                type="text"
                placeholder="댓글을 입력하세요..."
                className="
                  flex-1 bg-zinc-900 text-white rounded-full 
                  px-4 py-2 
                  focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <button className="bg-red-500 text-white rounded-full p-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
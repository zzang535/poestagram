import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

interface Comment {
  id: number;
  username: string;
  content: string;
  createdAt: string;
  profileImage: string;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentModal({ isOpen, onClose }: CommentModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      // 모달이 열릴 때 약간의 지연 후 애니메이션 시작
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      // 애니메이션이 완료된 후 컴포넌트 제거
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // transition duration과 동일하게 설정
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  // 임시 댓글 데이터
  const dummyComments = [
    {
      id: 1,
      username: "user1",
      content: "정말 멋진 경기였네요!",
      createdAt: "2024-03-30 14:30",
      profileImage: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: 2,
      username: "user2",
      content: "다음 경기도 기대됩니다.",
      createdAt: "2024-03-30 14:35",
      profileImage: "https://i.pravatar.cc/40?img=2",
    },
    {
      id: 3,
      username: "user3",
      content: "이번 시즌은 정말 좋은 경기들이 많네요.",
      createdAt: "2024-03-30 14:40",
      profileImage: "https://i.pravatar.cc/40?img=3",
    },
    {
      id: 4,
      username: "user4",
      content: "선수분들 정말 수고 많으셨습니다!",
      createdAt: "2024-03-30 14:45",
      profileImage: "https://i.pravatar.cc/40?img=4",
    },
    {
      id: 5,
      username: "user5",
      content: "다음 경기에서도 좋은 모습 보여주세요!",
      createdAt: "2024-03-30 14:50",
      profileImage: "https://i.pravatar.cc/40?img=5",
    },
    {
      id: 6,
      username: "user6",
      content: "이번 경기 MVP는 누구인가요?",
      createdAt: "2024-03-30 14:55",
      profileImage: "https://i.pravatar.cc/40?img=6",
    },
    {
      id: 7,
      username: "user7",
      content: "정말 긴장감 넘치는 경기였습니다.",
      createdAt: "2024-03-30 15:00",
      profileImage: "https://i.pravatar.cc/40?img=7",
    },
    {
      id: 8,
      username: "user8",
      content: "다음 경기 일정은 언제인가요?",
      createdAt: "2024-03-30 15:05",
      profileImage: "https://i.pravatar.cc/40?img=8",
    },
    {
      id: 9,
      username: "user9",
      content: "이번 시즌 우승은 누구일까요?",
      createdAt: "2024-03-30 15:10",
      profileImage: "https://i.pravatar.cc/40?img=9",
    },
    {
      id: 10,
      username: "user10",
      content: "선수분들 모두 최고입니다!",
      createdAt: "2024-03-30 15:15",
      profileImage: "https://i.pravatar.cc/40?img=10",
    },
    {
      id: 11,
      username: "user11",
      content: "다음 경기에서도 좋은 모습 기대합니다.",
      createdAt: "2024-03-30 15:20",
      profileImage: "https://i.pravatar.cc/40?img=11",
    },
    {
      id: 12,
      username: "user12",
      content: "이번 경기 MVP는 정말 실력이 좋네요.",
      createdAt: "2024-03-30 15:25",
      profileImage: "https://i.pravatar.cc/40?img=12",
    },
    {
      id: 13,
      username: "user13",
      content: "다음 경기에서도 좋은 모습 보여주세요!",
      createdAt: "2024-03-30 15:30",
      profileImage: "https://i.pravatar.cc/40?img=13",
    },
    {
      id: 14,
      username: "user14",
      content: "이번 시즌 우승은 누구일까요?",
      createdAt: "2024-03-30 15:35",
      profileImage: "https://i.pravatar.cc/40?img=14",
    },
    {
      id: 15,
      username: "user15",
      content: "선수분들 모두 최고입니다!",
      createdAt: "2024-03-30 15:40",
      profileImage: "https://i.pravatar.cc/40?img=15",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 h-[100dvh]">
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
        }`} 
        onClick={onClose} 
      />
      <div 
        className={`
            fixed left-0 right-0 bottom-0 bg-black 
            transform transition-all duration-300 
            ase-out rounded-t-2xl mx-auto max-w-[1280px] ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="flex flex-col h-[100dvh]">

          {/* 댓글 헤더  */}
          <div className="
                  fixed top-0 left-0 right-0 
                  flex items-center justify-between p-4 
                  border-b border-gray-800 bg-black
                ">
            <h2 className="text-lg font-semibold text-white">댓글</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-[60px]">
            {dummyComments.map((comment) => (
              <div key={comment.id} className="p-4 border-b border-gray-800">
                <div className="flex items-start space-x-3">
                  <img 
                    src={comment.profileImage} 
                    alt={`${comment.username}의 프로필`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-white">{comment.username}</span>
                      <span className="text-xs text-gray-400 ml-2">{comment.createdAt}</span>
                    </div>
                    <p className="text-white">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 댓글 입력 영역 */}
          <div className="
                fixed bottom-0 left-0 right-0 p-4 
                border-t border-gray-800 z-50
                bg-black
              ">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="댓글을 입력하세요..."
                className="flex-1 bg-gray-900 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="text-red-500 font-semibold px-4 py-2">게시</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
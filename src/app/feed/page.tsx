"use client";

import { useAuthStore } from '@/store/authStore';
import FeedItem from "@/components/FeedItem";

const feedData = [
  {
    userImage: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=40&h=40&fit=crop&crop=faces",
    userRole: "프로게이머",
    postImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=375&h=375&fit=crop",
    likes: 1234,
    username: "ooookim",
    content: "오늘 롤 챔피언스 코리아 결승전 하이라이트입니다! 정말 멋진 경기였습니다 🏆",
    comments: 89,
  },
  {
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=faces",
    userRole: "게임 스트리머",
    postImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=375&h=375&fit=crop",
    likes: 856,
    username: "jieun_",
    content: "발로란트 신규 맵 첫 플레이! 여러분의 생각은 어떠신가요? 😊",
    comments: 45,
  },
  {
    userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=faces",
    userRole: "게임 유튜버",
    postImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=375&h=375&fit=crop",
    likes: 2345,
    username: "gaming_master",
    content: "오버워치 2 신규 시즌 시작! 새로운 영웅이 추가되었어요 🎮",
    comments: 123,
  },
];

export default function Feed() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const { user, logout  } = useAuthStore();

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">피드</h1>
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <span className="text-gray-300">안녕하세요, {user?.nickname}님!</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
        
        {/* 피드 내용 */}
        <div className="space-y-4">
          {feedData.map((feed, index) => (
            <FeedItem
              key={index}
              userImage={feed.userImage}
              userRole={feed.userRole}
              postImage={feed.postImage}
              likes={feed.likes}
              username={feed.username}
              content={feed.content}
              comments={feed.comments}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 
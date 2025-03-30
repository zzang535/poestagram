"use client";

import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  
  // 임시 데이터
  const profile = {
    username: "yoonhwang",
    postsCount: 12,
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
  };

  const posts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop",
      likes: 42,
      comments: 5,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop",
      likes: 38,
      comments: 3,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop",
      likes: 56,
      comments: 8,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop",
      likes: 29,
      comments: 2,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop",
      likes: 45,
      comments: 6,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop",
      likes: 33,
      comments: 4,
    },
  ];

  const handlePostClick = () => {
    router.push(`/user-feed/${profile.username}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 프로필 정보 섹션 */}
      <section className="px-5 py-6 border-b border-gray-800">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profile.profileImage}
              alt={profile.username}
              className="w-20 h-20 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-red-800 text-white p-1.5 rounded-full">
              <i className="fa-solid fa-camera text-xs"></i>
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile.username}</h2>
            <p className="text-gray-400 mt-1">{profile.postsCount} 게시물</p>
          </div>
        </div>
      </section>

      {/* 게시물 그리드 */}
      <section className="grid grid-cols-3 gap-px bg-gray-800">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="relative aspect-square group cursor-pointer"
            onClick={handlePostClick}
          >
            <img
              src={post.image}
              alt={`게시물 ${post.id}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-1">
                <i className="fa-solid fa-heart text-white"></i>
                <span className="text-white font-medium">{post.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <i className="fa-solid fa-comment text-white"></i>
                <span className="text-white font-medium">{post.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
} 
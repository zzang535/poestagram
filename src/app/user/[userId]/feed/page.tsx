"use client";

import { useAuthStore } from '@/store/authStore';
import Feeds from "@/components/Feeds";
import { useParams } from 'next/navigation';

export default function UserFeed() {
  const params = useParams();
  const userId = Number(params.userId);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white p-4 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  if (isNaN(userId)) {
    return (
      <div className="min-h-screen bg-black text-white p-4 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400">유효하지 않은 사용자 ID입니다.</p>
        </div>
      </div>
    );
  }

  return <Feeds userId={userId} />;
} 
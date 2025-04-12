"use client";

import { useAuthStore } from '@/store/authStore';
import Feeds from "@/components/Feeds";

export default function Feed() {
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

  return <Feeds />;
} 
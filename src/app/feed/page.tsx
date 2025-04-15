"use client";

import { Suspense } from 'react';
import { useAuthStore } from '@/store/authStore';
import Feeds from "@/components/Feeds";

export default function Feed() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-4 py-20">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-gray-400">로딩 중...</p>
      </div>
    </div>}>
      <Feeds />
    </Suspense>
  );
} 
"use client";

import { Suspense } from 'react';
import AllFeeds from "@/components/feed/AllFeeds";

export default function Feed() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
          <p className="text-center text-gray-400">로딩 중...</p>
        </div>
      </div>
    </div>}>
      <AllFeeds />
    </Suspense>
  );
} 
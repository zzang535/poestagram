"use client";

import { Suspense } from 'react';
import UserFeeds from "@/components/feed/UserFeeds";
import { useParams } from 'next/navigation';

export default function UserFeed() {
  const params = useParams();
  const userId = Number(params.userId);
  // const accessToken = useAuthStore((s) => s.accessToken);
  // if (!accessToken) {
  //   return (
  //     <div className="min-h-screen bg-black text-white p-4 py-20">
  //       <div className="max-w-4xl mx-auto">
  //         <p className="text-center text-gray-400">로그인이 필요합니다.</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (isNaN(userId)) {
    return (
      <div className="min-h-screen bg-black text-white p-4 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400">유효하지 않은 사용자 ID입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
          <p className="text-center text-gray-400">로딩 중...</p>
        </div>
      </div>
    </div>}>
      <UserFeeds userId={userId} />
    </Suspense>
  );
} 
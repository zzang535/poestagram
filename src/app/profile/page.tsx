"use client";

import Profile from "@/components/Profile";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  // 로그인하지 않은 경우 로그인 페이지로 이동
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">로그인이 필요합니다...</p>
      </div>
    );
  }
  
  // 로그인한 경우 내 프로필 표시
  return <Profile userId={user.id} />;
}
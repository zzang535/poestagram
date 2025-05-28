"use client";

import Profile from "@/components/Profile";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {

  return <Profile />;
}
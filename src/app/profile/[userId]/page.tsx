"use client";

import Profile from "@/components/Profile";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  return <Profile userId={userId} />;
} 
"use client";

import ProfileEdit from "@/components/profile/ProfileEdit";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function ProfileEditPage() {
  return (
    <ProtectedRoute>
      <ProfileEdit />
    </ProtectedRoute>
  );
} 
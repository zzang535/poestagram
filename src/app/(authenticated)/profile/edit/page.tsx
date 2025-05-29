"use client";

import ProfileEdit from "@/components/ProfileEdit";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfileEditPage() {
  return (
    <ProtectedRoute>
      <ProfileEdit />
    </ProtectedRoute>
  );
} 
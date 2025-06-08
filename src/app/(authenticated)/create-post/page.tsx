"use client";

import CreatePost from "@/components/post/CreatePost";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function CreatePage() {
  return (
    <ProtectedRoute>
      <CreatePost />
    </ProtectedRoute>
  );
} 
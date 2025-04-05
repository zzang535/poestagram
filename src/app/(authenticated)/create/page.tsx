"use client";

import CreatePost from "@/components/CreatePost";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CreatePage() {
  return (
    <ProtectedRoute>
      <CreatePost />
    </ProtectedRoute>
  );
} 
'use client';

import LoginForm from "@/components/LoginForm";
import AuthRoute from "@/components/AuthRoute";

export default function LoginPage() {
  return (
    <AuthRoute>
      <LoginForm />
    </AuthRoute>
  );
} 
'use client';

import LoginForm from "@/components/login/LoginForm";
import AuthRoute from "@/components/layout/AuthRoute";

export default function LoginPage() {
  return (
    <AuthRoute>
      <LoginForm />
    </AuthRoute>
  );
} 
'use client';

import SignUpForm from "@/components/signup/SignUpForm";
import AuthRoute from "@/components/layout/AuthRoute";

export default function SignUpPage() {
  return (
    <AuthRoute>
      <SignUpForm />
    </AuthRoute>
  );
} 
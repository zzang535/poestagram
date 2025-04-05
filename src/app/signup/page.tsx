'use client';

import SignUpForm from "@/components/SignUpForm";
import AuthRoute from "@/components/AuthRoute";

export default function SignUpPage() {
  return (
    <AuthRoute>
      <SignUpForm />
    </AuthRoute>
  );
} 
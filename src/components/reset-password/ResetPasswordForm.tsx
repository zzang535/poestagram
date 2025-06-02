"use client";

import { useState } from "react";
import ResetPasswordEmailStep from "./ResetPasswordEmailStep";
// import ResetPasswordVerificationStep from "./ResetPasswordVerificationStep";
import ResetPasswordNewPasswordStep from "./ResetPasswordNewPasswordStep";
import SharedVerificationCodeStep from "../auth/SharedVerificationCodeStep";

export default function ResetPasswordForm() {
  const [step, setStep] = useState<"email" | "verification" | "reset">("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleEmailNext = (emailValue: string) => {
    setEmail(emailValue);
    setStep("verification");
  };

  const handleVerificationNext = (codeValue: string) => {
    setVerificationCode(codeValue);
    setStep("reset");
  };

  const handleBackToEmail = () => {
    setEmail("");
    setVerificationCode("");
    setStep("email");
  };

  return (
    <div className="w-full mx-auto min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-[400px] space-y-6">
        {/* <div className="text-center">
          <h1 className="text-2xl font-bold text-white">
            {step === "email" && "비밀번호 찾기"}
            {step === "verification" && "인증코드 확인"}
            {step === "reset" && "새 비밀번호 설정"}
          </h1>
        </div> */}

        {step === "email" && (
          <ResetPasswordEmailStep onNext={handleEmailNext} />
        )}

        {step === "verification" && (
          <SharedVerificationCodeStep 
            email={email}
            onNext={handleVerificationNext}
            onBack={handleBackToEmail}
          />
        )}

        {step === "reset" && (
          <ResetPasswordNewPasswordStep email={email} code={verificationCode} />
        )}
      </div>
    </div>
  );
} 
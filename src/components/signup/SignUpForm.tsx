"use client";

import { useState } from "react";
import EmailStep from "./EmailStep";
import UsernameStep from "./UsernameStep";
import PasswordStep from "./PasswordStep";
import InfoStep from "./InfoStep";
import SharedVerificationCodeStep from "../auth/SharedVerificationCodeStep";

export default function SignUpForm() {
  const [step, setStep] = useState<"email" | "verification" | "username" | "password" | "info">("email");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailNext = (emailValue: string) => {
    setEmail(emailValue);
    setStep("verification");
  };

  const handleVerificationNext = (/* code: string */) => {
    setStep("username");
  };

  const handleUsernameNext = (usernameValue: string) => {
    setUsername(usernameValue);
    setStep("password");
  };

  const handlePasswordNext = (passwordValue: string) => {
    setPassword(passwordValue);
    setStep("info");
  };

  const handleBackToEmail = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setStep("email");
  };

  return (
    <div className="w-full mx-auto min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-[400px] space-y-6">
        {step === "email" && (
          <EmailStep onNext={handleEmailNext} />
        )}

        {step === "verification" && (
          <SharedVerificationCodeStep 
            email={email}
            onNext={handleVerificationNext}
            onBack={handleBackToEmail}
          />
        )}

        {step === "username" && (
          <UsernameStep onNext={handleUsernameNext} />
        )}

        {step === "password" && (
          <PasswordStep onNext={handlePasswordNext} />
        )}

        {step === "info" && (
          <InfoStep email={email} username={username} password={password} />
        )}
      </div>
    </div>
  );
} 
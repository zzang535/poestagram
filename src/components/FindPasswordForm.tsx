"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FindPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "verification" | "reset">("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (step === "verification" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const handleVerificationInput = (index: number, value: string) => {
    if (value.length === 1 && index < 5) {
      const nextInput = document.querySelector(`input[name="verification-${index + 1}"]`) as HTMLInputElement;
      nextInput?.focus();
    }
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
  };

  const handleVerificationKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="verification-${index - 1}"]`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="fixed top-0 left-0 right-0 bg-gray-950 border-b border-gray-800">
        <div className="w-[375px] mx-auto px-5 py-4">
          <h1 className="text-xl font-bold text-white">
            {step === "email" && "비밀번호 찾기"}
            {step === "verification" && "인증코드 확인"}
            {step === "reset" && "새 비밀번호 설정"}
          </h1>
        </div>
      </header>

      <main className="w-[375px] mx-auto min-h-screen flex items-center justify-center px-5">
        <div className="w-full space-y-6">
          {step === "email" && (
            <>
              <p className="text-gray-400 text-center">가입하신 이메일 주소를 입력해 주세요</p>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
                    placeholder="이메일 주소"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button 
                  className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors"
                  onClick={() => setStep("verification")}
                >
                  인증코드 받기
                </button>
                <Link href="/login" className="block text-center text-blue-400 text-sm hover:underline">
                  로그인으로 돌아가기
                </Link>
              </div>
            </>
          )}

          {step === "verification" && (
            <>
              <p className="text-gray-400 text-center">이메일로 전송된 6자리 인증코드를 입력해 주세요</p>
              <div className="space-y-4">
                <div className="flex gap-2 justify-center mb-4">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      name={`verification-${index}`}
                      className="w-12 h-12 text-center border border-gray-700 rounded-lg focus:border-white focus:ring-white bg-gray-900 text-white text-xl"
                      value={digit}
                      onChange={(e) => handleVerificationInput(index, e.target.value)}
                      onKeyDown={(e) => handleVerificationKeyDown(index, e)}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400">
                    남은 시간: <span className="text-red-800">{formatTime(timeLeft)}</span>
                  </span>
                  <button 
                    className="text-blue-400 hover:underline"
                    onClick={() => setTimeLeft(180)}
                  >
                    인증코드 재전송
                  </button>
                </div>
                <button 
                  className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors"
                  onClick={() => setStep("reset")}
                >
                  다음
                </button>
              </div>
            </>
          )}

          {step === "reset" && (
            <>
              <div className="space-y-4">
                <div>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
                    placeholder="새 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-700 rounded-lg text-sm focus:border-white focus:ring-white bg-gray-900 text-white"
                    placeholder="새 비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-400 space-y-2">
                  <p>비밀번호는 다음 조건을 만족해야 합니다:</p>
                  <ul className="list-disc pl-5">
                    <li>8자 이상</li>
                    <li>영문, 숫자, 특수문자 조합</li>
                    <li>이전 비밀번호와 동일할 수 없음</li>
                  </ul>
                </div>
                <button 
                  className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors mt-6"
                  onClick={() => {
                    // TODO: 비밀번호 변경 로직 구현
                    console.log("비밀번호 변경");
                    router.push("/feed");
                  }}
                > 
                  계속
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
} 
interface SendVerificationEmailResponse {
  success: boolean;
  message: string;
}

import { handleResponse } from "../utils/handleResponse";

export const sendVerificationEmail = async (email: string): Promise<SendVerificationEmailResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return handleResponse(response, '인증번호 전송에 실패했습니다.');
  } catch (error) {
    console.error('인증번호 전송 중 오류 발생:', error);
    throw error;
  }
};

interface VerifyCodeResponse {
  is_verified: boolean;
  message: string;
}

export const verifyCode = async (email: string, code: string): Promise<VerifyCodeResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    return handleResponse(response, '인증번호 검증에 실패했습니다.');
  } catch (error) {
    console.error('인증번호 검증 중 오류 발생:', error);
    throw error;
  }
};

interface SignUpRequest {
  email: string;
  username: string;
  password: string;
  terms_of_service: boolean;
  privacy_policy: boolean;
}

interface SignUpResponse {
  message: string;
  user_id: number;
  access_token: string;
  token_type: string;
}

export const signup = async (data: SignUpRequest): Promise<SignUpResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response, '회원가입에 실패했습니다.');
  } catch (error) {
    console.error('회원가입 중 오류 발생:', error);
    throw error;
  }
};

interface EmailCheckResponse {
  exists: boolean;
  message: string;
}

export async function checkEmail(email: string): Promise<EmailCheckResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return handleResponse(response, '이메일 체크에 실패했습니다.');
  } catch (error) {
    throw error instanceof Error ? error : new Error('이메일 체크 중 오류가 발생했습니다.');
  }
}

interface UsernameCheckResponse {
  exists: boolean;
  message: string;
}

export async function checkUsername(username: string): Promise<UsernameCheckResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-username`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    return handleResponse(response, '사용자명 체크에 실패했습니다.');
  } catch (error) {
    throw error instanceof Error ? error : new Error('사용자명 체크 중 오류가 발생했습니다.');
  }
}

interface LoginResponse {
  message: string;
  user_id: number;
  access_token: string;
  token_type: string;
  username: string;
  email: string;
  profile_image_url?: string;
}

export async function login(identifier: string, password: string): Promise<LoginResponse> {
  try {
    const body = { identifier, password };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return handleResponse(response, '로그인에 실패했습니다.');
  } catch (error) {
    throw error instanceof Error ? error : new Error('로그인 중 오류가 발생했습니다.');
  }
}

interface PasswordResetRequest {
  email: string;
  code: string;
  new_password: string;
}

interface PasswordResetResponse {
  message: string;
}

export const resetPasswordApi = async (data: PasswordResetRequest): Promise<PasswordResetResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response, '비밀번호 변경에 실패했습니다.');
  } catch (error) {
    console.error('비밀번호 변경 중 오류 발생:', error);
    throw error;
  }
}; 
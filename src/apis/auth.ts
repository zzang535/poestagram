interface SendVerificationEmailResponse {
  success: boolean;
  message: string;
}

export const sendVerificationEmail = async (email: string): Promise<SendVerificationEmailResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '인증번호 전송에 실패했습니다.');
    }

    return await response.json();
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '인증번호 검증에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('인증번호 검증 중 오류 발생:', error);
    throw error;
  }
};

interface SignUpRequest {
  email: string;
  nickname: string;
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '회원가입에 실패했습니다.');
    }

    return await response.json();
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '이메일 체크에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    throw error instanceof Error ? error : new Error('이메일 체크 중 오류가 발생했습니다.');
  }
}

interface LoginResponse {
  message: string;
  user_id: number;
  access_token: string;
  token_type: string;
  nickname: string;
  email: string;
}

export async function login(email: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '로그인에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    throw error instanceof Error ? error : new Error('로그인 중 오류가 발생했습니다.');
  }
} 
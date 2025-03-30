interface SendVerificationEmailResponse {
  success: boolean;
  message: string;
}

export const sendVerificationEmail = async (email: string): Promise<SendVerificationEmailResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('인증번호 전송에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('인증번호 전송 중 오류 발생:', error);
    throw error;
  }
}; 
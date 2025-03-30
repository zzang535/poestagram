import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // TODO: 실제 이메일 전송 로직 구현
    // 1. 이메일 유효성 검사
    // 2. 인증번호 생성
    // 3. 이메일 전송
    // 4. 인증번호 저장 (Redis 등)

    // 임시 응답
    return NextResponse.json({
      success: true,
      message: '인증번호가 이메일로 전송되었습니다.',
    });
  } catch (error) {
    console.error('인증번호 전송 중 오류 발생:', error);
    return NextResponse.json(
      {
        success: false,
        message: '인증번호 전송에 실패했습니다.',
      },
      { status: 500 }
    );
  }
} 
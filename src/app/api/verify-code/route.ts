import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    // TODO: 실제 인증번호 검증 로직 구현
    // 1. Redis에서 저장된 인증번호 조회
    // 2. 입력된 코드와 비교
    // 3. 만료 시간 확인
    // 4. 검증 결과 반환

    // 임시 응답 (테스트용)
    if (code === '123456') {
      return NextResponse.json({
        is_verified: true,
        message: '인증이 완료되었습니다.',
      });
    }

    return NextResponse.json(
      {
        is_verified: false,
        message: '인증번호가 일치하지 않습니다.',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('인증번호 검증 중 오류 발생:', error);
    return NextResponse.json(
      {
        is_verified: false,
        message: '인증번호 검증에 실패했습니다.',
      },
      { status: 500 }
    );
  }
} 
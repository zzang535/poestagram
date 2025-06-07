import { FeedListResponse } from "@/types/feeds";
import { handleResponse } from "./handleResponse";

/**
 * 서버에서 모든 피드를 가져오는 API를 호출합니다.
 * 토큰이 있으면 개인화된 데이터(좋아요 상태 등)를 포함합니다.
 * @param offset 건너뛸 항목 수
 * @param limit 가져올 항목 수
 * @param accessToken 사용자 인증 토큰 (선택사항)
 * @returns 피드 목록 응답
 */
export const getAllFeedsServer = async (offset: number = 0, limit: number = 20, accessToken?: string): Promise<FeedListResponse> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // 토큰이 있으면 Authorization 헤더에 추가
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${apiUrl}/api/feeds?offset=${offset}&limit=${limit}`, {
      method: "GET",
      headers: headers,
      // 서버 사이드에서는 캐시를 사용하지 않도록 설정
      cache: 'no-store'
    });

    return handleResponse(response, "피드를 불러오는 중 오류가 발생했습니다.");
  } catch (error) {
    console.error('Server feed fetch error:', error);
    // 에러 발생 시 빈 결과 반환
    return {
      feeds: [],
      total: 0
    };
  }
}; 
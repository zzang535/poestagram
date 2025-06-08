import { FeedListResponse } from "@/types/feeds";
import { handleResponse } from "../utils/handleResponse";

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

/**
 * 서버 사이드에서 특정 유저의 피드 목록을 가져오는 API를 호출합니다.
 * @param userId 사용자 ID
 * @param skip 건너뛸 항목 수
 * @param limit 가져올 항목 수
 * @returns 피드 목록 응답
 */
export const getUserFeedsServer = async (
  userId: number, 
  skip: number = 0, 
  limit: number = 10
): Promise<FeedListResponse> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/feeds`);
  url.searchParams.append('offset', skip.toString());
  url.searchParams.append('limit', limit.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: 'no-store', // 항상 최신 데이터 가져오기
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * 서버 사이드에서 특정 유저의 프로필을 가져오는 API를 호출합니다.
 */
export const getUserProfileServer = async (userId: number): Promise<any> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * 서버 사이드에서 특정 피드의 인덱스를 가져오는 API를 호출합니다.
 */
export const getFeedIndexServer = async (userId: number, feedId: number): Promise<{ index: number }> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/feeds/${feedId}/index`);
  const response = await fetch(
    url.toString(),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store',
    }
  );

  console.log("response", response);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * 서버 사이드에서 특정 피드의 정보를 가져오는 API를 호출합니다.
 */
export const getFeedDetailServer = async (feedId: number, accessToken?: string): Promise<any> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/feeds/${feedId}`,
      {
        method: "GET",
        headers,
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  } catch (error) {
    console.error('Server feed detail fetch error:', error);
    throw error;
  }
};
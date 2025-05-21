import { useAuthStore } from "@/store/authStore";
import { FeedCreate, FeedResponse, FeedListResponse } from "@/types/feeds";
import { handleResponse } from "./handleResponse";
import { fetchWithRetry } from "@/utils/ferch-utils";

// --- 단일 피드 상세 정보 타입 (가정) ---
// 실제 API 응답 구조에 맞게 수정 필요
/*
interface FeedDetails {
  id: number;
  likes: number;
  is_liked_by_current_user: boolean;
  // ... 기타 피드 속성
}
*/
// --- 타입 정의 끝 ---

/**
 * 피드 생성 API를 호출합니다.
 * @param feedData 피드 생성에 필요한 데이터
 * @returns 피드 생성 응답
 */
export const createFeed = async (feedData: FeedCreate): Promise<FeedResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feeds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${useAuthStore.getState().accessToken}`
      },
      body: JSON.stringify(feedData),
    });
    return handleResponse(response, "피드 생성 중 오류 발생");
};

/**
 * 내 피드 목록을 가져오는 API를 호출합니다.
 * @param skip 건너뛸 항목 수
 * @param limit 가져올 항목 수
 * @returns 피드 목록 응답
 */
export const getUserFeeds = async (userId: number, skip: number = 0, limit: number = 10): Promise<FeedListResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/feeds?offset=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${useAuthStore.getState().accessToken}`
        },
      }
    );
    return handleResponse(response, "피드 목록을 가져오는 중 오류가 발생했습니다.");
};

export const getAllFeeds = async (offset: number = 0, limit: number = 20): Promise<FeedListResponse> => {
  const token = useAuthStore.getState().accessToken;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feeds?offset=${offset}&limit=${limit}`, {
    method: "GET",
    headers: headers
  });

  return handleResponse(response, "피드를 불러오는 중 오류가 발생했습니다.");
};

export const getFeedIndex = async (userId: number, feedId: number): Promise<{ index: number }> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/feeds/index?feed_id=${feedId}`);
  if (!response.ok) {
    throw new Error('피드 인덱스를 가져오는 중 오류가 발생했습니다.');
  }
  return response.json();
};

export async function toggleLikeFeedApi(feedId: number, currentIsLiked: boolean) {
  const method = currentIsLiked ? 'DELETE' : 'POST';
  const action = currentIsLiked ? '좋아요 취소' : '좋아요 추가';

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feeds/${feedId}/like`, {
      method: method,
      headers: {
        "Authorization": `Bearer ${useAuthStore.getState().accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: `알 수 없는 ${action} 오류` }));
      console.error(`${action} API 실패:`, errorData.detail);
      return;
    }
    console.log(`${action} API 성공`);

  } catch (error) {
    console.error(`${action} API 호출 오류:`, error);
  }
}

 

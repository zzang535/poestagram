import { useAuthStore } from "@/store/authStore";

interface FeedCreate {
    description: string;
  file_ids: number[];
}

interface FeedResponse {
  success: boolean;
  message: string;
}

interface FeedFile {
  id: number;
  file_name: string;
  base_url: string;
  s3_key: string;
  file_type: string;
  file_size: number;
  created_at: string;
  updated_at: string | null;
}

interface Feed {
  id: number;
  description: string;
  user_id: number;
  created_at: string;
  updated_at: string | null;
  files: FeedFile[];
}

interface FeedListResponse {
  feeds: Feed[];
  total: number;
}

/**
 * 피드 생성 API를 호출합니다.
 * @param feedData 피드 생성에 필요한 데이터
 * @returns 피드 생성 응답
 */
export const createFeed = async (feedData: FeedCreate): Promise<FeedResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feeds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${useAuthStore.getState().accessToken}`
      },
      body: JSON.stringify(feedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "피드 생성 중 오류가 발생했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("피드 생성 중 오류 발생:", error);
    throw error;
  }
};

/**
 * 내 피드 목록을 가져오는 API를 호출합니다.
 * @param skip 건너뛸 항목 수
 * @param limit 가져올 항목 수
 * @returns 피드 목록 응답
 */
export const getUserFeeds = async (userId: number, skip: number = 0, limit: number = 10): Promise<FeedListResponse> => {
  try {
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "피드 목록을 가져오는 중 오류가 발생했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("피드 목록을 가져오는 중 오류 발생:", error);
    throw error;
  }
}; 
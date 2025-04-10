import { useAuthStore } from "@/store/authStore";

interface FeedCreate {
    description: string;
  file_ids: number[];
}

interface FeedResponse {
  success: boolean;
  message: string;
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
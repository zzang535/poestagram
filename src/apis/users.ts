import { UserProfile } from "@/types/users";
import { handleResponse } from "./handleResponse";
import { useAuthStore } from "@/store/authStore";

export async function getUserProfile(userId: string | number): Promise<UserProfile> {
  const accessToken = useAuthStore.getState().accessToken;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
      method: "GET",
      headers: headers,
    });
    return handleResponse(response, "사용자 프로필 정보를 가져오는데 실패했습니다.");
  } catch (error) {
    console.error("사용자 프로필 조회 API 호출 오류:", error);
    throw error;
  }
} 
import { UserProfile, UsernameUpdateRequest, UsernameUpdateResponse, BioUpdateRequest, BioUpdateResponse } from "@/types/users";
import { handleResponse } from "../utils/handleResponse";
import { useAuthStore } from "@/store/authStore";

export async function getUserProfile(userId: string | number): Promise<UserProfile> {
  const accessToken = useAuthStore.getState().getAccessToken();
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

export async function updateProfileImage(imageBlob: Blob): Promise<{ profile_image_url: string }> {
  const accessToken = useAuthStore.getState().getAccessToken();
  
  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const formData = new FormData();
  formData.append('file', imageBlob, 'profile.jpg');

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile-image`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      body: formData,
    });
    
    return handleResponse(response, "프로필 이미지 업로드에 실패했습니다.");
  } catch (error) {
    console.error("프로필 이미지 업로드 API 호출 오류:", error);
    throw error;
  }
}

export async function updateUsername(username: string): Promise<UsernameUpdateResponse> {
  const accessToken = useAuthStore.getState().getAccessToken();
  
  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const requestBody: UsernameUpdateRequest = { username };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/username`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    return handleResponse(response, "사용자명 변경에 실패했습니다.");
  } catch (error) {
    console.error("사용자명 변경 API 호출 오류:", error);
    throw error;
  }
}

export async function updateBio(bio: string): Promise<BioUpdateResponse> {
  const accessToken = useAuthStore.getState().getAccessToken();
  
  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const requestBody: BioUpdateRequest = { bio };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/bio`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    return handleResponse(response, "소개글 변경에 실패했습니다.");
  } catch (error) {
    console.error("소개글 변경 API 호출 오류:", error);
    throw error;
  }
}

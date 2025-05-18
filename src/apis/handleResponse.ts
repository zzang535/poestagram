import { useAuthStore } from "@/store/authStore";

export async function handleResponse<T>(response: Response, defaultErrorMessage = "요청 중 오류 발생"): Promise<T> {
  if (response.status === 401) {
    console.warn("401 발생 - 로그아웃 처리 및 리디렉션");
    useAuthStore.getState().logout?.();
    throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: defaultErrorMessage }));
    throw new Error(errorData.detail || defaultErrorMessage);
  }

  return response.json();
}
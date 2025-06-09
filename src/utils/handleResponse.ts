import { useAuthStore } from "@/store/authStore";

// response 공통 처리 함수
export async function handleResponse<T>(response: Response, defaultErrorMessage = "요청 중 오류 발생"): Promise<T> {
  if (response.status === 401) {
    console.warn("401 발생 - 로그아웃 처리 및 리디렉션");
    useAuthStore.getState().logout?.();

    // 브라우저 환경에서만 리다이렉션 실행
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: defaultErrorMessage }));
    
    // detail이 객체인 경우 처리
    let errorMessage = defaultErrorMessage;
    
    if (errorData.detail) {
      if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail;
      } else {
        // 객체나 배열인 경우 - 일단 message나 첫 번째 항목 찾기
        if (errorData.detail.message) {
          errorMessage = errorData.detail.message;
        } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
          errorMessage = errorData.detail[0].msg || "입력 정보를 확인해 주세요.";
        } else {
          errorMessage = "요청 처리 중 오류가 발생했습니다.";
        }
      }
    } else if (errorData.message) {
      errorMessage = errorData.message;
    }
    
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).data = errorData;
    
    throw error;
  }

  return response.json();
}
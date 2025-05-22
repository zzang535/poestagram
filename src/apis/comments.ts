import { useAuthStore } from "@/store/authStore";
import { CommentCreate, CommentResponse, CommentListResponse } from "@/types/comments";
import { handleResponse } from "./handleResponse";

/**
 * 피드의 댓글 목록을 가져오는 API를 호출합니다.
 * @param feedId 댓글을 가져올 피드 ID
 * @param skip 건너뛸 항목 수 (기본값: 0)
 * @param limit 가져올 항목 수 (기본값: 50)
 * @returns 댓글 목록 응답
 */
export async function getComments(feedId: number, skip: number = 0, limit: number = 50): Promise<CommentListResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feeds/${feedId}/comments?skip=${skip}&limit=${limit}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${useAuthStore.getState().accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return handleResponse(response, '댓글을 불러오는 중 오류가 발생했습니다.');
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

/**
 * 새 댓글을 생성하는 API를 호출합니다.
 * @param feedId 댓글을 작성할 피드 ID
 * @param content 댓글 내용
 * @returns 댓글 생성 응답
 */
export async function createComment(feedId: number, content: string): Promise<CommentResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feeds/${feedId}/comments`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${useAuthStore.getState().accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  return handleResponse(response, "댓글 생성 중 오류가 발생했습니다.");
}

/**
 * 댓글을 삭제하는 API를 호출합니다.
 * @param commentId 삭제할 댓글 ID
 * @returns 댓글 삭제 응답
 */
export async function deleteComment(commentId: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${useAuthStore.getState().accessToken}`,
      },
    });

    return handleResponse(response, "댓글 삭제 중 오류가 발생했습니다.");
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    throw error;
  }
}

/**
 * 댓글 좋아요를 토글하는 API를 호출합니다.
 * @param commentId 좋아요 토글할 댓글 ID
 * @param currentIsLiked 현재 좋아요 상태
 * @returns 성공 여부
 */
export async function toggleCommentLikeApi(commentId: number, currentIsLiked: boolean) {
  const method = currentIsLiked ? 'DELETE' : 'POST';
  const action = currentIsLiked ? '좋아요 취소' : '좋아요 추가';

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}/like`, {
      method: method,
      headers: {
        "Authorization": `Bearer ${useAuthStore.getState().accessToken}`,
      },
    });

    await handleResponse(response, `댓글 ${action} 중 오류가 발생했습니다.`);
    console.log(`댓글 ${action} API 성공`);
    return true;
  } catch (error) {
    console.error(`댓글 ${action} API 호출 오류:`, error);
    return false;
  }
} 
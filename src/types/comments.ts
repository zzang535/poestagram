export interface CommentCreate {
  content: string;
}

export interface CommentResponse {
  id: number;
  content: string;
  createdAt: string;
  username: string;
  profileImage: string;
  likeCount: number;
  isLiked: boolean;
}
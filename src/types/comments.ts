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

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  likes_count: number;
  is_liked: boolean;
  user: {
    id: number;
    username: string;
    profileImage: string;
  };
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
}
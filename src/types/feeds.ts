export interface Feed {
  id: number;
  files: FeedFile[];
  description: string;
  frame_ratio: number;
  created_at: string;
  updated_at: string | null;
  is_liked: boolean;
  user: User;
  likes_count: number;
}


export interface FeedFile {
  id: number;
  file_name: string;
  base_url: string;
  s3_key: string;
  s3_key_thumbnail?: string;
  file_type: string;
  content_type: string;
  file_size: number;
  width: number;
  height: number;
  created_at: string;
  updated_at: string | null;
}

export interface FeedItemProps {
  id: number;
  files: FeedFile[];
  description: string;
  frame_ratio: number;
  created_at: string;
  updated_at: string | null;
  is_liked: boolean;
  user: User;
  likes_count: number;
  onDeleteSuccess?: (feedId: number) => void;
}

export interface FeedCreate {
  description: string;
  file_ids: number[];
  frame_ratio: number;
}

export interface FeedResponse {
  success: boolean;
  message: string;
}

export interface FeedListResponse {
  feeds: Feed[];
  total: number;
} 

export interface User {
  id: number;
  username: string;
  profile_image_url?: string;
}
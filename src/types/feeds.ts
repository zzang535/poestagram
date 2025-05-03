export interface FeedItemProps {
  id: number;
  files: FeedFile[];
  frame_ratio: number;
  likes?: number;
  username?: string;
  content?: string;
  comments?: number;
  is_liked?: boolean;
  description: string;
  user: {
    id: number;
    username: string;
    profile_image_url: string | null;
    role: string;
  };
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

export interface Feed {
  id: number;
  description: string;
  user_id: number;
  frame_ratio: number;
  created_at: string;
  updated_at: string | null;
  files: FeedFile[];
  user: {
    id: number;
    username: string;
    profile_image_url: string | null;
    role: string;
  };
  likes_count: number;
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
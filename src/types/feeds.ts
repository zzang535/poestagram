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
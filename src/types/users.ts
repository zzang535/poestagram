export interface UserProfile {
  id: number;
  username: string;
  email: string;
  profile_image_url?: string;
  feeds_count: number;
  created_at: string;
  bio?: string;
  // 필요한 경우 여기에 추가적인 프로필 정보를 정의합니다.
  // 예: bio?: string;
} 
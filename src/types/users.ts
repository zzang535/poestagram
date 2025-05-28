export interface UserProfile {
  id: number;
  username: string;
  profileImage?: string;
  postCount: number;
  // 필요한 경우 여기에 추가적인 프로필 정보를 정의합니다.
  // 예: bio?: string;
} 
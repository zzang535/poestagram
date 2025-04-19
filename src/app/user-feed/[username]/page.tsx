"use client";

import { useParams } from "next/navigation";
import FeedItem from "@/components/FeedItem";
import { FeedFile } from "@/apis/feeds";

export default function UserFeedPage() {
  const params = useParams();
  const username = params.username as string;

  // TODO: API에서 특정 유저의 게시물 목록을 가져오는 로직 구현
  const feedData = [
    {
      userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      userRole: "게이머",
      files: [{
        id: 1,
        file_name: "test.jpg",
        base_url: "https://images.unsplash.com",
        s3_key: "photo-1511512578047-dfb367046420?w=300&h=300&fit=crop",
        file_type: "image/jpeg",
        file_size: 100000,
        width: 300,
        height: 300,
        created_at: "",
        updated_at: null
      }],
      frame_ratio: 1,
      likes: 42,
      username: "yoonhwang",
      content: "첫 번째 게시물입니다.",
      comments: 5,
    },
    {
      userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      userRole: "게이머",
      files: [{
        id: 2,
        file_name: "test2.jpg",
        base_url: "https://images.unsplash.com",
        s3_key: "photo-1511512578047-dfb367046420?w=300&h=300&fit=crop",
        file_type: "image/jpeg",
        file_size: 100000,
        width: 300,
        height: 300,
        created_at: "",
        updated_at: null
      }],
      frame_ratio: 1,
      likes: 38,
      username: "yoonhwang",
      content: "두 번째 게시물입니다.",
      comments: 3,
    },
    // ... 더 많은 게시물
  ];

  return (
    <div className="feed-section">
      {feedData.map((feed, index) => (
        <FeedItem
          key={index}
          userImage={feed.userImage}
          userRole={feed.userRole}
          files={feed.files}
          frame_ratio={feed.frame_ratio}
          likes={feed.likes}
          username={feed.username}
          content={feed.content}
          comments={feed.comments}
        />
      ))}
    </div>
  );
} 
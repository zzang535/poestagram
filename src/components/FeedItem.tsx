"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CommentModal from "./CommentModal";

interface FeedItemProps {
  userImage: string;
  userRole: string;
  postImage: string;
  likes: number;
  username: string;
  content: string;
  comments: number;
}

export default function FeedItem({
  userImage,
  userRole,
  postImage,
  likes,
  username,
  content,
  comments,
}: FeedItemProps) {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  return (
    <>
      <article className="bg-black rounded-lg mb-4 overflow-hidden">
        <div className="flex items-center p-4 border-b border-gray-800">
          <img
            src={userImage}
            alt="유저"
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3">
            <p className="text-xs text-gray-400">{userRole}</p>
          </div>
        </div>
        <div className="relative pb-[56.25%] mb-4">
          {postImage && (
            <img
              src={postImage}
              alt="게임 포스트"
              className="absolute top-0 left-0 w-full h-full object-contain bg-black"
            />
          )}
        </div>
        <div className="px-4 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex space-x-4">
              <button className="text-2xl text-white">
                <i className="far fa-heart"></i>
              </button>
              <button 
                className="text-2xl text-white"
                onClick={() => setIsCommentModalOpen(true)}
              >
                <i className="far fa-comment"></i>
              </button>
            </div>
            <button className="text-2xl text-white">
              <i className="far fa-bookmark"></i>
            </button>
          </div>
          <p className="text-sm font-semibold mb-1 text-white">좋아요 {likes}개</p>
          <p className="text-sm text-white">
            <span className="font-semibold">{username}</span> {content}
          </p>
          <button 
            className="text-xs text-gray-400 mt-1 hover:text-white"
            onClick={() => setIsCommentModalOpen(true)}
          >
            댓글 {comments}개 모두 보기
          </button>
        </div>
      </article>

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
      />
    </>
  );
} 
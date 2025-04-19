"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import CommentModal from "./CommentModal";
import { FeedFile } from "@/apis/feeds";

interface FeedItemProps {
  userImage: string;
  userRole: string;
  files: FeedFile[];
  frame_ratio: number;
  likes: number;
  username: string;
  content: string;
  comments: number;
}

export default function FeedItem({
  userImage,
  userRole,
  files,
  frame_ratio,
  likes,
  username,
  content,
  comments,
}: FeedItemProps) {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < files.length - 1 ? prev + 1 : prev));
  };

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
        <div 
          className="relative"
          style={{
            aspectRatio: `1/${frame_ratio}`
          }}
        >
          {files.length > 0 && (
            <>
              <img
                src={`${files[currentImageIndex].base_url}/${files[currentImageIndex].s3_key}`}
                alt="게임 포스트"
                className="absolute top-0 left-0 w-full h-full bg-black"
                style={{
                  objectFit: (() => {
                    const ratio = frame_ratio;
                    const imageRatio = files[currentImageIndex].height / files[currentImageIndex].width;
                    
                    if(imageRatio > ratio) {
                      return "cover";
                    } else {
                      return "contain";
                    }
                  })()
                }}
              />
              {files.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentImageIndex === 0}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors ${currentImageIndex === files.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentImageIndex === files.length - 1}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1} / {files.length}
                  </div>
                </>
              )}
            </>
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
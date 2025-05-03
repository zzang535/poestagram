"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart, faComment, faBookmark } from "@fortawesome/free-regular-svg-icons";
import CommentModal from "./CommentModal";
import { FeedItemProps } from "@/types/feeds";
import { likeFeedApi } from "@/apis/feeds";


export default function FeedItem({
  id,
  user,
  files,
  frame_ratio,
  is_liked,
  description,
}: FeedItemProps) {

  console.log(is_liked);
  console.log(description);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentIsLiked, setCurrentIsLiked] = useState(is_liked);
  const [currentLikesCount, setCurrentLikesCount] = useState(0);

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
            src={user?.profile_image_url || "/no-profile.svg"}
            alt={`${user?.username} 프로필`}
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm font-semibold text-white">{user?.username}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
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
              {files[currentImageIndex].content_type.startsWith("image") && (
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
              )}
              {files[currentImageIndex].content_type.startsWith("video") && (
                <video
                  src={`${files[currentImageIndex].base_url}/${files[currentImageIndex].s3_key}`}
                  className="absolute top-0 left-0 w-full h-full bg-black"
                  controls
                  autoPlay
                  loop
                  muted
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
              )}
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
        <div className="px-4 pt-4 pb-3 border-t border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-3">
              <button
                className="flex items-center gap-[5px] text-2xl text-white"
                onClick={() => {
                  const newIsLiked = !currentIsLiked;
                  const newLikeCount = newIsLiked ? currentLikesCount + 1 : currentLikesCount - 1;
                  setCurrentIsLiked(newIsLiked);
                  setCurrentLikesCount(newLikeCount);
                  likeFeedApi(id);
                }}
              >
                <FontAwesomeIcon
                  icon={is_liked ? faSolidHeart : faRegularHeart}
                  className={is_liked ? "text-red-500" : ""}
                />
                {currentLikesCount > 0 && <span className="text-sm">{currentLikesCount}</span>}
              </button>
              <button 
                className="flex items-center gap-[5px] text-2xl text-white"
                onClick={() => setIsCommentModalOpen(true)}
              >
                <FontAwesomeIcon icon={faComment} />
              </button>
            </div>
          </div>
          <p className="text-sm text-white mt-2">
            <span className="font-semibold mr-1">{user?.username}</span>
            {description}
          </p>
        </div>
      </article>

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
      />
    </>
  );
} 
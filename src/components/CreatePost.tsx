"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faChevronLeft, faChevronRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { uploadFile } from "@/apis/files";

interface PreviewItem {
  url: string;
  type: 'image' | 'video';
}

export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      
      // 파일 배열로 변환
      const fileArray = Array.from(files);
      
      // API 호출 - 여러 파일 업로드
      const responses = await uploadFile(fileArray);
      console.log("업로드 성공:", responses);

      // 미리보기 생성
      const newPreviews: PreviewItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileURL = URL.createObjectURL(file);
        const fileType = file.type.startsWith('video/') ? 'video' : 'image';
        newPreviews.push({ url: fileURL, type: fileType });
      }

      setPreviews([...previews, ...newPreviews]);
      
    } catch (error) {
      console.error("업로드 오류:", error);
      alert(error instanceof Error ? error.message : "파일 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleUpload = () => {
    router.push("/feed");
  };

  const handleEdit = () => {
    setIsPreviewMode(false);
  };

  const handleRemoveImage = (index: number) => {
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    
    if (currentIndex >= newPreviews.length) {
      setCurrentIndex(Math.max(0, newPreviews.length - 1));
    }
  };

  const handlePrevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextSlide = () => {
    setCurrentIndex((prev) => (prev < previews.length - 1 ? prev + 1 : prev));
  };

  const handleAddMoreImages = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (isPreviewMode) {
    return (
      <div className="
        max-w-2xl 
        mx-auto
      ">
        <div className="
          space-y-6
        ">
          <div className="
            bg-black 
            rounded-lg 
            p-4
          ">
            <div className="
              relative 
              w-full 
              aspect-[9/16] 
              bg-gray-900 
              rounded-2xl 
              overflow-hidden
            ">
              {previews.length > 0 && (
                previews[currentIndex].type === 'video' ? (
                  <video
                    src={previews[currentIndex].url}
                    className="
                      w-full 
                      h-full 
                      object-cover
                    "
                    controls
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <img
                    src={previews[currentIndex].url}
                    alt="미리보기"
                    className="
                      w-full 
                      h-full 
                      object-cover
                    "
                  />
                )
              )}
            </div>
          </div>

          <div className="
            bg-black 
            rounded-lg 
            p-4
          ">
            <h2 className="
              text-lg 
              font-semibold 
              text-white 
              mb-4
            ">설명</h2>
            <p className="
              text-gray-300
            ">{description}</p>
          </div>

          <button
            onClick={handleEdit}
            className="
              w-full 
              bg-red-800 
              text-white 
              py-3 
              rounded-lg 
              font-medium 
              hover:bg-red-900 
              transition-colors
            "
          >
            수정하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="
      py-22
      max-w-2xl 
      mx-auto 
      flex 
      items-center 
      justify-center
    ">
      {/* 컨텐츠 전체 박스 */}
      <div className="
        space-y-8 
        w-full
      ">

        {/* 이미지 업로드 영역 */}
        <div className="">
          {/* 실제 이미지 영역 */}
          <div className="
            border-2 
            border-gray-900 
            rounded-lg 
            overflow-hidden
            relative
            aspect-[16/9]
            bg-gray-800
            flex
            items-center
            justify-center
          ">
            {previews.length > 0 ? (
              <>
                {previews[currentIndex].type === 'video' ? (
                  <video
                    src={previews[currentIndex].url}
                    className="
                      max-w-full 
                      max-h-full 
                      object-contain
                    "
                    controls
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <img
                    src={previews[currentIndex].url}
                    alt={`미리보기 ${currentIndex + 1}`}
                    className="
                      max-w-full 
                      max-h-full 
                      object-contain
                    "
                  />
                )}
                
                {/* 이미지 카운터 */}
                <div className="
                  absolute 
                  top-2 
                  right-2 
                  bg-black/70 
                  text-white 
                  text-xs 
                  px-2 
                  py-1 
                  rounded-full
                ">
                  {currentIndex + 1} / {previews.length}
                </div>
                
                {/* 삭제 버튼 */}
                <button 
                  onClick={() => handleRemoveImage(currentIndex)}
                  className="
                    absolute 
                    top-2 
                    left-2 
                    bg-black/70 
                    text-white 
                    p-2 
                    rounded-full 
                    hover:bg-black/90 
                    transition-colors
                  "
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </button>
                
                {/* 슬라이드 버튼 */}
                {previews.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevSlide}
                      className={`
                        absolute 
                        left-2 
                        top-1/2 
                        -translate-y-1/2 
                        bg-black/70 
                        text-white 
                        p-2 
                        rounded-full 
                        hover:bg-black/90 
                        transition-colors
                        ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      disabled={currentIndex === 0}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button 
                      onClick={handleNextSlide}
                      className={`
                        absolute 
                        right-2 
                        top-1/2 
                        -translate-y-1/2 
                        bg-black/70 
                        text-white 
                        p-2 
                        rounded-full 
                        hover:bg-black/90 
                        transition-colors
                        ${currentIndex === previews.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      disabled={currentIndex === previews.length - 1}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="
                text-center 
                p-8
              ">
                <label htmlFor="fileUpload" className="
                  cursor-pointer 
                  block
                ">
                  <div className="
                    mx-auto 
                    w-16 
                    h-16 
                    bg-opacity-10 
                    rounded-full 
                    flex 
                    items-center 
                    justify-center 
                    mb-4
                  ">
                    <FontAwesomeIcon icon={faCamera} className="text-2xl" />
                  </div>
                  <p className="
                    text-gray-300 
                    mb-2 
                    text-sm
                  ">이미지 또는 동영상을 업로드하세요</p>
                  <p className="
                    text-xs 
                    text-gray-400
                  ">지원 형식: JPG, PNG, MP4 (최대 100MB)</p>
                </label>
              </div>
            )}
          </div>
          
          {/* 추가 이미지 버튼 */}
          {previews.length > 0 && (
            <button
              onClick={handleAddMoreImages}
              className="
                mt-4 
                w-full 
                bg-gray-800 
                text-white 
                py-2 
                rounded-lg 
                font-medium 
                hover:bg-gray-700 
                transition-colors
              "
            >
              이미지 추가하기
            </button>
          )}
        </div>

        {/* 설명 작성 영역 */}
        <div className="
          bg-black 
          rounded-lg 
        ">
          <h2 className="
            text-base 
            font-semibold 
            text-white 
            mb-2
          ">설명</h2>
          <textarea
            className="
              text-sm
              w-full 
              h-32 
              border-none 
              resize-none 
              focus:ring-2 
              focus:ring-red-800 
              bg-gray-900 
              text-white 
              placeholder-gray-400 
              rounded-lg 
              p-4
            "
            placeholder="내용을 입력해주세요 (최대 500자)"
            maxLength={500}
            value={description}
            onChange={handleDescriptionChange}
          />
          <div className="
            text-right 
            text-xs
            text-gray-400
          ">
            <span>{description.length}</span>/500자
          </div>
        </div>

        {/* 업로드 버튼 */}
        <button
          onClick={handleUpload}
          disabled={previews.length === 0 || isUploading}
          className={`
            w-full 
            text-white 
            text-base
            py-3 
            rounded-lg 
            font-medium 
            transition-colors
            ${previews.length > 0 && !isUploading
              ? 'bg-red-800 hover:bg-red-900' 
              : 'bg-gray-800 cursor-not-allowed'
            }
          `}
        >
          {isUploading ? '업로드 중...' : '업로드하기'}
        </button>
      </div>
      
      {/* 파일 업로드 입력 - 항상 존재하도록 컴포넌트 최상위로 이동 */}
      <input
        ref={fileInputRef}
        type="file"
        id="fileUpload"
        className="hidden"
        accept="image/*,video/*"
        multiple={true}
        onChange={handleFileChange}
      />
    </div>
  );
} 
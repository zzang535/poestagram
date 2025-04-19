"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faChevronLeft, faChevronRight, faRibbon, faTrash } from "@fortawesome/free-solid-svg-icons";
import { uploadFile } from "@/apis/files";
import { createFeed } from "@/apis/feeds";
import ImageUploadLoading from "@/components/ui/ImageUploadLoading";
import { UploadResponse } from "@/apis/files";

interface PreviewImage {
  url: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  fileId?: number;
}

export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [frameSize, setFrameSize] = useState<{ width: number; height: number } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isFeedUploading, setIsFeedUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadBoxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 가장 긴 세로 이미지 찾기
  const findTallestImage = (images: PreviewImage[]) => {
    return images.reduce((tallest, current) => {
      if (!current.height || !current.width || !tallest.height || !tallest.width) return current;
      
      // 가로 세로 비율 계산 (height/width)
      const currentRatio = current.height / current.width;
      const tallestRatio = tallest.height / tallest.width;
      
      // 비율이 더 큰 이미지가 세로로 더 긴 이미지
      return currentRatio > tallestRatio ? current : tallest;
    }, images[0]);
  };

  // 업로드 박스 크기 업데이트
  useEffect(() => {
    const updateFrameSize = () => {
      if (uploadBoxRef.current && previews.length > 0) {
        const containerSize = uploadBoxRef.current.clientWidth;
        const tallestImage = findTallestImage(previews);
        
        if (tallestImage.width && tallestImage.height) {
          const ratio = tallestImage.width / tallestImage.height;
          
          // 세로 비율 제한 (1:1.25)
          if (tallestImage.height / tallestImage.width >= 1.25) {
            // 세로가 너무 긴 경우
            setFrameSize({
              width: containerSize / 1.25,
              height: containerSize
            });
          }
          // 가로 비율 제한 (1.85:1)
          else if (tallestImage.width / tallestImage.height >= 1.85) {
            // 가로가 너무 긴 경우
            setFrameSize({
              width: containerSize,
              height: containerSize / 1.85
            });
          }
          else {
            // 정상 비율 범위 내
            if (tallestImage.height > tallestImage.width) {
              // 세로가 더 긴 경우
              setFrameSize({
                width: containerSize * ratio,
                height: containerSize
              });
            } else {
              // 가로가 더 긴 경우
              setFrameSize({
                width: containerSize,
                height: containerSize / ratio
              });
            }
          }
        }
      }
    };

    updateFrameSize();
    window.addEventListener('resize', updateFrameSize);
    return () => window.removeEventListener('resize', updateFrameSize);
  }, [previews]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsImageUploading(true);
      
      const fileArray = Array.from(files);
      
      // API 호출
      const response: UploadResponse = await uploadFile(fileArray);
      console.log("업로드 성공:", response);
      
      // 서버에서 반환된 URL과 ID, 이미지 크기 정보를 사용하여 미리보기 생성
      const newPreviews: PreviewImage[] = response.file_urls.map((url: string, index: number) => {
        const fileType = fileArray[index].type.startsWith('video/') ? 'video' : 'image';
        return { 
          url, 
          type: fileType,
          fileId: response.uploaded_files[index].id,
          width: response.uploaded_files[index].width,
          height: response.uploaded_files[index].height
        };
      });

      const updatedPreviews = [...previews, ...newPreviews];
      setPreviews(updatedPreviews);
      
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {
    try {
      // 업로드된 파일 ID 추출
      const fileIds = previews
        .map(preview => preview.fileId)
        .filter((id): id is number => id !== undefined);

      
      if (fileIds.length === 0) {
        alert("업로드할 파일이 없습니다.");
        return;
      }

      // 피드 생성 API 호출
      const response = await createFeed({
        description: description,
        file_ids: fileIds
      });

      router.push("/feed");
      
    } catch (error) {
      console.error("피드 업로드 오류:", error);
      alert(error instanceof Error ? error.message : "피드 생성 중 오류가 발생했습니다.");
    }
  };


  const handleRemoveImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
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

  return (
    <div className="py-22 max-w-2xl mx-auto flex items-center justify-center">
      <div className="space-y-8 w-full">
        
        {/* 업로드 박스  */}
        <div 
          ref={uploadBoxRef}
          className="border-2 border-gray-900 rounded-lg overflow-hidden relative aspect-square bg-gray-800 flex items-center justify-center"
        >
          {isImageUploading && <ImageUploadLoading />}
          {!isImageUploading && previews.length > 0 && (
            <>
              <div 
                className="relative bg-gray-500"
                style={{
                  width: frameSize?.width || '100%',
                  height: frameSize?.height || '100%'
                }}
              >
                {previews[currentIndex].type === 'video' ? (
                  <video
                    src={previews[currentIndex].url}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <img
                    src={previews[currentIndex].url}
                    alt={`미리보기 ${currentIndex + 1}`}
                    className="w-full h-full"
                    style={{
                      objectFit: (() => {
                        const currentImage = previews[currentIndex];
                        if (!currentImage.width || !currentImage.height) return 'contain';

                        if(frameSize?.width && frameSize?.height) {
                          if(frameSize.width > frameSize.height) {
                            if(frameSize.width / frameSize.height >= 1.85) { // cover 발생
                              return "cover"
                            } else {
                              return "contain"
                            }
                          } else {
                            if(frameSize.height / frameSize.width >= 1.25) { // cover 발생
                              if(currentImage.height / currentImage.width > 1.25) {
                                return "cover"
                              } else {
                                return "contain"
                              }
                            } else {
                              return "contain"
                            }
                          }
                        }
                        return 'contain';
                        
                      })(),
                      maxHeight: '100%',
                      maxWidth: '100%'
                    }}
                  />
                )}
              </div>
              
              {/* 파일 번호 */}
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {currentIndex + 1} / {previews.length}
              </div>
              
              {/* 삭제 버튼 */}
              <button 
                onClick={() => handleRemoveImage(currentIndex)}
                className="absolute top-2 left-2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} className="text-sm" />
              </button>
              
              {/* 좌우 버튼 */}
              {previews.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevSlide}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentIndex === 0}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button 
                    onClick={handleNextSlide}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors ${currentIndex === previews.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentIndex === previews.length - 1}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </>
              )}
            </>
          )}
          
          {!isImageUploading && previews.length <= 0 && (
            <div className="text-center p-8">
              <label htmlFor="fileUpload" className="cursor-pointer block">
                <div className="mx-auto w-16 h-16 bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faCamera} className="text-2xl" />
                </div>
                <p className="text-gray-300 mb-2 text-sm">이미지 또는 동영상을 업로드하세요</p>
                <p className="text-xs text-gray-400">지원 형식: JPG, PNG, MP4 (최대 100MB)</p>
              </label>
            </div>
          )}
        </div>
        

        {/* 이미지 추가 버튼 */}
        {previews.length > 0 && (
          <button
            onClick={handleAddMoreImages}
            className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            이미지 추가하기
          </button>
        )}


        <div className="bg-black rounded-lg">
          <h2 className="text-base font-semibold text-white mb-2">설명</h2>
          <textarea
            className="text-sm w-full h-32 border-none resize-none focus:ring-2 focus:ring-red-800 bg-gray-900 text-white placeholder-gray-400 rounded-lg p-4"
            placeholder="내용을 입력해주세요 (최대 500자)"
            maxLength={500}
            value={description}
            onChange={handleDescriptionChange}
          />
          <div className="text-right text-xs text-gray-400">
            <span>{description.length}</span>/500자
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={previews.length === 0 || isFeedUploading}
          className={`
            w-full text-base py-3 rounded-lg font-medium transition-colors 
            ${previews.length > 0 && !isFeedUploading ? 
              'bg-red-800 hover:bg-red-900 text-white' : 
              'bg-gray-800 cursor-not-allowed text-gray-500'}
          `}
        >
          {isFeedUploading ? '업로드 중...' : '업로드하기'}
        </button>
      </div>
      
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
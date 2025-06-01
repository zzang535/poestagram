"use client";
import { forwardRef, useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faChevronLeft, faChevronRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import ImageUploadLoading from "@/components/ui/ImageUploadLoading";
import { uploadFile } from "@/apis/files";
import { UploadResponse } from "@/apis/files";

interface PreviewImage {
  url: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  fileId?: number;
}

interface MediaUploadBoxProps {
  onFrameSizeChange?: (frameSize: { width: number; height: number } | null) => void;
  onFileIdsChange?: (fileIds: number[]) => void;
}

const MediaUploadBox = forwardRef<HTMLDivElement, MediaUploadBoxProps>(({
  onFrameSizeChange,
  onFileIdsChange
}, ref) => {
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [frameSize, setFrameSize] = useState<{ width: number; height: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onFrameSizeChangeRef = useRef(onFrameSizeChange);
  const onFileIdsChangeRef = useRef(onFileIdsChange);

  const MAX_FILE_SIZE_MB = 200;

  // 최신 콜백 참조 업데이트
  useEffect(() => {
    onFrameSizeChangeRef.current = onFrameSizeChange;
  }, [onFrameSizeChange]);

  useEffect(() => {
    onFileIdsChangeRef.current = onFileIdsChange;
  }, [onFileIdsChange]);

  // 파일 ID들이 변경될 때마다 상위 컴포넌트에 알림
  useEffect(() => {
    const fileIds = previews
      .map(preview => preview.fileId)
      .filter((id): id is number => id !== undefined);
    onFileIdsChangeRef.current?.(fileIds);
  }, [previews]);

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
      if (containerRef.current && previews.length > 0) {
        const containerSize = containerRef.current.clientWidth;
        const tallestImage = findTallestImage(previews);
        
        if (tallestImage.width && tallestImage.height) {
          const ratio = tallestImage.width / tallestImage.height;
          let newFrameSize: { width: number; height: number };
          
          // 세로 비율 제한 (1:1.25)
          if (tallestImage.height / tallestImage.width >= 1.25) {
            // 세로가 너무 긴 경우
            newFrameSize = {
              width: containerSize / 1.25,
              height: containerSize
            };
          }
          // 가로 비율 제한 (1.85:1)
          else if (tallestImage.width / tallestImage.height >= 1.85) {
            // 가로가 너무 긴 경우
            newFrameSize = {
              width: containerSize,
              height: containerSize / 1.85
            };
          }
          else {
            // 정상 비율 범위 내
            if (tallestImage.height > tallestImage.width) {
              // 세로가 더 긴 경우
              newFrameSize = {
                width: containerSize * ratio,
                height: containerSize
              };
            } else {
              // 가로가 더 긴 경우
              newFrameSize = {
                width: containerSize,
                height: containerSize / ratio
              };
            }
          }
          
          setFrameSize(newFrameSize);
          onFrameSizeChangeRef.current?.(newFrameSize);
        }
      } else {
        setFrameSize(null);
        onFrameSizeChangeRef.current?.(null);
      }
    };

    updateFrameSize();
    window.addEventListener('resize', updateFrameSize);
    return () => window.removeEventListener('resize', updateFrameSize);
  }, [previews]);

  // ref 포워딩 (CreatePost에서 접근할 수 있도록)
  useEffect(() => {
    if (ref && typeof ref === 'object' && ref.current !== containerRef.current) {
      ref.current = containerRef.current;
    }
  }, [ref]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 파일 크기 검사
    const oversizedFiles = Array.from(files).filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`파일 크기가 ${MAX_FILE_SIZE_MB}MB를 초과했습니다. 업로드할 수 없습니다.`);
      return;
    }

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

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* 업로드 박스 */}
      <div 
        ref={containerRef}
        className="border-2 border-gray-900 rounded-lg overflow-hidden relative aspect-square bg-black flex items-center justify-center"
      >
        {isImageUploading && <ImageUploadLoading />}
        {!isImageUploading && previews.length > 0 && (
          <>
            <div 
              className="relative bg-gray-500 overflow-hidden"
              style={{
                width: frameSize?.width || '100%',
                height: frameSize?.height || '100%'
              }}
            >
              {/* 슬라이드 컨테이너 */}
              <div 
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{
                  width: `${previews.length * 100}%`,
                  transform: `translateX(-${currentIndex * (100 / previews.length)}%)`
                }}
              >
                {previews.map((preview, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0"
                    style={{ width: `${100 / previews.length}%` }}
                  >
                    {preview.type === 'video' ? (
                      <video
                        src={preview.url}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay={index === currentIndex}
                        loop
                        muted
                        style={{
                          objectFit: (() => {
                            if (!preview.width || !preview.height) return 'contain';

                            if(frameSize?.width && frameSize?.height) {
                              const frameRatio = frameSize.height / frameSize.width;
                              const imageRatio = preview.height / preview.width;

                              if(imageRatio > frameRatio) {
                                return "cover";
                              } else {
                                return "contain";
                              }
                            }
                            return 'contain';
                          })(),
                          maxHeight: '100%',
                          maxWidth: '100%'
                        }}
                      />
                    ) : (
                      <img
                        src={preview.url}
                        alt={`미리보기 ${index + 1}`}
                        className="w-full h-full"
                        style={{
                          objectFit: (() => {
                            if (!preview.width || !preview.height) return 'contain';

                            if(frameSize?.width && frameSize?.height) {
                              const frameRatio = frameSize.height / frameSize.width;
                              const imageRatio = preview.height / preview.width;

                              if(imageRatio > frameRatio) {
                                return "cover";
                              } else {
                                return "contain";
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
                ))}
              </div>
            </div>
            
            {/* 삭제 버튼 */}
            <button 
              onClick={() => handleRemoveImage(currentIndex)}
              className="absolute top-2 right-2 bg-black/70 text-white w-10 h-10 rounded-md hover:bg-black/90 transition-colors z-10 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faXmark} className="text-sm" />
            </button>
            
            {/* 좌우 버튼 */}
            {previews.length > 1 && (
              <>
                <button 
                  onClick={handlePrevSlide}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white w-10 h-10 rounded-md hover:bg-black/90 transition-colors z-10 flex items-center justify-center ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentIndex === 0}
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
                </button>
                <button 
                  onClick={handleNextSlide}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white w-10 h-10 rounded-md hover:bg-black/90 transition-colors z-10 flex items-center justify-center ${currentIndex === previews.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentIndex === previews.length - 1}
                >
                  <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                </button>
              </>
            )}

            {/* Dot 페이지네이션 */}
            {previews.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {previews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex 
                        ? 'bg-white w-6' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
        
        {!isImageUploading && previews.length <= 0 && (
          <>
            <label 
              htmlFor="fileUpload" 
              className="cursor-pointer absolute inset-0 w-full h-full flex items-center justify-center"
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faCamera} className="text-2xl" />
                </div>
                <p className="text-gray-300 mb-2 text-sm">이미지 또는 동영상을 업로드하세요</p>
                <p className="text-xs text-gray-400">지원 형식: JPG, PNG, MP4 (최대 200MB)</p>
              </div>
            </label>
          </>
        )}
      </div>

      {/* 이미지 추가 버튼 */}
      {previews.length > 0 && (
        <button
          onClick={handleAddMoreImages}
          className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          이미지 추가하기
        </button>
      )}

      {/* 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        id="fileUpload"
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
});

MediaUploadBox.displayName = "MediaUploadBox";

export default MediaUploadBox; 
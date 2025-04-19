"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faChevronLeft, faChevronRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { uploadFile } from "@/apis/files";
import { createFeed } from "@/apis/feeds";
import ImageUploadLoading from "@/components/ui/ImageUploadLoading";

interface PreviewItem {
  url: string;
  type: 'image' | 'video';
  fileId?: number;
}


export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isFeedUploading, setIsFeedUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsImageUploading(true);
      
      // FileList를 File[]로 변환
      const fileArray = Array.from(files);
      
      // API 호출
      const response = await uploadFile(fileArray);
      console.log("업로드 성공:", response);

      // 서버에서 반환된 URL과 ID를 사용하여 미리보기 생성
      const newPreviews: PreviewItem[] = response.file_urls.map((url: string, index: number) => {
        const fileType = fileArray[index].type.startsWith('video/') ? 'video' : 'image';
        return { 
          url, 
          type: fileType,
          fileId: response.uploaded_files[index].id
        };
      });

      setPreviews([...previews, ...newPreviews]);
      setCurrentIndex(previews.length); // 새로 추가된 파일들의 첫 번째 인덱스로 설정
      
    } catch (error) {
      console.error("업로드 오류:", error);
      alert(error instanceof Error ? error.message : "파일 업로드 중 오류가 발생했습니다.");
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

  return (
    <div className="py-22 max-w-2xl mx-auto flex items-center justify-center">
      <div className="space-y-8 w-full">

        

        <div className="">
          <div className="border-2 border-gray-900 rounded-lg overflow-hidden relative aspect-square bg-gray-800 flex items-center justify-center">

            {isImageUploading && <ImageUploadLoading />}
            {!isImageUploading && previews.length > 0 && (
              <>
                {previews[currentIndex].type === 'video' ? (
                  <video
                    src={previews[currentIndex].url}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <img
                    src={previews[currentIndex].url}
                    alt={`미리보기 ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
                
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  {currentIndex + 1} / {previews.length}
                </div>
                
                <button 
                  onClick={() => handleRemoveImage(currentIndex)}
                  className="absolute top-2 left-2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </button>
                
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
          
          {previews.length > 0 && (
            <button
              onClick={handleAddMoreImages}
              className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              이미지 추가하기
            </button>
          )}
        </div>

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
"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createFeed } from "@/apis/feeds";
import MediaUploadBox from "./MediaUploadBox";

export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [frameSize, setFrameSize] = useState<{ width: number; height: number } | null>(null);
  const [fileIds, setFileIds] = useState<number[]>([]);
  const [isFeedUploading, setIsFeedUploading] = useState(false);
  const router = useRouter();

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {
    try {
      if (fileIds.length === 0) {
        alert("업로드할 파일이 없습니다.");
        return;
      }

      setIsFeedUploading(true);

      // frame_ratio 계산
      const frameRatio = frameSize ? frameSize.height / frameSize.width : 1;

      // 피드 생성 API 호출
      await createFeed({
        description: description,
        file_ids: fileIds,
        frame_ratio: frameRatio
      });

      router.push("/feed");
      
    } catch (error) {
      console.error("피드 업로드 오류:", error);
      alert(error instanceof Error ? error.message : "피드 생성 중 오류가 발생했습니다.");
    } finally {
      setIsFeedUploading(false);
    }
  };

  const handleFrameSizeChange = useCallback((newFrameSize: { width: number; height: number } | null) => {
    setFrameSize(newFrameSize);
  }, []);

  const handleFileIdsChange = useCallback((newFileIds: number[]) => {
    setFileIds(newFileIds);
  }, []);

  return (
    <div className="py-22 max-w-2xl mx-auto flex items-center justify-center px-[24px]">
      <div className="space-y-8 w-full">
        <MediaUploadBox
          onFrameSizeChange={handleFrameSizeChange}
          onFileIdsChange={handleFileIdsChange}
        />

        {/* 설명 입력 */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-200">
            설명
          </label>
          <textarea
            id="description"
            placeholder="게시물에 대한 설명을 입력하세요..."
            value={description}
            onChange={handleDescriptionChange}
            rows={4}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          />
        </div>

        {/* 업로드 버튼 */}
        <button
          onClick={handleUpload}
          disabled={fileIds.length === 0 || isFeedUploading}
          className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          {isFeedUploading ? "업로드 중..." : "게시하기"}
        </button>
      </div>
    </div>
  );
} 
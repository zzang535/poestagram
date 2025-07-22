"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createFeed } from "@/services/feeds";
import MediaUploadBox from "./MediaUploadBox";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";

export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [frameSize, setFrameSize] = useState<{ width: number; height: number } | null>(null);
  const [fileIds, setFileIds] = useState<number[]>([]);
  const [isFeedUploading, setIsFeedUploading] = useState(false);
  const router = useRouter();
  const t = useTranslations('createPost');

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {
    try {
      if (fileIds.length === 0) {
        alert(t('noFiles'));
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
      alert(error instanceof Error ? error.message : t('createError'));
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
    <>
      {/* 메인 콘텐츠 영역 */}
      <div className="py-22 max-w-2xl mx-auto flex items-center justify-center px-[24px] pb-20">
        <div className="space-y-8 w-full">
          <MediaUploadBox
            onFrameSizeChange={handleFrameSizeChange}
            onFileIdsChange={handleFileIdsChange}
          />

          {/* 설명 입력 */}
          <div className="space-y-2">
            <TextArea
              label={t('description')}
              value={description}
              onChange={handleDescriptionChange}
              placeholder={t('descriptionPlaceholder')}
              rows={4}
              disabled={isFeedUploading}
            />
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="fixed bottom-0 left-0 right-0 h-[74px] bg-black border-t border-zinc-900 z-10">
        <div className="max-w-2xl mx-auto px-[24px] h-full flex items-center">
          <Button
            onClick={handleUpload}
            disabled={fileIds.length === 0}
            loading={isFeedUploading}
            loadingText={t('uploading')}
          >
            {t('publish')}
          </Button>
        </div>
      </div>
    </>
  );
} 
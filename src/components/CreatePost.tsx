"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileURL = URL.createObjectURL(file);
    setPreview(fileURL);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleUpload = () => {
    router.push("/feed");
    // setIsPreviewMode(true);
  };

  const handleEdit = () => {
    setIsPreviewMode(false);
  };

  if (isPreviewMode) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="bg-black rounded-lg p-4">
            <div className="relative w-full aspect-[9/16] bg-gray-900 rounded-2xl overflow-hidden">
              {preview && (
                <img
                  src={preview}
                  alt="미리보기"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="bg-black rounded-lg p-4">
            <h2 className="text-lg font-semibold text-white mb-4">설명</h2>
            <p className="text-gray-300">{description}</p>
          </div>

          <button
            onClick={handleEdit}
            className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors"
          >
            수정하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="bg-black rounded-lg p-6">
          <div className="border-2 border-dashed border-gray-900 rounded-lg p-8 text-center">
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
            <label htmlFor="fileUpload" className="cursor-pointer block">
              <div className="mx-auto w-16 h-16 bg-red-800 bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-camera text-red-800 text-2xl"></i>
              </div>
              <p className="text-gray-300 mb-2">이미지 또는 동영상을 업로드하세요</p>
              <p className="text-sm text-gray-400">지원 형식: JPG, PNG, MP4 (최대 100MB)</p>
            </label>
          </div>
        </div>

        <div className="bg-black rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4">설명 작성</h2>
          <textarea
            className="w-full h-32 border-none resize-none focus:ring-2 focus:ring-red-800 bg-gray-900 text-white placeholder-gray-400 rounded-lg p-4"
            placeholder="내용을 입력해주세요 (최대 500자)"
            maxLength={500}
            value={description}
            onChange={handleDescriptionChange}
          />
          <div className="text-right text-sm text-gray-400">
            <span>{description.length}</span>/500자
          </div>
        </div>

        <button
          onClick={handleUpload}
          className="w-full bg-red-800 text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors"
        >
          업로드하기
        </button>
      </div>
    </div>
  );
} 
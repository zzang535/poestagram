import { handleResponse } from "../utils/handleResponse";

export interface UploadedFile {
  file_name: string;
  s3_key: string;
  url: string;
  url_thumbnail?: string;
  file_type: string;
  file_size: number;
  id: number;
  created_at: string;
  updated_at: string | null;
  width?: number;
  height?: number;
}

export interface UploadResponse {
  file_urls: string[];
  uploaded_files: UploadedFile[];
}

export const uploadFile = async (files: File | File[]): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    
    // 단일 파일 또는 파일 배열 처리
    if (Array.isArray(files)) {
      files.forEach((file, index) => {
        formData.append("files", file);
      });
    } else {
      formData.append("files", files);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/upload`, {
      method: "POST",
      body: formData,
    });

    return handleResponse(response, "파일 업로드 중 오류가 발생했습니다.");
  } catch (error) {
    console.error("파일 업로드 중 오류 발생:", error);
    throw error;
  }
}; 
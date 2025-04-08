interface UploadFileResponse {
  success: boolean;
  message: string;
  file_url?: string;
}

export const uploadFile = async (file: File): Promise<UploadFileResponse> => {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "파일 업로드 중 오류가 발생했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("파일 업로드 중 오류 발생:", error);
    throw error;
  }
}; 
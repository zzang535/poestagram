"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getUserProfile, updateProfileImage } from "@/apis/users";
import { UserProfile } from "@/types/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ImageCropView from "./ImageCropView";

type ViewState = "profile" | "imageCrop";

export default function ProfileEdit() {
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    bio: ""
  });
  
  // 뷰 상태 관리
  const [currentView, setCurrentView] = useState<ViewState>("profile");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!authUser) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getUserProfile(authUser.id);
        setUserProfile(profileData);
        setFormData({
          username: profileData.username,
          bio: profileData.bio || ""
        });
      } catch (error) {
        console.error("프로필 정보를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser, router]);

  const handleGoBack = () => {
    if (currentView === "imageCrop") {
      setCurrentView("profile");
      setSelectedImageFile(null);
    } else if (authUser) {
      router.push(`/user/${authUser.id}`);
    } else {
      router.back();
    }
  };

  const handleImageChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이미지 파일 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      
      setSelectedImageFile(file);
      setCurrentView("imageCrop");
    }
    // input 값 초기화 (같은 파일을 다시 선택할 수 있도록)
    event.target.value = '';
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setUploading(true);
      
      // 프로필 이미지 업로드 API 호출
      const response = await updateProfileImage(croppedBlob);
      
      // 업로드 성공 시 프로필 정보 업데이트
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          profile_image_url: response.profile_image_url
        });
      }
      
      alert('프로필 사진이 성공적으로 변경되었습니다.');
      setCurrentView("profile");
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      alert(error instanceof Error ? error.message : '프로필 사진 변경에 실패했습니다.');
    } finally {
      setUploading(false);
      setSelectedImageFile(null);
    }
  };

  const handleSave = async () => {
    // TODO: 프로필 업데이트 API 호출 (username, bio)
    alert("프로필 저장 기능은 추후 구현됩니다.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">프로필 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // 이미지 크롭 뷰
  if (currentView === "imageCrop" && selectedImageFile) {
    return (
      <ImageCropView
        imageFile={selectedImageFile}
        onCropComplete={handleCropComplete}
        onCancel={() => setCurrentView("profile")}
      />
    );
  }

  // 기본 프로필 편집 뷰
  return (
    <div className="min-h-screen bg-black text-white">

      {/* 프로필 편집 내용 */}
      <div className="pt-[60px] pb-8 px-4 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* 프로필 사진 섹션 */}
          <div className="flex flex-col items-center space-y-4 py-6">
            <div className="relative">
              <img
                src={userProfile.profile_image_url || "/default-profile.svg"}
                alt="프로필 이미지"
                className="w-24 h-24 rounded-full object-cover bg-gray-700"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <button
              onClick={handleImageChange}
              disabled={uploading}
              className="px-4 py-2 bg-zinc-700 text-white text-sm rounded-lg hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "업로드 중..." : "프로필 사진 변경"}
            </button>
          </div>

          {/* 사용자명 필드 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              사용자명
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
              placeholder="사용자명을 입력하세요"
            />
          </div>

          {/* 소개 필드 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              소개
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none resize-none"
              placeholder="자신을 소개해주세요"
            />
          </div>
        </div>
      </div>

      {/* 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
} 
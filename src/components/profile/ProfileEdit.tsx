"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { getUserProfile, updateProfileImage } from "@/services/users";
import { UserProfile } from "@/types/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ImageCropModal from "@/components/post/ImageCropModal";
import UsernameEditModal from "./UsernameEditModal";
import BioEditModal from "./BioEditModal";
import TextButton from "@/components/ui/TextButton";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";

type ViewState = "profile" | "imageCrop";

export default function ProfileEdit() {
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('profileEdit');
  
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
  
  // 모달 상태 관리
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);

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

  const handleImageChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이미지 파일 검증
      if (!file.type.startsWith('image/')) {
        alert(t('imageOnly'));
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

      // authStore의 사용자 정보도 업데이트
      updateUser({ profile_image_url: response.profile_image_url });

      setCurrentView("profile");
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      alert(error instanceof Error ? error.message : t('uploadFailed'));
    } finally {
      setUploading(false);
      setSelectedImageFile(null);
    }
  };

  const handleUsernameUpdate = (newUsername: string) => {
    // 프로필 정보 업데이트
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        username: newUsername
      });
    }
    
    // 폼 데이터 업데이트
    setFormData(prev => ({
      ...prev,
      username: newUsername
    }));

    // authStore의 사용자 정보도 업데이트
    updateUser({ username: newUsername });
  };

  const handleBioUpdate = (newBio: string) => {
    // 프로필 정보 업데이트
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        bio: newBio
      });
    }
    
    // 폼 데이터 업데이트
    setFormData(prev => ({
      ...prev,
      bio: newBio
    }));

    // authStore의 사용자 정보도 업데이트
    updateUser({ bio: newBio });
  };

  const handleSave = async () => {
    // TODO: 프로필 업데이트 API 호출 (username, bio)
    alert(t('saveNotImplemented'));
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
        <p className="text-gray-400">{t('profileNotFound')}</p>
      </div>
    );
  }

  // 기본 프로필 편집 뷰
  return (
    <>
      <div className="min-h-screen bg-black text-white pt-[64px] px-[24px]">
        {/* 프로필 사진 섹션 */}
        <div className="flex flex-col items-center space-y-2 py-[24px]">
          <div className="relative">
            <img
              src={userProfile.profile_image_url || "/default-profile.svg"}
              alt={t('profileImage')}
              className="w-24 h-24 rounded-full object-cover bg-gray-700"
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <TextButton
            onClick={handleImageChange}
            disabled={uploading}
            variant="primary"
            size="md"
          >
            {uploading ? t('uploading') : t('changePhoto')}
          </TextButton>
        </div>

        <div className="space-y-4">
          {/* 사용자명 필드 */}
          <Input
            label={t('username')}
            value={formData.username}
            readOnly={true}
            placeholder={t('usernamePlaceholder')}
            onClick={() => setIsUsernameModalOpen(true)}
            showArrow={true}
          />

          {/* 소개 필드 */}
          <TextArea
            label={t('bio')}
            value={formData.bio}
            readOnly={true}
            placeholder={t('bioPlaceholder')}
            rows={6}
            onClick={() => setIsBioModalOpen(true)}
            showArrow={true}
          />
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

      {/* 이미지 크롭 모달 */}
      <ImageCropModal
        isOpen={currentView === "imageCrop"}
        onClose={() => {
          setCurrentView("profile");
          setSelectedImageFile(null);
        }}
        imageFile={selectedImageFile}
        onCropComplete={handleCropComplete}
      />

      {/* 사용자명 변경 모달 */}
      <UsernameEditModal
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
        currentUsername={userProfile.username}
        onUpdateSuccess={handleUsernameUpdate}
      />

      {/* 소개 변경 모달 */}
      <BioEditModal
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
        currentBio={userProfile.bio || ""}
        onUpdateSuccess={handleBioUpdate}
      />
    </>
  );
} 
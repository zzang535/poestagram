"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface ImageCropViewProps {
  imageFile: File;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropView({ imageFile, onCropComplete, onCancel }: ImageCropViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropRadius, setCropRadius] = useState(0);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 이미지 파일을 URL로 변환
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);

    // 이미지 로드
    const img = new Image();
    img.onload = () => {
      setImageElement(img);
      
      // 화면 크기를 고려한 이미지 표시 크기 계산
      const maxWidth = Math.min(window.innerWidth - 40, 400);
      const maxHeight = Math.min(window.innerHeight - 200, 600);
      
      const aspectRatio = img.width / img.height;
      let displayWidth, displayHeight;
      
      if (aspectRatio > maxWidth / maxHeight) {
        // 가로가 더 비율이 큰 경우
        displayWidth = maxWidth;
        displayHeight = maxWidth / aspectRatio;
      } else {
        // 세로가 더 비율이 큰 경우
        displayHeight = maxHeight;
        displayWidth = maxHeight * aspectRatio;
      }
      
      setImageSize({ width: displayWidth, height: displayHeight });
      
      // 원의 지름이 이미지에 꽉 차도록 설정 (이미지의 짧은 변에 맞춤)
      const radius = Math.min(displayWidth, displayHeight) / 2;
      setCropRadius(radius);
      
      // 초기 크롭 위치를 중앙으로 설정
      setCropPosition({
        x: displayWidth / 2,
        y: displayHeight / 2
      });
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageElement) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    updateCropPosition(deltaX, deltaY);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !imageElement) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    
    updateCropPosition(deltaX, deltaY);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    e.preventDefault();
  };

  const updateCropPosition = (deltaX: number, deltaY: number) => {
    setCropPosition(prev => {
      const aspectRatio = imageElement!.width / imageElement!.height;
      let newX = prev.x;
      let newY = prev.y;
      
      if (aspectRatio > 1) {
        // 가로가 긴 이미지: 좌우 이동만
        newX = Math.max(cropRadius, Math.min(imageSize.width - cropRadius, prev.x + deltaX));
      } else {
        // 세로가 긴 이미지: 위아래 이동만  
        newY = Math.max(cropRadius, Math.min(imageSize.height - cropRadius, prev.y + deltaY));
      }
      
      return { x: newX, y: newY };
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 전역 이벤트 리스너 등록
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMouseMove(e as any);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleTouchMove(e as any);
      }
    };

    const handleGlobalTouchEnd = () => {
      if (isDragging) {
        handleTouchEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, dragStart]);

  const handleCrop = () => {
    if (!canvasRef.current || !imageElement) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 실제 이미지 크기와 표시 크기의 비율 계산
    const scaleX = imageElement.naturalWidth / imageSize.width;
    const scaleY = imageElement.naturalHeight / imageSize.height;
    
    // 크롭할 실제 크기 계산 (원의 지름에 해당하는 정사각형)
    const realCropSize = cropRadius * 2 * Math.min(scaleX, scaleY);
    const realCropX = (cropPosition.x - cropRadius) * scaleX;
    const realCropY = (cropPosition.y - cropRadius) * scaleY;

    // 캔버스 크기 설정 (정사각형)
    const outputSize = 300;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // 정사각형으로 크롭된 이미지 그리기
    ctx.drawImage(
      imageElement,
      realCropX, realCropY, realCropSize, realCropSize,
      0, 0, outputSize, outputSize
    );

    // Blob으로 변환
    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* 이미지 크롭 영역 */}
      <div className="pt-[120px] flex justify-center px-4 py-4">
        <div className="relative">
          {imageUrl && (
            <div 
              className="relative select-none"
              style={{ width: imageSize.width, height: imageSize.height }}
            >
              {/* 원본 이미지 */}
              <img
                src={imageUrl}
                alt="크롭할 이미지"
                className="w-full h-full object-cover pointer-events-none"
                style={{ width: imageSize.width, height: imageSize.height }}
                draggable={false}
              />
              
              {/* 어두운 오버레이 (원 바깥 영역) */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  left: cropPosition.x - cropRadius,
                  top: cropPosition.y - cropRadius,
                  width: cropRadius * 2,
                  height: cropRadius * 2,
                  borderRadius: '50%',
                  boxShadow: `0 0 0 ${Math.max(imageSize.width, imageSize.height)}px rgba(0, 0, 0, 0.5)`
                }}
              ></div>
              
              {/* 원형 크롭 가이드 */}
              <div 
                className="absolute pointer-events-auto cursor-move"
                style={{
                  left: cropPosition.x - cropRadius,
                  top: cropPosition.y - cropRadius,
                  width: cropRadius * 2,
                  height: cropRadius * 2
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <div
                  className="border-2 border-white rounded-full w-full h-full"
                ></div>
                {/* 드래그 핸들 표시 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-center space-x-4 px-4 pb-8">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          취소
        </button>
        <button
          onClick={handleCrop}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          완료
        </button>
      </div>

      {/* 숨겨진 캔버스 */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
} 
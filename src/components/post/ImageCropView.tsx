"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useTranslations } from "next-intl";

interface ImageCropViewProps {
  imageFile: File;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export interface ImageCropViewRef {
  handleCrop: () => void;
}

const ImageCropView = forwardRef<ImageCropViewRef, ImageCropViewProps>(
  ({ imageFile, onCropComplete, onCancel }, ref) => {
  const t = useTranslations('imageCrop');
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
      
      // 모달 크기를 고려한 이미지 표시 크기 계산
      const maxWidth = Math.min(350, window.innerWidth - 80);
      const maxHeight = Math.min(350, window.innerHeight - 300);
      
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
    e.stopPropagation();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageElement) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    updateCropPosition(deltaX, deltaY);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !imageElement) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    
    updateCropPosition(deltaX, deltaY);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    e.preventDefault();
    e.stopPropagation();
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
        e.preventDefault();
        e.stopPropagation();
        handleMouseMove(e as any);
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        handleMouseUp();
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        handleTouchMove(e as any);
      }
    };

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        handleTouchEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
      document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false });
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd, { passive: false });
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

  useImperativeHandle(ref, () => ({
    handleCrop
  }));

  return (
    <>
      {/* 설명 텍스트 */}
      <div className="px-6 py-4 text-center">
        <p className="text-gray-300 text-sm">{t('dragToAdjust')}</p>
      </div>

      {/* 이미지 크롭 영역 */}
      <div className="flex justify-center px-6 py-4">
        <div className="relative">
          {imageUrl && (
            <div 
              className="relative select-none overflow-hidden"
              style={{ width: imageSize.width, height: imageSize.height }}
            >
              {/* 원본 이미지 */}
              <img
                src={imageUrl}
                alt={t('imageToCrop')}
                className="w-full h-full object-cover pointer-events-none select-none"
                style={{ 
                  width: imageSize.width, 
                  height: imageSize.height,
                  touchAction: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
                draggable={false}
              />
              
              {/* 어두운 오버레이 (원 바깥 영역) */}
              <div 
                className="absolute pointer-events-none select-none"
                style={{
                  left: cropPosition.x - cropRadius,
                  top: cropPosition.y - cropRadius,
                  width: cropRadius * 2,
                  height: cropRadius * 2,
                  borderRadius: '50%',
                  boxShadow: `0 0 0 ${Math.max(imageSize.width, imageSize.height)}px rgba(0, 0, 0, 0.5)`,
                  touchAction: 'none',
                  userSelect: 'none'
                }}
              ></div>
              
              {/* 원형 크롭 가이드 */}
              <div 
                className="absolute pointer-events-auto cursor-move select-none"
                style={{
                  left: cropPosition.x - cropRadius,
                  top: cropPosition.y - cropRadius,
                  width: cropRadius * 2,
                  height: cropRadius * 2,
                  touchAction: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <div
                  className="border-2 border-white rounded-full w-full h-full pointer-events-none select-none"
                  style={{
                    touchAction: 'none',
                    userSelect: 'none'
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 숨겨진 캔버스 */}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
});

export default ImageCropView; 
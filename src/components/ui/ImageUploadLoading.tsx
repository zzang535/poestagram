"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface ImageUploadLoadingProps {
  className?: string;
}

export default function ImageUploadLoading({ className = "" }: ImageUploadLoadingProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const boxWidth = boxRef.current.offsetWidth;
      const maxX = containerWidth + boxWidth + 100;

      gsap.set(boxRef.current, { x: -boxWidth - 100 }); // 시작 위치를 왼쪽 바깥으로 설정

      gsap.to(boxRef.current, { 
        x: maxX, 
        duration: 1, 
        repeat: -1,
        ease: "power1.inOut"
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full aspect-square bg-gray-800 overflow-hidden">
      <div 
        ref={boxRef} 
        className="absolute left-0 top-0 h-full bg-black rounded"
        style={{
          boxShadow: "0 0 40px 20px rgba(0, 0, 0, 0.5)"
        }}
      />
    </div>
  );
}
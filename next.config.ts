import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // 개발모드에서 두 번째 실행 방지
  reactStrictMode: false,

  // 이미지 최적화 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd30gv4lj99ksbh.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      // 다른 CloudFront 도메인들도 필요시 추가
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      // S3 도메인도 추가
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  
  /* config options here */
};

export default nextConfig;

# Poestagram

POE 패스오브 엑자일 유저를 위한 커뮤니티 플랫폼입니다.

## 환경변수 설정

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Maintenance Mode (서비스 점검 모드)
MAINTENANCE_MODE=false  # 'true'로 설정 시 메인터넌스 페이지로 리다이렉트
```

## 메인터넌스 모드 사용법

서비스 점검이나 업데이트 시 메인터넌스 모드를 활성화할 수 있습니다:

1. **메인터넌스 모드 활성화:**
   ```bash
   # 환경변수 설정
   MAINTENANCE_MODE=true
   
   # 또는 배포 시
   vercel env add MAINTENANCE_MODE true
   ```

2. **메인터넌스 모드 비활성화:**
   ```bash
   # 환경변수 설정
   MAINTENANCE_MODE=false
   
   # 또는 배포 시
   vercel env add MAINTENANCE_MODE false
   ```

3. **작업 순서:**
   - 메인터넌스 모드 활성화 및 배포
   - DB/API 작업 수행
   - 메인터넘스 모드 비활성화 및 배포

메인터넌스 모드가 활성화되면 모든 사용자가 `/maintenance` 페이지로 리다이렉트됩니다.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

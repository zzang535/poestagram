import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'poestagram',
  description: '게임 플레이 영상과 스크린샷을 공유하고 소통하는 커뮤니티',
}

export default function RootPage() {
  redirect('/feed')
} 
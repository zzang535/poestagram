import { create } from 'zustand';

interface VideoState {
  currentPlayingVideo: string | null; // feedId-fileIndex 형태로 저장
  setCurrentPlayingVideo: (videoId: string | null) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  currentPlayingVideo: null,
  setCurrentPlayingVideo: (videoId) => set({ currentPlayingVideo: videoId }),
})); 
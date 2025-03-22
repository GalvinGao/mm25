import { atom } from "jotai";

interface AudioState {
  songId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  audio: HTMLAudioElement | null;
}

export const audioStateAtom = atom<AudioState>({
  songId: null,
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  audio: null,
}); 
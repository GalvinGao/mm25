import { atom } from "jotai";

interface GlobalAudioState {
  currentAudioUrl: string | null;
  currentAudioColor: string | null;
  isPlaying: boolean;
}

export const globalAudioStateAtom = atom<GlobalAudioState>({
  currentAudioUrl: null,
  currentAudioColor: null,
  isPlaying: false,
}); 
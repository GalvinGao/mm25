import { atom } from "jotai";

interface GlobalAudioState {
  currentAudioUrl: string | null;
  isPlaying: boolean;
}

export const globalAudioStateAtom = atom<GlobalAudioState>({
  currentAudioUrl: null,
  isPlaying: false,
}); 
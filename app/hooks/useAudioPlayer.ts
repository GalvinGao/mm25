import { useRef, useState } from "react";

export const useAudioPlayer = () => {
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayPause = (songId: string, audioUrl?: string) => {
    if (playingSongId === songId) {
      audioRef.current?.pause();
      setPlayingSongId(null);
    } else {
      if (playingSongId) {
        audioRef.current?.pause();
      }
      setPlayingSongId(songId);
      audioRef.current = new Audio(audioUrl ?? `/api/audio/${songId}`);
      audioRef.current.play();
    }
  };

  return {
    playingSongId,
    togglePlayPause,
  };
}; 
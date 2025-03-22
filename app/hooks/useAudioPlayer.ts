import { useCallback, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { globalAudioStateAtom } from "../atoms/audioManager";

interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  hasError: boolean;
  currentTime: number;
  duration: number;
}

interface AudioControls {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
}

export const useAudioPlayer = (audioUrl?: string) => {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    hasError: false,
    currentTime: 0,
    duration: 0,
  });

  const [globalAudioState, setGlobalAudioState] = useAtom(globalAudioStateAtom);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function is now memoized with no dependencies
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
      audioRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Stop playing if another audio starts
  useEffect(() => {
    if (globalAudioState.currentAudioUrl !== audioUrl && state.isPlaying) {
      cleanup();
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    }
  }, [globalAudioState.currentAudioUrl, audioUrl, state.isPlaying, cleanup]);

  const play = useCallback(async () => {
    if (!audioUrl) return;

    try {
      cleanup();
      setState(prev => ({ ...prev, isLoading: true, hasError: false }));

      // Update global state
      setGlobalAudioState({
        currentAudioUrl: audioUrl,
        isPlaying: true,
      });

      // Create new abort controller for this operation
      abortControllerRef.current = new AbortController();
      const audio = new Audio();
      audioRef.current = audio;

      // Set up event listeners
      const loadPromise = new Promise<void>((resolve, reject) => {
        if (!audio) return reject(new Error("No audio element"));

        audio.addEventListener("canplay", () => resolve(), { once: true });
        audio.addEventListener("error", (e) => reject(e), { once: true });
      });

      // Start loading the audio
      audio.src = audioUrl;
      audio.load();

      // Wait for the audio to be ready
      await loadPromise;

      // Check if we've been aborted while loading
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error("Aborted");
      }

      // Set up continuous event listeners
      audio.addEventListener("timeupdate", () => {
        setState(prev => ({
          ...prev,
          currentTime: audio.currentTime,
          duration: audio.duration,
        }));
      });

      audio.addEventListener("ended", () => {
        setState(prev => ({
          ...prev,
          isPlaying: false,
          currentTime: 0,
        }));
        setGlobalAudioState(prev => ({
          ...prev,
          isPlaying: false,
        }));
      });

      // Start playing
      await audio.play();
      setState(prev => ({
        ...prev,
        isPlaying: true,
        isLoading: false,
        duration: audio.duration,
      }));
    } catch (error) {
      if (error instanceof Error && error.message === "Aborted") {
        // Ignore aborted operations
        return;
      }
      console.error("Error playing audio:", error);
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
        hasError: true,
      }));
      setGlobalAudioState({
        currentAudioUrl: null,
        isPlaying: false,
      });
    }
  }, [audioUrl, cleanup, setGlobalAudioState]);

  const pause = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
      setGlobalAudioState(prev => ({
        ...prev,
        isPlaying: false,
      }));
    } catch (error) {
      console.error("Error pausing audio:", error);
    }
  }, [setGlobalAudioState]);

  const stop = useCallback(async () => {
    try {
      await pause();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      setState(prev => ({ ...prev, currentTime: 0 }));
      setGlobalAudioState({
        currentAudioUrl: null,
        isPlaying: false,
      });
    } catch (error) {
      console.error("Error stopping audio:", error);
    }
  }, [pause, setGlobalAudioState]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  return {
    state,
    controls: {
      play,
      pause,
      stop,
    } as AudioControls,
  };
}; 
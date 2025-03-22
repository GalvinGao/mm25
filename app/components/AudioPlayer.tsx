import { audioStateAtom } from "@/app/atoms/audio";
import clsx from "clsx";
import { useAtom } from "jotai";
import { Loader2, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, type FC } from "react";

interface AudioPlayerProps {
	songId: string;
	audioUrl?: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ songId, audioUrl }) => {
	const [audioState, setAudioState] = useAtom(audioStateAtom);
	const cleanupRef = useRef<(() => void) | null>(null);

	const isCurrentSong = audioState.songId === songId;
	const isPlaying = isCurrentSong && audioState.isPlaying;
	const isLoading = isCurrentSong && audioState.isLoading;

	const setupAudioListeners = useCallback(
		(audio: HTMLAudioElement) => {
			const timeUpdateHandler = () => {
				setAudioState((prev) => ({
					...prev,
					currentTime: audio.currentTime,
				}));
			};

			const endedHandler = () => {
				setAudioState((prev) => ({
					...prev,
					isPlaying: false,
					currentTime: 0,
				}));
			};

			audio.addEventListener("timeupdate", timeUpdateHandler);
			audio.addEventListener("ended", endedHandler);

			return () => {
				audio.removeEventListener("timeupdate", timeUpdateHandler);
				audio.removeEventListener("ended", endedHandler);
			};
		},
		[setAudioState],
	);

	// Set up audio listeners when the current song changes
	useEffect(() => {
		if (!audioUrl || !isCurrentSong || !audioState.audio) return;

		const cleanup = setupAudioListeners(audioState.audio);
		cleanupRef.current = cleanup;

		return () => {
			cleanup();
			cleanupRef.current = null;
		};
	}, [audioUrl, isCurrentSong, audioState.audio, setupAudioListeners]);

	// Cleanup on unmount
	useEffect(() => {
		const audio = audioState.audio;
		const cleanup = () => {
			if (audio) {
				audio.pause();
				setAudioState((prev) => ({
					...prev,
					isPlaying: false,
					currentTime: 0,
					audio: null,
					songId: null,
				}));
			}
		};
		return cleanup;
	}, [audioState.audio, setAudioState]);

	const handlePlayPause = async () => {
		if (!audioUrl) return;

		if (isCurrentSong) {
			// Same song - toggle play/pause
			if (audioState.audio) {
				if (audioState.isPlaying) {
					try {
						await audioState.audio.pause();
						setAudioState((prev) => ({
							...prev,
							isPlaying: false,
						}));
					} catch (error) {
						console.error("Error pausing audio:", error);
					}
				} else {
					setAudioState((prev) => ({ ...prev, isLoading: true }));
					try {
						// Ensure audio is ready before playing
						if (audioState.audio.readyState !== 4) {
							await new Promise((resolve) => {
								if (audioState.audio) {
									audioState.audio.addEventListener("canplay", resolve, {
										once: true,
									});
								} else {
									resolve(undefined);
								}
							});
						}
						await audioState.audio.play();
						setAudioState((prev) => ({
							...prev,
							isPlaying: true,
							isLoading: false,
						}));
					} catch (error) {
						console.error("Error playing audio:", error);
						setAudioState((prev) => ({ ...prev, isLoading: false }));
					}
				}
			}
		} else {
			// Different song - stop current and play new
			if (audioState.audio) {
				try {
					await audioState.audio.pause();
					audioState.audio.currentTime = 0;
				} catch (error) {
					console.error("Error stopping current audio:", error);
				}
			}

			const newAudio = new Audio(audioUrl);
			setAudioState((prev) => ({
				...prev,
				audio: newAudio,
				songId,
				isLoading: true,
				currentTime: 0,
			}));

			try {
				// Wait for audio to be ready before playing
				await new Promise((resolve) => {
					newAudio.addEventListener("canplay", resolve, { once: true });
				});
				await newAudio.play();
				setAudioState((prev) => ({
					...prev,
					isPlaying: true,
					isLoading: false,
				}));
			} catch (error) {
				console.error("Error playing new audio:", error);
				setAudioState((prev) => ({
					...prev,
					isLoading: false,
				}));
			}
		}
	};

	return (
		<button
			type="button"
			onClick={handlePlayPause}
			disabled={isLoading || !audioUrl}
			className={clsx(
				"flex h-8 w-8 items-center justify-center rounded-full transition-colors",
				isPlaying
					? "bg-blue-600 text-white hover:bg-blue-700"
					: "bg-gray-100 text-gray-700 hover:bg-gray-200",
				(isLoading || !audioUrl) && "cursor-not-allowed opacity-50",
			)}
		>
			{isLoading ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : isPlaying ? (
				<Pause className="h-4 w-4" />
			) : (
				<Play className="h-4 w-4" />
			)}
		</button>
	);
};

export default AudioPlayer;

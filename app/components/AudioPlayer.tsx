import clsx from "clsx";
import { Loader2, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type FC } from "react";

interface AudioPlayerProps {
	songId: string;
	audioUrl?: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ songId, audioUrl }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (!audioRef.current && audioUrl) {
			audioRef.current = new Audio(audioUrl);
			audioRef.current.addEventListener("playing", () => {
				setIsLoading(false);
				setIsPlaying(true);
			});
			audioRef.current.addEventListener("pause", () => {
				setIsPlaying(false);
			});
			audioRef.current.addEventListener("ended", () => {
				setIsPlaying(false);
			});
		}

		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current = null;
			}
		};
	}, [audioUrl]);

	const handlePlayPause = async () => {
		if (!audioRef.current || !audioUrl) return;

		if (isPlaying) {
			audioRef.current.pause();
		} else {
			setIsLoading(true);
			try {
				await audioRef.current.play();
			} catch (error) {
				setIsLoading(false);
				console.error("Error playing audio:", error);
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

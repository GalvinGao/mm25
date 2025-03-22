import clsx from "clsx";
import { AlertCircle, Loader2, Pause, Play } from "lucide-react";
import type { FC } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

interface AudioPlayerProps {
	audioUrl?: string;
	color: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ audioUrl, color }) => {
	const { state, controls } = useAudioPlayer(audioUrl, color);
	const { isPlaying, isLoading, hasError } = state;

	const handlePlayPause = async () => {
		if (!audioUrl) return;
		if (isPlaying) {
			await controls.pause();
		} else {
			await controls.play();
		}
	};

	return (
		<button
			type="button"
			onClick={handlePlayPause}
			disabled={isLoading || !audioUrl}
			className={clsx(
				"flex h-8 w-8 items-center justify-center rounded-full transition cursor-pointer active:scale-95",
				isPlaying
					? "text-white"
					: hasError
						? "bg-red-100 text-red-700 hover:bg-red-200"
						: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 hover:border-gray-300",
				(isLoading || !audioUrl) && "cursor-not-allowed opacity-50",
			)}
			style={isPlaying ? { backgroundColor: color } : undefined}
		>
			{isLoading ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : hasError ? (
				<AlertCircle className="h-4 w-4" />
			) : isPlaying ? (
				<Pause className="h-4 w-4" />
			) : (
				<Play className="h-4 w-4" />
			)}
		</button>
	);
};

export default AudioPlayer;

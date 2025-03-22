import clsx from "clsx";
import { AlertCircle, Loader2, Pause, Play } from "lucide-react";
import type { FC } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

interface AudioPlayerProps {
	songId: string;
	audioUrl?: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ audioUrl }) => {
	const { state, controls } = useAudioPlayer(audioUrl);
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
				"flex h-8 w-8 items-center justify-center rounded-full transition-colors",
				isPlaying
					? "bg-blue-600 text-white hover:bg-blue-700"
					: hasError
						? "bg-red-100 text-red-700 hover:bg-red-200"
						: "bg-gray-100 text-gray-700 hover:bg-gray-200",
				(isLoading || !audioUrl) && "cursor-not-allowed opacity-50",
			)}
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

import { Pause, Play } from "lucide-react";
import type { FC } from "react";

interface AudioPlayerProps {
	songId: string;
	isPlaying: boolean;
	onPlayPause: (songId: string) => void;
	audioUrl?: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({
	songId,
	isPlaying,
	onPlayPause,
	audioUrl,
}) => {
	return (
		<button
			type="button"
			onClick={() => onPlayPause(songId)}
			className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
		>
			{isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
		</button>
	);
};

export default AudioPlayer;

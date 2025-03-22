import type { FC } from "react";

interface AudioPlayerProps {
	songId: string;
	title: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ songId, title }) => {
	return (
		<audio
			controls
			className="w-full"
			preload="none"
			src={`/api/audio/${songId}`}
		>
			<track
				kind="captions"
				src=""
				label={`Captions for ${title}`}
				srcLang="en"
			/>
			Your browser does not support the audio element.
		</audio>
	);
};

export default AudioPlayer;

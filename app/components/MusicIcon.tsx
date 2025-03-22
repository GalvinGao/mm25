"use client";

import { globalAudioStateAtom } from "@/app/atoms/audioManager";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { Music } from "lucide-react";

export const MusicIcon = () => {
	const { currentAudioColor } = useAtomValue(globalAudioStateAtom);
	return (
		<Music
			className={clsx("h-8 w-8 shrink-0 transition", currentAudioColor)}
			style={{ color: currentAudioColor ?? "#39c5bb" }}
		/>
	);
};

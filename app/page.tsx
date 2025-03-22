import { prisma } from "@/lib/db";
import { Clock, Eye, Music, ThumbsUp } from "lucide-react";
import type { FC } from "react";

interface SongCardProps {
	song: {
		song_id: string;
		title: string;
		thumbnail: string | null;
		creatorName: string | null;
		duration: string | null;
		viewCount: number | null;
		likeCount: number | null;
	};
}

const SongCard: FC<SongCardProps> = ({ song }) => {
	return (
		<div className="group relative overflow-hidden rounded-lg bg-white shadow hover:shadow-lg transition-all">
			<div className="relative w-full pt-[56.25%]">
				{song.thumbnail ? (
					<img
						src={song.thumbnail}
						alt={song.title}
						className="absolute inset-0 h-full w-full object-cover"
					/>
				) : (
					<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
						<Music className="h-12 w-12 text-white opacity-75" />
					</div>
				)}
			</div>
			<div className="p-4">
				<h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
					{song.title}
				</h3>
				<p className="mt-1 text-sm text-gray-500">
					{song.creatorName || "Unknown Artist"}
				</p>
				<div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
					<div className="flex items-center gap-1">
						<Clock className="h-4 w-4" />
						<span>{song.duration || "N/A"}</span>
					</div>
					<div className="flex items-center gap-1">
						<Eye className="h-4 w-4" />
						<span>{song.viewCount?.toLocaleString() || "0"}</span>
					</div>
					<div className="flex items-center gap-1">
						<ThumbsUp className="h-4 w-4" />
						<span>{song.likeCount?.toLocaleString() || "0"}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default async function Home() {
	const songs = await prisma.song.findMany({
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<main className="mx-auto max-w-7xl px-4 py-8">
			<div className="flex items-center justify-between">
				<h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
					<Music className="h-8 w-8 text-blue-600" />
					Music Library
				</h1>
			</div>

			<div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{songs.map((song) => (
					<SongCard key={song.song_id} song={song} />
				))}
			</div>
		</main>
	);
}

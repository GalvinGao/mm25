import { prisma } from "@/lib/db";
import { Music } from "lucide-react";
import SongTable from "./components/SongTable";

export default async function Home() {
	const songs = await prisma.song.findMany({
		orderBy: {
			createdAt: "desc",
		},
		include: {
			files: true,
		},
	});

	return (
		<main className="mx-auto max-w-7xl px-4 py-8">
			<div className="flex flex-col gap-2">
				<h1 className="flex items-start gap-2 text-2xl font-bold text-gray-900">
					<Music className="h-8 w-8 text-blue-600 shrink-0" />
					<span>初音ミク「マジカルミライ 2025」</span>
				</h1>
				<h2 className="text-lg text-gray-900">
					楽曲コンテスト 非公式楽曲ライブラリー
				</h2>
			</div>

			<SongTable songs={songs} />
		</main>
	);
}

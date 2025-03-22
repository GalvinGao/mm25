import { MusicIcon } from "@/app/components/MusicIcon";
import { getVocaloidColor } from "@/app/lib/vocaloidColors";
import { prisma } from "@/lib/db";
import SongTable from "./components/SongTable";

export default async function Home() {
	const songs = (
		await prisma.song.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				files: true,
			},
		})
	).map((song) => ({
		...song,
		color: getVocaloidColor(song.tags as string[]),
	}));

	return (
		<main className="mx-auto max-w-7xl py-8">
			<div className="flex flex-col gap-2 px-4">
				<h1 className="flex items-start gap-2 text-2xl font-bold text-gray-900">
					<MusicIcon />
					<span>
						初音ミク
						<span className="whitespace-nowrap">「マジカルミライ 2025」</span>
					</span>
				</h1>
				<h2 className="text-lg text-gray-900">
					楽曲コンテスト 非公式楽曲ライブラリー
				</h2>
			</div>

			<SongTable songs={songs} />
		</main>
	);
}

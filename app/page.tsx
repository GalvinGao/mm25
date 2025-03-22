import { prisma } from "@/lib/db";
import { Music } from "lucide-react";
import SongTable from "./components/SongTable";

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

			<SongTable songs={songs} />
		</main>
	);
}

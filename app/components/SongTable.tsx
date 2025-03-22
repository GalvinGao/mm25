"use client";

import type { Song } from "@prisma/client";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
} from "@tanstack/react-table";
import { Clock, Eye, Pause, Play, ThumbsUp } from "lucide-react";
import { useRef, useState, type FC } from "react";

interface SongTableProps {
	songs: Song[];
}

const columnHelper = createColumnHelper<Song>();

const SongTable: FC<SongTableProps> = ({ songs }) => {
	const [playingSongId, setPlayingSongId] = useState<string | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const togglePlayPause = (songId: string) => {
		if (playingSongId === songId) {
			audioRef.current?.pause();
			setPlayingSongId(null);
		} else {
			if (playingSongId) {
				audioRef.current?.pause();
			}
			setPlayingSongId(songId);
			audioRef.current = new Audio(`/api/audio/${songId}`);
			audioRef.current.play();
		}
	};

	const columns = [
		columnHelper.accessor("title", {
			header: "Title",
			cell: (info) => (
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={() => togglePlayPause(info.row.original.song_id)}
						className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
					>
						{playingSongId === info.row.original.song_id ? (
							<Pause className="h-4 w-4" />
						) : (
							<Play className="h-4 w-4" />
						)}
					</button>
					<div>
						<div className="font-medium text-gray-900">{info.getValue()}</div>
						<div className="text-sm text-gray-500">
							{info.row.original.creatorName || "Unknown Artist"}
						</div>
					</div>
				</div>
			),
		}),
		columnHelper.accessor("duration", {
			header: () => (
				<div className="flex items-center gap-1">
					<Clock className="h-4 w-4" />
					<span>Duration</span>
				</div>
			),
			cell: (info) => info.getValue() || "N/A",
		}),
		columnHelper.accessor("viewCount", {
			header: () => (
				<div className="flex items-center gap-1">
					<Eye className="h-4 w-4" />
					<span>Views</span>
				</div>
			),
			cell: (info) => info.getValue()?.toLocaleString() || "0",
		}),
		columnHelper.accessor("likeCount", {
			header: () => (
				<div className="flex items-center gap-1">
					<ThumbsUp className="h-4 w-4" />
					<span>Likes</span>
				</div>
			),
			cell: (info) => info.getValue()?.toLocaleString() || "0",
		}),
	] as ColumnDef<Song>[];

	const table = useReactTable({
		data: songs,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="mt-6 flow-root">
			<div className="overflow-x-auto">
				<div className="inline-block min-w-full align-middle">
					<table className="min-w-full divide-y divide-gray-300">
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody className="divide-y divide-gray-200">
							{table.getRowModel().rows.map((row) => (
								<tr key={row.id} className="hover:bg-gray-50 transition-colors">
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default SongTable;

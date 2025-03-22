"use client";

import type { File, Song } from "@prisma/client";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Clock, Eye, ThumbsUp } from "lucide-react";
import { useState, type FC } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import AudioPlayer from "./AudioPlayer";

interface SongTableProps {
	songs: (Song & { files: File[] })[];
}

const columnHelper = createColumnHelper<Song & { files: File[] }>();

const SongTable: FC<SongTableProps> = ({ songs }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const { playingSongId, togglePlayPause } = useAudioPlayer();

	const columns = [
		columnHelper.accessor("title", {
			header: "Title",
			sortingFn: "alphanumeric",
			cell: (info) => (
				<div className="flex items-center gap-4">
					<AudioPlayer
						songId={info.row.original.song_id}
						isPlaying={playingSongId === info.row.original.song_id}
						onPlayPause={(songId) =>
							togglePlayPause(songId, info.row.original.files[0]?.url)
						}
						audioUrl={info.row.original.files[0]?.url}
					/>
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
			sortingFn: "alphanumeric",
			cell: (info) => info.getValue() || "N/A",
		}),
		columnHelper.accessor("viewCount", {
			header: () => (
				<div className="flex items-center gap-1">
					<Eye className="h-4 w-4" />
					<span>Views</span>
				</div>
			),
			sortingFn: "basic",
			cell: (info) => info.getValue()?.toLocaleString() || "0",
		}),
		columnHelper.accessor("likeCount", {
			header: () => (
				<div className="flex items-center gap-1">
					<ThumbsUp className="h-4 w-4" />
					<span>Likes</span>
				</div>
			),
			sortingFn: "basic",
			cell: (info) => info.getValue()?.toLocaleString() || "0",
		}),
	] as ColumnDef<Song>[];

	const table = useReactTable({
		data: songs,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
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
											{header.column.getCanSort() ? (
												<button
													type="button"
													className="group inline-flex items-center gap-1"
													onClick={header.column.getToggleSortingHandler()}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													<span className="ml-2 flex-none rounded">
														{{
															asc: <ArrowUp className="h-4 w-4" />,
															desc: <ArrowDown className="h-4 w-4" />,
														}[header.column.getIsSorted() as string] ?? null}
													</span>
												</button>
											) : (
												flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)
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

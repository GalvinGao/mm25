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
import AudioPlayer from "./AudioPlayer";

type MergedSong = Song & { files: File[]; color: string };
interface SongTableProps {
	songs: MergedSong[];
}

const columnHelper = createColumnHelper<MergedSong>();

const HeaderCell: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="flex items-center gap-1 whitespace-nowrap">{children}</div>
	);
};

const SongTable: FC<SongTableProps> = ({ songs }) => {
	const [sorting, setSorting] = useState<SortingState>([]);

	const columns = [
		columnHelper.accessor("title", {
			header: "タイトル",
			sortingFn: "alphanumeric",
			cell: (info) => (
				<div className="flex items-center gap-4">
					<AudioPlayer
						audioUrl={info.row.original.files[0]?.url}
						color={info.row.original.color}
					/>
					{info.row.original.thumbnail && (
						<div className="relative aspect-square size-16 overflow-hidden rounded-lg bg-gray-100">
							<img
								src={info.row.original.thumbnail}
								alt={`${info.getValue()}のサムネイル`}
								className="absolute inset-0 h-full w-full object-cover"
							/>
						</div>
					)}
					<div className="flex flex-col gap-1">
						<div className="font-medium text-base text-gray-900">
							<a
								href={`https://piapro.jp/t/${info.row.original.song_id}`}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary-500 transition-colors underline underline-offset-3 decoration-black/20"
							>
								{info.getValue()}
							</a>
						</div>
						<div className="flex items-center gap-1.5 text-sm text-gray-500">
							{info.row.original.creatorIcon && (
								<img
									src={info.row.original.creatorIcon}
									alt={`${info.row.original.creatorName}のアイコン`}
									className="h-5 w-5 rounded-full object-cover"
								/>
							)}
							{info.row.original.creatorName || "不明なアーティスト"}
						</div>
					</div>
				</div>
			),
		}),
		columnHelper.accessor("duration", {
			header: () => (
				<HeaderCell>
					<Clock className="h-4 w-4" />
					<span>再生時間</span>
				</HeaderCell>
			),
			sortingFn: "alphanumeric",
			cell: (info) => (
				<span className="tabular-nums">{info.getValue() || "なし"}</span>
			),
		}),
		columnHelper.accessor("viewCount", {
			header: () => (
				<HeaderCell>
					<Eye className="h-4 w-4" />
					<span>再生回数</span>
				</HeaderCell>
			),
			sortingFn: "basic",
			cell: (info) => (
				<span className="tabular-nums">
					{info.getValue()?.toLocaleString() || "0"}
				</span>
			),
		}),
		columnHelper.accessor("likeCount", {
			header: () => (
				<HeaderCell>
					<ThumbsUp className="h-4 w-4" />
					<span>Likes</span>
				</HeaderCell>
			),
			sortingFn: "basic",
			cell: (info) => (
				<span className="tabular-nums">
					{info.getValue()?.toLocaleString() || "0"}
				</span>
			),
		}),
	] as ColumnDef<MergedSong>[];

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
											className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
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
											className="whitespace-nowrap px-4 py-4 text-sm text-gray-500"
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

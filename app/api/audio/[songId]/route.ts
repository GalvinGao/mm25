import type { NextRequest } from "next/server";
import { createReadStream, statSync } from "node:fs";
import { prisma } from "@/lib/db";

export async function GET(
	request: NextRequest,
	{ params }: { params: { songId: string } },
) {
	try {
		// Verify the song exists and get its associated file
		const song = await prisma.song.findUnique({
			where: { song_id: params.songId },
		});

		if (!song) {
			return new Response("Song not found", { status: 404 });
		}

		const file = await prisma.file.findFirst({
			where: { 
				song_id: params.songId,
				status: "completed" // Only serve completed files
			},
			orderBy: {
				created_at: "desc" // Get the most recent file if multiple exist
			}
		});

		if (!file) {
			return new Response("Audio file not found or not ready", { status: 404 });
		}

		try {
			// Check if file exists and get its stats
			const stat = statSync(file.path);

			const range = request.headers.get("range");
			if (range) {
				// Handle range requests for seeking
				const parts = range.replace(/bytes=/, "").split("-");
				const start = Number.parseInt(parts[0], 10);
				const end = parts[1] ? Number.parseInt(parts[1], 10) : stat.size - 1;
				const chunksize = end - start + 1;

				const stream = createReadStream(file.path, { start, end });
				const headers = {
					"Content-Type": "audio/mpeg",
					"Content-Length": chunksize.toString(),
					"Content-Range": `bytes ${start}-${end}/${stat.size}`,
					"Accept-Ranges": "bytes",
				};

				return new Response(stream as unknown as ReadableStream, {
					status: 206,
					headers,
				});
			}

			// Handle regular requests
			const stream = createReadStream(file.path);
			const headers = {
				"Content-Type": "audio/mpeg",
				"Content-Length": stat.size.toString(),
				"Accept-Ranges": "bytes",
			};

			return new Response(stream as unknown as ReadableStream, {
				status: 200,
				headers,
			});
		} catch (error) {
			console.error("File access error:", error);
			return new Response("File not found or inaccessible", { status: 404 });
		}
	} catch (error) {
		console.error("Server error:", error);
		return new Response("Internal server error", { status: 500 });
	}
}

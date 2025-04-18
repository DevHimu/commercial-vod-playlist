import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const movies = await prisma.movie.findMany();
    const series = await prisma.series.findMany({ include: { episodes: true } });

    let playlist = "#EXTM3U\n";

    // Add movies
    movies.forEach((movie) => {
      playlist += `#EXTINF:-1 tvg-logo="${movie.imageUrl}",${movie.name} (${movie.year})\n`;
      playlist += `${movie.streamUrl}\n`;
    });

    // Add series
    series.forEach((s) => {
      s.episodes.forEach((ep) => {
        playlist += `#EXTINF:-1 tvg-logo="${s.imageUrl}",${s.name} S${ep.season}E${ep.episode}\n`;
        playlist += `${ep.streamUrl}\n`;
      });
    });

    return new NextResponse(playlist, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": "attachment; filename=playlist.m3u8",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate playlist" }, { status: 500 });
  }
}
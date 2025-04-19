import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all movies and series with episodes
    const movies = await prisma.movie.findMany();
    const series = await prisma.series.findMany({
      include: { episodes: true },
    });

    // Generate M3U8 playlist
    const playlist = [
      "#EXTM3U", // M3U header
      // Movies: Group by language
      ...movies.flatMap((m) => [
        `#EXTINF:-1 tvg-logo="${m.imageUrl}",${m.name} (${m.year})`,
        `#EXTGRP:${m.language}`,
        m.streamUrl,
      ]),
      // Series: Group by OTT, then series name, then season
      ...series.flatMap((s) =>
        s.episodes
          .sort((a, b) => a.season - b.season || a.episode - b.episode)
          .flatMap((ep) => [
            `#EXTINF:-1 tvg-logo="${s.imageUrl}",${s.name} S${ep.season.toString().padStart(2, "0")}E${ep.episode
              .toString()
              .padStart(2, "0")}`,
            `#EXTGRP:${s.ott}/${s.name}/Season ${ep.season}`,
            ep.streamUrl,
          ])
      ),
    ].join("\n");

    // Return playlist as a downloadable file
    return new NextResponse(playlist, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": "attachment; filename=playlist.m3u",
      },
    });
  } catch (e) {
    console.error("Error generating playlist:", e);
    return NextResponse.json({ error: "Failed to generate playlist" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
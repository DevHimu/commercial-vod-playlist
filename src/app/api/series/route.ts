import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type EpisodeInput = {
  season: number;
  episode: number;
  streamUrl: string;
};

export async function POST(request: Request) {
  try {
    const { name, language, imageUrl, tmdbLink, episodes }: { name: string; language: string; imageUrl: string; tmdbLink?: string; episodes: EpisodeInput[] } = await request.json();
    const series = await prisma.series.create({
      data: {
        name,
        language,
        imageUrl,
        tmdbLink,
        episodes: {
          create: episodes.map((ep: EpisodeInput) => ({
            season: ep.season,
            episode: ep.episode,
            streamUrl: ep.streamUrl,
          })),
        },
      },
      include: { episodes: true },
    });
    return NextResponse.json(series, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add series" }, { status: 500 });
  }
}
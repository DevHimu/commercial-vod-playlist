import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, ott, language, imageUrl, tmdbLink, episodes } = await req.json();
    const series = await prisma.series.create({
      data: {
        name,
        ott,
        language: language || null,
        imageUrl,
        tmdbLink: tmdbLink || null,
        episodes: {
          create: episodes.map((ep: { season: number; episode: number; streamUrl: string }) => ({
            season: ep.season,
            episode: ep.episode,
            streamUrl: ep.streamUrl,
          })),
        },
      },
    });
    return NextResponse.json(series, { status: 201 });
  } catch (e) {
    console.error("Error creating series:", e);
    return NextResponse.json({ error: "Failed to create series" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
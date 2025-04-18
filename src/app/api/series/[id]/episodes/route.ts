import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { season, episode, streamUrl } = await request.json();
    const params = await context.params;
    const newEpisode = await prisma.episode.create({
      data: {
        seriesId: parseInt(params.id),
        season,
        episode,
        streamUrl,
      },
    });
    return NextResponse.json(newEpisode, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add episode" }, { status: 500 });
  }
}
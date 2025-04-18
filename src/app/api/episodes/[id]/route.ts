import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } // Wrap params in Promise
) {
  try {
    const { season, episode, streamUrl } = await request.json();
    const params = await context.params; // Resolve the Promise
    const updatedEpisode = await prisma.episode.update({
      where: { id: parseInt(params.id) },
      data: { season, episode, streamUrl },
    });
    return NextResponse.json(updatedEpisode);
  } catch {
    return NextResponse.json({ error: "Failed to update episode" }, { status: 500 });
  }
}
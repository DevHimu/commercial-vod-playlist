import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, context: any) {
  try {
    const { name, ott, language, imageUrl, tmdbLink, episodes } = await req.json();
    const seriesId = parseInt(context.params.id);
    await prisma.series.update({
      where: { id: seriesId },
      data: {
        name,
        ott,
        language: language || null,
        imageUrl,
        tmdbLink: tmdbLink || null,
      },
    });
    await prisma.episode.deleteMany({ where: { seriesId } });
    await prisma.episode.createMany({
      data: episodes.map((ep: { season: number; episode: number; streamUrl: string }) => ({
        seriesId,
        season: ep.season,
        episode: ep.episode,
        streamUrl: ep.streamUrl,
      })),
    });
    return NextResponse.json({ message: "Series updated" }, { status: 200 });
  } catch (e) {
    console.error("Error updating series:", e);
    return NextResponse.json({ error: "Failed to update series" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, context: any) {
  try {
    const series = await prisma.series.findUnique({
      where: { id: parseInt(context.params.id) },
      include: { episodes: true },
    });
    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }
    return NextResponse.json(series, { status: 200 });
  } catch (e) {
    console.error("Error fetching series:", e);
    return NextResponse.json({ error: "Failed to fetch series" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
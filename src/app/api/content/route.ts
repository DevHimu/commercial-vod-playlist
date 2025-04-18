import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({ orderBy: { name: "asc" } });
    const series = await prisma.series.findMany({
      include: { episodes: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ movies, series });
  } catch {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
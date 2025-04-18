import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { name, language, imageUrl, tmdbLink } = await request.json();
    const params = await context.params;
    const series = await prisma.series.update({
      where: { id: parseInt(params.id) },
      data: { name, language, imageUrl, tmdbLink },
    });
    return NextResponse.json(series);
  } catch {
    return NextResponse.json({ error: "Failed to update series" }, { status: 500 });
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const series = await prisma.series.findUnique({
      where: { id: parseInt(params.id) },
      include: { episodes: true },
    });
    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }
    return NextResponse.json(series);
  } catch {
    return NextResponse.json({ error: "Failed to fetch series" }, { status: 500 });
  }
}
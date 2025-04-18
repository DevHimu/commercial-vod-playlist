import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { name, year, language, imageUrl, tmdbLink, streamUrl } = await request.json();
    const params = await context.params;
    const movie = await prisma.movie.update({
      where: { id: parseInt(params.id) },
      data: { name, year, language, imageUrl, tmdbLink, streamUrl },
    });
    return NextResponse.json(movie);
  } catch {
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
  }
}
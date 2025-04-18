import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, year, language, imageUrl, tmdbLink, streamUrl } = await request.json();
    const movie = await prisma.movie.create({
      data: { name, year, language, imageUrl, tmdbLink, streamUrl },
    });
    return NextResponse.json(movie, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add movie" }, { status: 500 });
  }
}
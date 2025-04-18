import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Movie = { id: number; name: string; year: number; language: string; imageUrl: string; tmdbLink: string | null; streamUrl: string };
type Episode = { id: number; season: number; episode: number; streamUrl: string };
type Series = { id: number; name: string; language: string; imageUrl: string; tmdbLink: string | null; episodes: Episode[] };

export const dynamic = "force-dynamic";

async function fetchContent() {
  try {
    console.log("Fetching content from database...");
    const movies = await prisma.movie.findMany({ orderBy: { name: "asc" } });
    const series = await prisma.series.findMany({
      include: { episodes: true },
      orderBy: { name: "asc" },
    });
    console.log("Content fetched successfully:", { movieCount: movies.length, seriesCount: series.length });
    return { movies, series, error: null };
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Failed to load content";
    console.error("Error fetching content:", errorMessage);
    return { movies: [], series: [], error: errorMessage };
  } finally {
    console.log("Disconnecting Prisma client...");
    await prisma.$disconnect().catch((e) => console.error("Error disconnecting Prisma:", e));
  }
}

export default async function ContentIndex() {
  const { movies, series, error } = await fetchContent();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Content Index</h1>
      {error ? (
        <div className="text-red-600 mb-4">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search (disabled in server component)"
            className="w-full p-2 mb-6 border rounded"
            disabled
          />
          <h2 className="text-2xl font-semibold mb-4">Movies</h2>
          {movies.length === 0 ? (
            <p>No movies found.</p>
          ) : (
            <ul className="mb-8">
              {movies.map((movie: Movie) => (
                <li key={movie.id} className="flex justify-between items-center p-2 border-b">
                  <span>
                    {movie.name} ({movie.year})
                  </span>
                  <Link href={`/edit-movie/${movie.id}`}>
                    <button className="px-4 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">Edit</button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <h2 className="text-2xl font-semibold mb-4">Series</h2>
          {series.length === 0 ? (
            <p>No series found.</p>
          ) : (
            <ul>
              {series.map((s: Series) => (
                <li key={s.id} className="flex justify-between items-center p-2 border-b">
                  <span>{s.name}</span>
                  <Link href={`/edit-series/${s.id}`}>
                    <button className="px-4 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">Edit</button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">VOD Playlist Manager</h1>
      <div className="space-x-4">
        <Link href="/add-movie">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Movie</button>
        </Link>
        <Link href="/add-series">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Add Series</button>
        </Link>
        <Link href="/content-index">
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Index</button>
        </Link>
        <a href="/api/playlist" download="playlist.m3u8">
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Download Playlist</button>
        </a>
      </div>
    </div>
  );
}
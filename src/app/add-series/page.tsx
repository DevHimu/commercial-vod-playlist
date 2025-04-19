"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddSeries() {
  const [series, setSeries] = useState({
    name: "",
    ott: "",
    language: "",
    imageUrl: "",
    tmdbLink: "",
  });
  const [episodes, setEpisodes] = useState([
    { season: 1, episode: 1, streamUrl: "" },
  ]);
  const router = useRouter();

  const addEpisode = () => {
    const lastEpisode = episodes[episodes.length - 1];
    setEpisodes([
      ...episodes,
      { season: lastEpisode.season, episode: lastEpisode.episode + 1, streamUrl: "" },
    ]);
  };

  const addSeason = () => {
    const lastEpisode = episodes[episodes.length - 1];
    setEpisodes([...episodes, { season: lastEpisode.season + 1, episode: 1, streamUrl: "" }]);
  };

  const updateEpisode = (index: number, field: string, value: string | number) => {
    const newEpisodes = [...episodes];
    newEpisodes[index] = { ...newEpisodes[index], [field]: value };
    setEpisodes(newEpisodes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/series", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...series,
        episodes,
      }),
    });
    if (res.ok) {
      router.push("/content-index");
    } else {
      alert("Failed to add series");
    }
  };

  // Group episodes by season
  const episodesBySeason: { [key: number]: typeof episodes } = {};
  episodes.forEach((ep) => {
    if (!episodesBySeason[ep.season]) {
      episodesBySeason[ep.season] = [];
    }
    episodesBySeason[ep.season].push(ep);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add Series</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={series.name}
            onChange={(e) => setSeries({ ...series, name: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            placeholder="OTT (e.g., Netflix)"
            value={series.ott}
            onChange={(e) => setSeries({ ...series, ott: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Language (optional)"
            value={series.language}
            onChange={(e) => setSeries({ ...series, language: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={series.imageUrl}
            onChange={(e) => setSeries({ ...series, imageUrl: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            placeholder="TMDB Link (optional)"
            value={series.tmdbLink}
            onChange={(e) => setSeries({ ...series, tmdbLink: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          />
          <h3 className="text-xl font-semibold mb-2">Series Data</h3>
          {Object.keys(episodesBySeason)
            .map(Number)
            .sort()
            .map((season) => (
              <div key={season} className="mb-6">
                <h4 className="text-lg font-medium mb-2">Season {season}</h4>
                {episodesBySeason[season].map((ep) => (
                  <div key={`${season}-${ep.episode}`} className="mb-4 pl-4 border-l-2 border-gray-200">
                    <input
                      type="number"
                      placeholder="Episode"
                      value={ep.episode}
                      onChange={(e) =>
                        updateEpisode(
                          episodes.findIndex(
                            (e) => e.season === ep.season && e.episode === ep.episode
                          ),
                          "episode",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full p-2 mb-2 border rounded"
                      min="1"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Stream URL"
                      value={ep.streamUrl}
                      onChange={(e) =>
                        updateEpisode(
                          episodes.findIndex(
                            (e) => e.season === ep.season && e.episode === ep.episode
                          ),
                          "streamUrl",
                          e.target.value
                        )
                      }
                      className="w-full p-2 mb-2 border rounded"
                      required
                    />
                  </div>
                ))}
              </div>
            ))}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={addEpisode}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Add Episode
            </button>
            <button
              type="button"
              onClick={addSeason}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add Season
            </button>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Series
          </button>
        </form>
      </div>
    </div>
  );
}
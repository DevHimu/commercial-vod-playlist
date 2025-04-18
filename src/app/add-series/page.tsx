"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddSeries() {
  const [seriesForm, setSeriesForm] = useState({ name: "", language: "", imageUrl: "", tmdbLink: "" });
  const [episodes, setEpisodes] = useState([{ season: 1, episode: 1, streamUrl: "" }]);
  const router = useRouter();

  const addEpisode = () => {
    const lastEpisode = episodes[episodes.length - 1];
    setEpisodes([...episodes, { season: lastEpisode.season, episode: lastEpisode.episode + 1, streamUrl: "" }]);
  };

  const addSeason = () => {
    const lastEpisode = episodes[episodes.length - 1];
    setEpisodes([...episodes, { season: lastEpisode.season + 1, episode: 1, streamUrl: "" }]);
  };

  const handleEpisodeChange = (index: number, field: string, value: string | number) => {
    const newEpisodes = [...episodes];
    newEpisodes[index] = { ...newEpisodes[index], [field]: value };
    setEpisodes(newEpisodes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/series", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...seriesForm, episodes }),
    });
    if (res.ok) {
      router.push("/index");
    } else {
      alert("Failed to add series");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add Series</h2>
        <input
          type="text"
          placeholder="Name"
          value={seriesForm.name}
          onChange={(e) => setSeriesForm({ ...seriesForm, name: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Language"
          value={seriesForm.language}
          onChange={(e) => setSeriesForm({ ...seriesForm, language: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={seriesForm.imageUrl}
          onChange={(e) => setSeriesForm({ ...seriesForm, imageUrl: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          placeholder="TMDB Link (optional)"
          value={seriesForm.tmdbLink}
          onChange={(e) => setSeriesForm({ ...seriesForm, tmdbLink: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        />
        <h3 className="text-xl font-semibold mb-2">Episodes</h3>
        {episodes.map((ep, index) => (
          <div key={index} className="mb-4">
            <input
              type="number"
              placeholder="Season"
              value={ep.season}
              onChange={(e) => handleEpisodeChange(index, "season", parseInt(e.target.value))}
              className="w-full p-2 mb-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Episode"
              value={ep.episode}
              onChange={(e) => handleEpisodeChange(index, "episode", parseInt(e.target.value))}
              className="w-full p-2 mb-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Stream URL"
              value={ep.streamUrl}
              onChange={(e) => handleEpisodeChange(index, "streamUrl", e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              required
            />
          </div>
        ))}
        <button type="button" onClick={addEpisode} className="w-full p-2 mb-2 bg-green-600 text-white rounded hover:bg-green-700">
          Add Episode
        </button>
        <button type="button" onClick={addSeason} className="w-full p-2 mb-4 bg-purple-600 text-white rounded hover:bg-purple-700">
          Add Season
        </button>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add Series
        </button>
      </form>
    </div>
  );
}
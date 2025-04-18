"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

type Episode = {
  id: number;
  season: number;
  episode: number;
  streamUrl: string;
};

export default function EditSeries() {
  const [seriesForm, setSeriesForm] = useState({ name: "", language: "", imageUrl: "", tmdbLink: "" });
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    fetch(`/api/series/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSeriesForm({ name: data.name, language: data.language, imageUrl: data.imageUrl, tmdbLink: data.tmdbLink });
        setEpisodes(data.episodes);
      });
  }, [id]);

  const addEpisode = () => {
    const lastEpisode = episodes[episodes.length - 1] || { season: 1, episode: 0 };
    setEpisodes([...episodes, { id: 0, season: lastEpisode.season, episode: lastEpisode.episode + 1, streamUrl: "" }]);
  };

  const addSeason = () => {
    const lastEpisode = episodes[episodes.length - 1] || { season: 0, episode: 1 };
    setEpisodes([...episodes, { id: 0, season: lastEpisode.season + 1, episode: 1, streamUrl: "" }]);
  };

  const handleEpisodeChange = (index: number, field: string, value: string | number) => {
    const newEpisodes = [...episodes];
    newEpisodes[index] = { ...newEpisodes[index], [field]: value };
    setEpisodes(newEpisodes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/series/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(seriesForm),
    });
    if (res.ok) {
      router.push("/index");
    } else {
      alert("Failed to update series");
    }
  };

  const handleEpisodeSubmit = async (episode: Episode, index: number) => {
    if (episode.id === 0) {
      // Create new episode
      const res = await fetch(`/api/series/${id}/episodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ season: episode.season, episode: episode.episode, streamUrl: episode.streamUrl }),
      });
      if (res.ok) {
        const newEpisode = await res.json();
        const newEpisodes = [...episodes];
        newEpisodes[index] = newEpisode;
        setEpisodes(newEpisodes);
      } else {
        alert("Failed to create episode");
      }
    } else {
      // Update existing episode
      const res = await fetch(`/api/episodes/${episode.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ season: episode.season, episode: episode.episode, streamUrl: episode.streamUrl }),
      });
      if (!res.ok) {
        alert("Failed to update episode");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Series</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Update Series
          </button>
        </form>
        <h3 className="text-xl font-semibold mb-2 mt-6">Episodes</h3>
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
            <button
              onClick={() => handleEpisodeSubmit(ep, index)}
              className="w-full p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              {ep.id === 0 ? "Create Episode" : "Update Episode"}
            </button>
          </div>
        ))}
        <button onClick={addEpisode} className="w-full p-2 mb-2 bg-green-600 text-white rounded hover:bg-green-700">
          Add Episode
        </button>
        <button onClick={addSeason} className="w-full p-2 mb-4 bg-purple-600 text-white rounded hover:bg-purple-700">
          Add Season
        </button>
      </div>
    </div>
  );
}
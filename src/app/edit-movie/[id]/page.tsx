"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditMovie() {
  const [form, setForm] = useState({
    name: "",
    year: "",
    language: "",
    imageUrl: "",
    tmdbLink: "",
    streamUrl: "",
  });
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name,
          year: data.year.toString(),
          language: data.language,
          imageUrl: data.imageUrl,
          tmdbLink: data.tmdbLink || "",
          streamUrl: data.streamUrl,
        });
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/movies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        year: parseInt(form.year),
      }),
    });
    if (res.ok) {
      router.push("/content-index");
    } else {
      alert("Failed to update movie");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Movie</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Language"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            placeholder="TMDB Link (optional)"
            value={form.tmdbLink}
            onChange={(e) => setForm({ ...form, tmdbLink: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="text"
            placeholder="Stream URL"
            value={form.streamUrl}
            onChange={(e) => setForm({ ...form, streamUrl: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Movie
          </button>
        </form>
      </div>
    </div>
  );
}
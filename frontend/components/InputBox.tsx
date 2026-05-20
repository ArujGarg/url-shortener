"use client";

import { handleShortenUrl } from "@/helpers/inputbox.helpers";
import { useState } from "react";

export const InputBox = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="mt-10 w-full max-w-3xl">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:flex-row">
        <input
          type="text"
          placeholder="Paste your long URL here..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-base outline-none transition focus:border-purple-500"
        />

        <button
          onClick={async () => {
            try {
              setLoading(true);

              const data = await handleShortenUrl(inputUrl);

              const generatedShortUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${data.data.shortCode}`;

              setShortUrl(generatedShortUrl);
            } catch (error) {
              console.error(error);
              alert("Something went wrong");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 font-semibold transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </div>

      {shortUrl && (
        <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-left backdrop-blur-xl">
          <p className="mb-2 text-sm text-emerald-300">Your shortened URL</p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={shortUrl}
              target="_blank"
              className="break-all text-lg font-semibold text-white hover:underline"
            >
              {shortUrl}
            </a>

            <button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

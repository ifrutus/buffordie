"use client";

import { useState } from "react";

// TODO: persistir via Server Action + Prisma (tabela Like) quando o login estiver pronto.
export function LikeButton({ initial }: { initial: number }) {
  const [liked, setLiked] = useState(false);
  const count = initial + (liked ? 1 : 0);

  return (
    <button
      type="button"
      onClick={() => setLiked((v) => !v)}
      aria-pressed={liked}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
        liked
          ? "border-blood bg-blood text-white"
          : "border-line bg-panel text-zinc-300 hover:border-blood hover:text-white"
      }`}
    >
      <span aria-hidden>{liked ? "♥" : "♡"}</span>
      {count} {count === 1 ? "curtida" : "curtidas"}
    </button>
  );
}

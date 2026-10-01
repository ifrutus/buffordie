"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { tables, type Target } from "@/lib/target";
import { useUser } from "./user-menu";

export function LikeButton({ target, initial }: { target: Target; initial: number }) {
  const t = tables(target);
  const targetId = target.id;
  const user = useUser();
  const pathname = usePathname();
  const [likedState, setLikedState] = useState<{ userId: string; liked: boolean } | null>(null);
  const liked = !!user && likedState?.userId === user.id && likedState.liked;
  const setLiked = (v: boolean) => user && setLikedState({ userId: user.id, liked: v });
  const [count, setCount] = useState(initial);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sb = supabaseBrowser();
    sb.from(t.likes).select("*", { count: "exact", head: true }).eq(t.key, targetId)
      .then(({ count: c }) => c != null && setCount(c));
    if (!user) return;
    const userId = user.id;
    sb.from(t.likes).select("user_id").eq(t.key, targetId).eq("user_id", userId).maybeSingle()
      .then(({ data }) => setLikedState({ userId, liked: !!data }));
  }, [targetId, user, t.likes, t.key]);

  if (user === null)
    return (
      <Link
        href={`/entrar?next=${encodeURIComponent(pathname)}`}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-blood hover:text-white"
      >
        ♡ {count} · entre para curtir
      </Link>
    );

  async function toggle() {
    if (!user || busy) return;
    setBusy(true);
    const sb = supabaseBrowser();
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    const { error } = next
      ? await sb.from(t.likes).insert({ [t.key]: targetId, user_id: user.id })
      : await sb.from(t.likes).delete().eq(t.key, targetId).eq("user_id", user.id);
    if (error) {
      setLiked(!next);
      setCount((c) => c + (next ? -1 : 1));
    }
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy || user === undefined}
      aria-pressed={liked}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 disabled:opacity-60 ${
        liked ? "border-blood bg-blood text-white" : "border-line bg-panel text-zinc-300 hover:border-blood hover:text-white"
      }`}
    >
      <span aria-hidden>{liked ? "♥" : "♡"}</span>
      {count} {count === 1 ? "curtida" : "curtidas"}
    </button>
  );
}

"use client";

/* eslint-disable @next/next/no-img-element -- avatares externos */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useUser } from "./user-menu";

type Comment = {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  author: { username: string; display_name: string | null; avatar_url: string | null } | null;
};

function ago(iso: string) {
  const s = (Date.now() - +new Date(iso)) / 1000;
  if (s < 60) return "agora";
  if (s < 3600) return `há ${Math.floor(s / 60)} min`;
  if (s < 86400) return `há ${Math.floor(s / 3600)} h`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

async function fetchComments(postId: string) {
  const { data, error } = await supabaseBrowser()
    .from("comments")
    .select("id, body, created_at, author_id, author:profiles(username, display_name, avatar_url)")
    .eq("post_id", postId)
    .eq("hidden", false)
    .order("created_at", { ascending: false })
    .limit(100);
  return { data: ((data as unknown as Comment[]) ?? []) as Comment[], error };
}

export function Comments({ postId }: { postId: string }) {
  const user = useUser();
  const pathname = usePathname();
  const [items, setItems] = useState<Comment[] | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    () =>
      fetchComments(postId).then(({ data, error }) => {
        if (error) setError("Não foi possível carregar os comentários.");
        setItems(data);
      }),
    [postId],
  );

  useEffect(() => {
    let alive = true;
    fetchComments(postId).then(({ data, error }) => {
      if (!alive) return;
      if (error) setError("Não foi possível carregar os comentários.");
      setItems(data);
    });
    return () => {
      alive = false;
    };
  }, [postId]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body || !user) return;
    setSending(true);
    setError(null);
    const { error } = await supabaseBrowser().from("comments").insert({ post_id: postId, author_id: user.id, body });
    setSending(false);
    if (error) return setError("Não foi possível enviar. Tente de novo.");
    setText("");
    load();
  }

  async function remove(id: string) {
    const { error } = await supabaseBrowser().from("comments").delete().eq("id", id);
    if (!error) setItems((prev) => prev?.filter((c) => c.id !== id) ?? null);
  }

  return (
    <section className="mt-12" aria-labelledby="comentarios">
      <h2 id="comentarios" className="font-display text-2xl font-bold text-white">
        Comentários {items && <span className="text-zinc-500">({items.length})</span>}
      </h2>

      {user ? (
        <form onSubmit={submit} className="mt-4 rounded-xl border border-line bg-panel p-4">
          <label htmlFor="novo-comentario" className="sr-only">Escreva um comentário</label>
          <textarea
            id="novo-comentario"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Manda a real: o que você achou?"
            className="w-full resize-y rounded-md border border-line bg-ink p-3 text-sm text-white placeholder:text-zinc-600 focus:border-acid focus:outline-none"
          />
          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-xs text-zinc-500">Respeito acima de tudo. Comentários tóxicos são removidos.</p>
            <button
              type="submit"
              disabled={!text.trim() || sending}
              className="shrink-0 rounded-md bg-acid px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110 disabled:opacity-40"
            >
              {sending ? "Enviando…" : "Comentar"}
            </button>
          </div>
        </form>
      ) : user === null ? (
        <p className="mt-4 rounded-xl border border-line bg-panel p-4 text-sm text-zinc-400">
          <Link href={`/entrar?next=${encodeURIComponent(pathname)}`} className="font-semibold text-acid hover:underline">
            Entre na sua conta
          </Link>{" "}
          para comentar.
        </p>
      ) : null}

      {error && <p className="mt-3 text-sm text-blood">{error}</p>}

      <ul className="mt-6 space-y-5">
        {items === null && <li className="h-16 animate-pulse rounded-lg bg-panel" aria-hidden />}
        {items?.length === 0 && <li className="text-sm text-zinc-500">Ninguém comentou ainda. Seja o primeiro!</li>}
        {items?.map((c) => {
          const name = c.author?.display_name || c.author?.username || "gamer";
          return (
            <li key={c.id} className="flex gap-3">
              {c.author?.avatar_url ? (
                <img src={c.author.avatar_url} alt="" className="size-9 shrink-0 rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-volt/30 font-display text-sm font-bold text-white">
                  {name[0]?.toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="text-sm">
                  <span className="font-semibold text-white">{name}</span>{" "}
                  <span className="text-zinc-500">· {ago(c.created_at)}</span>
                  {user?.id === c.author_id && (
                    <button onClick={() => remove(c.id)} className="ml-3 text-xs text-zinc-500 hover:text-blood">
                      apagar
                    </button>
                  )}
                </p>
                <p className="mt-1 whitespace-pre-line break-words text-zinc-300">{c.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { posts } from "@/lib/content";

export const metadata: Metadata = { title: "Buscar" };

export default async function SearchPage({ searchParams }: PageProps<"/busca">) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const results = query
    ? posts.filter((p) =>
        `${p.title} ${p.excerpt} ${p.platforms.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <form action="/busca" className="flex gap-2">
        <label htmlFor="q" className="sr-only">Buscar</label>
        <input
          id="q"
          name="q"
          defaultValue={query}
          placeholder="Buscar jogos, notícias, plataformas…"
          className="flex-1 rounded-md border border-line bg-panel px-4 py-3 text-white placeholder:text-zinc-600 focus:border-acid focus:outline-none"
        />
        <button className="rounded-md bg-acid px-5 font-semibold text-ink">Buscar</button>
      </form>
      {query && (
        <p className="mt-6 text-sm text-zinc-500">
          {results.length} resultado(s) para “{query}”
        </p>
      )}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
  );
}

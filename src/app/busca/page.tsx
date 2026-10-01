import type { Metadata } from "next";
import { PostCard, RadarCard } from "@/components/post-card";
import { getPosts } from "@/lib/posts";
import { getRadar } from "@/lib/radar";

export const metadata: Metadata = { title: "Buscar" };

const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export default async function SearchPage({ searchParams }: PageProps<"/busca">) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const terms = norm(query).split(/\s+/).filter(Boolean);
  const match = (text: string) => terms.every((t) => norm(text).includes(t));

  const [posts, radar] = query ? await Promise.all([getPosts({ limit: 100 }), getRadar()]) : [[], []];
  const postHits = posts.filter((p) => match(`${p.title} ${p.excerpt} ${p.tags.join(" ")} ${p.platforms.join(" ")}`));
  const radarHits = radar.filter((i) => match(`${i.title} ${i.excerpt} ${i.sourceName}`)).slice(0, 30);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <form action="/busca" className="flex gap-2" role="search">
        <label htmlFor="q" className="sr-only">Buscar</label>
        <input
          id="q"
          name="q"
          defaultValue={query}
          placeholder="Buscar jogos, times, plataformas…"
          className="min-w-0 flex-1 rounded-md border border-line bg-panel px-4 py-3 text-white placeholder:text-zinc-600 focus:border-acid focus:outline-none"
        />
        <button className="rounded-md bg-acid px-5 font-semibold text-ink">Buscar</button>
      </form>

      {query && (
        <p className="mt-6 text-sm text-zinc-500">
          {postHits.length + radarHits.length} resultado(s) para “{query}”
        </p>
      )}
      {postHits.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {postHits.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      )}
      {radarHits.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {radarHits.map((i) => <RadarCard key={i.id} item={i} />)}
        </div>
      )}
    </div>
  );
}

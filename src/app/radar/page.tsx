import type { Metadata } from "next";
import Link from "next/link";
import { RadarCard } from "@/components/post-card";
import { getRadar } from "@/lib/radar";
import { sources } from "@/lib/radar/sources";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Radar",
  description: "As últimas notícias de games dos principais sites do Brasil, num lugar só.",
};

export default async function RadarPage({ searchParams }: PageProps<"/radar">) {
  const { fonte } = await searchParams;
  const sourceId = Array.isArray(fonte) ? fonte[0] : fonte;
  const all = await getRadar();
  const items = (sourceId ? all.filter((i) => i.sourceId === sourceId) : all).slice(0, 60);
  const active = new Set(all.map((i) => i.sourceId));

  return (
    <div className="mx-auto max-w-7xl px-4">
      <header className="mt-10 border-b border-line pb-6">
        <p className="font-display text-sm uppercase tracking-widest text-acid">📡 Radar</p>
        <h1 className="mt-1 font-display text-4xl font-bold text-white">Tudo de games, num lugar só</h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          As últimas dos principais sites de games do Brasil, atualizadas a cada 15 minutos. Clique para ler a
          matéria completa na fonte original.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Filtrar por fonte">
          <Link
            href="/radar"
            className={`rounded-full border px-3 py-1 text-xs ${!sourceId ? "border-acid bg-acid text-ink" : "border-line text-zinc-300 hover:border-zinc-500"}`}
          >
            Todas
          </Link>
          {sources.filter((s) => active.has(s.id)).map((s) => (
            <Link
              key={s.id}
              href={`/radar?fonte=${s.id}`}
              className={`rounded-full border px-3 py-1 text-xs ${sourceId === s.id ? "border-acid bg-acid text-ink" : "border-line text-zinc-300 hover:border-zinc-500"}`}
            >
              {s.name}
            </Link>
          ))}
        </nav>
      </header>
      {items.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => <RadarCard key={i.id} item={i} />)}
        </div>
      ) : (
        <p className="mt-8 text-zinc-400">As fontes estão sendo atualizadas. Volte em instantes.</p>
      )}
    </div>
  );
}

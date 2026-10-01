import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Comments } from "@/components/comments";
import { LikeButton } from "@/components/like-button";
import { Cover, PostCard, RadarCard, RadarRow, SectionBadge } from "@/components/post-card";
import { getPosts } from "@/lib/posts";
import { getRadar, getRadarItem, timeAgo } from "@/lib/radar";
import { relatedCoverage } from "@/lib/radar/trending";
import { getSection } from "@/lib/sections";

export const revalidate = 900;

// Páginas geradas sob demanda e guardadas em cache (ISR).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/radar/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = await getRadarItem(id);
  if (!item) return { title: "Notícia fora do Radar" };
  return {
    title: item.title,
    description: item.excerpt || `${item.title} — via ${item.sourceName}`,
    // A matéria é da fonte: apontamos o original para o Google e não indexamos a cópia resumida.
    alternates: { canonical: item.url },
    robots: { index: false, follow: true },
  };
}

export default async function RadarItemPage({ params }: PageProps<"/radar/[id]">) {
  const { id } = await params;
  const item = await getRadarItem(id);
  if (!item) notFound();

  const section = getSection(item.section);
  const [all, posts] = await Promise.all([getRadar(), getPosts({ section: item.section, limit: 2 })]);
  const coverage = relatedCoverage(item, all, 4);
  const more = all.filter((i) => i.section === item.section && i.id !== item.id && !coverage.includes(i)).slice(0, 6);

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1fr_300px]">
      <article className="min-w-0">
        <nav className="mt-8 text-sm text-zinc-500" aria-label="Trilha">
          <Link href="/radar" className="hover:text-acid">Radar</Link> /{" "}
          <Link href={`/secao/${item.section}`} className="hover:text-acid">{section?.name}</Link>
        </nav>

        <header className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <SectionBadge slug={item.section} />
            <span className="text-sm font-medium text-zinc-400">via {item.sourceName}</span>
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">{item.title}</h1>
          <p className="text-sm text-zinc-500">
            Publicado no {item.sourceName} <time dateTime={item.publishedAt}>{timeAgo(item.publishedAt)}</time>
          </p>
        </header>

        <Cover image={item.image} section={item.section} label={item.sourceName} className={`mt-6 rounded-2xl border border-line ${item.image ? "aspect-video" : "aspect-[21/6]"}`} />

        <div className="mt-6 rounded-2xl border border-line bg-panel p-6">
          {item.excerpt && (
            <p className="text-lg leading-relaxed text-zinc-300">
              <span className="mr-2 font-display text-xs font-bold uppercase tracking-widest text-acid">Resumo</span>
              {item.excerpt}
            </p>
          )}
          <a
            href={item.url}
            target="_blank"
            rel="noopener"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-acid px-5 py-3 font-semibold text-ink transition hover:brightness-110"
          >
            Ler a matéria completa no {item.sourceName} ↗
          </a>
          <p className="mt-3 text-xs text-zinc-500">
            Conteúdo de {item.sourceName}. O BuffOrDie reúne as notícias e abre o debate aqui embaixo.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-y border-line py-6">
          <LikeButton target={{ kind: "radar", id: item.id }} initial={0} />
          <span className="text-sm text-zinc-500">O que você achou? Comenta aí.</span>
        </div>

        <Comments target={{ kind: "radar", id: item.id }} />

        {coverage.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-display text-2xl font-bold text-white">Outras fontes falando disso</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {coverage.map((i) => <RadarCard key={i.id} item={i} />)}
            </div>
          </section>
        )}

        {posts.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-display text-2xl font-bold text-white">Do BuffOrDie</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </section>
        )}
      </article>

      {more.length > 0 && (
        <aside className="lg:pt-24">
          <div className="sticky top-24 rounded-2xl border border-line bg-panel p-5">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-acid">Mais em {section?.name}</h2>
            <ol className="mt-4 space-y-4">
              {more.map((i) => <RadarRow key={i.id} item={i} />)}
            </ol>
          </div>
        </aside>
      )}
    </div>
  );
}

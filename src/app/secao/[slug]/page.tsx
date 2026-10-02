import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard, RadarCard } from "@/components/post-card";
import { getPosts } from "@/lib/posts";
import { getRadarBySection } from "@/lib/radar";
import { getSection, sections } from "@/lib/sections";

export const revalidate = 900;

export function generateStaticParams() {
  return sections.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/secao/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getSection(slug);
  return s ? { title: s.name, description: s.tagline } : {};
}

export default async function SectionPage({ params }: PageProps<"/secao/[slug]">) {
  const { slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();

  const [posts, radar] = await Promise.all([getPosts({ section: section.slug, limit: 6 }), getRadarBySection(section.slug, 30)]);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <header className="mt-10 border-b border-line pb-6">
        <p className="font-display text-sm uppercase tracking-widest text-acid">Seção</p>
        <h1 className="mt-1 font-display text-4xl font-bold text-white">{section.name}</h1>
        <p className="mt-2 text-zinc-400">{section.tagline}</p>
      </header>

      {posts.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 font-display text-xl font-bold text-white">Do Buff or Die</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-bold text-white">📡 Pelo Radar</h2>
        {radar.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {radar.map((i) => <RadarCard key={i.id} item={i} />)}
          </div>
        ) : (
          <p className="text-zinc-400">Nada novo por aqui agora — as fontes são atualizadas a cada 15 minutos.</p>
        )}
      </section>
    </div>
  );
}

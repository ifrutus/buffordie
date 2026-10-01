import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Comments } from "@/components/comments";
import { LikeButton } from "@/components/like-button";
import { Cover, PostCard, RadarRow, SectionBadge } from "@/components/post-card";
import { formatDate, getPost, getPosts } from "@/lib/posts";
import { getRadarBySection } from "@/lib/radar";
import { getSection } from "@/lib/sections";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getPosts({ limit: 50 })).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/noticias/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", images: post.coverUrl ? [post.coverUrl] : undefined },
  };
}

export default async function PostPage({ params }: PageProps<"/noticias/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const section = getSection(post.section);
  const [related, radar] = await Promise.all([
    getPosts({ section: post.section, limit: 4 }),
    getRadarBySection(post.section, 5),
  ]);

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1fr_300px]">
      <article className="min-w-0">
        <nav className="mt-8 text-sm text-zinc-500" aria-label="Trilha">
          <Link href="/" className="hover:text-acid">Início</Link> /{" "}
          <Link href={`/secao/${post.section}`} className="hover:text-acid">{section?.name}</Link>
        </nav>

        <header className="mt-4 space-y-4">
          <SectionBadge slug={post.section} />
          <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl">{post.title}</h1>
          <p className="text-lg text-zinc-400">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
            <span className="font-medium text-zinc-300">{post.authorName}</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span>{post.readingMinutes} min de leitura</span>
            {post.platforms.map((pl) => (
              <span key={pl} className="rounded border border-line px-2 py-0.5 text-xs text-zinc-400">{pl}</span>
            ))}
          </div>
        </header>

        <Cover image={post.coverUrl} section={post.section} score={post.score} className="mt-8 aspect-video rounded-2xl border border-line" />

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-zinc-300">
          {post.content.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
        </div>

        {post.score != null && (
          <aside className="mt-10 flex items-center gap-6 rounded-2xl border border-line bg-panel p-6">
            <span className="grid size-20 shrink-0 place-items-center rounded-full border-4 border-acid font-display text-3xl font-bold text-white">
              {post.score.toFixed(1)}
            </span>
            <div>
              <p className="font-display text-sm uppercase tracking-widest text-acid">Veredito BuffOrDie</p>
              <p className="mt-1 text-zinc-300">
                {post.score >= 9 ? "BUFF — obrigatório." : post.score >= 7 ? "Vale muito a pena." : post.score >= 5 ? "Só para fãs do gênero." : "DIE — passe longe."}
              </p>
            </div>
          </aside>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3 border-y border-line py-6">
          <LikeButton postId={post.id} initial={post.likes} />
          <span className="text-sm text-zinc-500">Curtiu? Compartilhe com o squad.</span>
        </div>

        <Comments postId={post.id} />

        {related.filter((p) => p.id !== post.id).length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-bold text-white">Leia também</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {related.filter((p) => p.id !== post.id).slice(0, 2).map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </section>
        )}
      </article>

      {radar.length > 0 && (
        <aside className="lg:pt-24">
          <div className="sticky top-24 rounded-2xl border border-line bg-panel p-5">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-acid">📡 {section?.name} no Radar</h2>
            <ol className="mt-4 space-y-4">
              {radar.map((i) => <RadarRow key={i.id} item={i} />)}
            </ol>
          </div>
        </aside>
      )}
    </div>
  );
}

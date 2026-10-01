import Link from "next/link";
import { Cover, PostCard, RadarCard, RadarRow, SectionBadge } from "@/components/post-card";
import { getPosts, formatDate } from "@/lib/posts";
import { getRadar } from "@/lib/radar";
import { sections } from "@/lib/sections";

export const revalidate = 900; // 15 min, igual ao cache do Radar

export default async function Home() {
  const [posts, radar] = await Promise.all([getPosts({ limit: 6 }), getRadar()]);
  const [featured, ...morePosts] = posts;
  const latest = radar.slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Destaque + últimas do Radar */}
      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        {featured ? (
          <Link
            href={`/noticias/${featured.slug}`}
            className="group relative min-h-[360px] overflow-hidden rounded-2xl border border-line lg:col-span-2"
          >
            <div className="absolute inset-0">
              <Cover image={featured.coverUrl} section={featured.section} className="size-full" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <SectionBadge slug={featured.section} />
                <span className="font-display text-[11px] font-bold uppercase tracking-wider text-acid">Destaque</span>
              </div>
              <h1 className="max-w-2xl font-display text-2xl font-bold leading-tight text-white group-hover:text-acid sm:text-4xl">
                {featured.title}
              </h1>
              <p className="hidden max-w-xl text-zinc-300 sm:block">{featured.excerpt}</p>
              <p className="text-xs text-zinc-400">
                {formatDate(featured.publishedAt)} · ♥ {featured.likes} · 💬 {featured.comments}
              </p>
            </div>
          </Link>
        ) : (
          <div className="grid min-h-[360px] place-items-center rounded-2xl border border-line bg-panel p-8 text-center lg:col-span-2">
            <div>
              <h1 className="font-display text-4xl font-bold text-white">O hub de games do Brasil</h1>
              <p className="mt-3 text-zinc-400">Notícias, atualizações, competitivo e reviews — num lugar só.</p>
            </div>
          </div>
        )}

        <aside className="rounded-2xl border border-line bg-panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-acid">📡 Radar ao vivo</h2>
            <Link href="/radar" className="text-xs text-zinc-400 hover:text-acid">ver tudo →</Link>
          </div>
          {latest.length ? (
            <ol className="mt-4 space-y-4">
              {latest.slice(0, 6).map((item) => <RadarRow key={item.id} item={item} />)}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">Atualizando as fontes… volte em instantes.</p>
          )}
        </aside>
      </section>

      {/* Matérias próprias */}
      {morePosts.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 font-display text-2xl font-bold text-white">Do BuffOrDie</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {morePosts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      )}

      {/* Uma faixa por seção */}
      {sections.map((s) => {
        const items = radar.filter((i) => i.section === s.slug).slice(0, 4);
        if (!items.length) return null;
        return (
          <section key={s.slug} className="mt-14">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">{s.name}</h2>
                <p className="text-sm text-zinc-500">{s.tagline}</p>
              </div>
              <Link href={`/secao/${s.slug}`} className="shrink-0 text-sm text-acid hover:underline">Ver mais →</Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((i) => <RadarCard key={i.id} item={i} />)}
            </div>
          </section>
        );
      })}

      <section className="mt-16 overflow-hidden rounded-2xl border border-line bg-gradient-to-r from-volt/30 via-panel to-acid/20 p-8 sm:p-12">
        <h2 className="font-display text-3xl font-bold text-white">Entre pro squad.</h2>
        <p className="mt-2 max-w-xl text-zinc-300">Crie sua conta para curtir e comentar as matérias do BuffOrDie.</p>
        <Link href="/entrar" className="mt-6 inline-block rounded-md bg-acid px-6 py-3 font-semibold text-ink hover:brightness-110">
          Criar conta grátis
        </Link>
      </section>
    </div>
  );
}


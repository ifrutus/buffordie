import Link from "next/link";
import { CategoryBadge, Cover, PostCard, Stats } from "@/components/post-card";
import { getLatestPosts, getTrendingPosts } from "@/lib/content";

export default function Home() {
  const [featured, ...rest] = getLatestPosts();
  const trending = getTrendingPosts(5);

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Destaque */}
      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <Link
          href={`/noticias/${featured.slug}`}
          className="group relative overflow-hidden rounded-2xl border border-line lg:col-span-2"
        >
          <Cover post={featured} className="aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[420px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 sm:p-8">
            <CategoryBadge slug={featured.category} />
            <h1 className="max-w-2xl font-display text-2xl font-bold leading-tight text-white sm:text-4xl group-hover:text-acid">
              {featured.title}
            </h1>
            <p className="hidden max-w-xl text-zinc-300 sm:block">{featured.excerpt}</p>
            <Stats post={featured} />
          </div>
        </Link>

        <aside className="rounded-2xl border border-line bg-panel p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-acid">
            🔥 Em alta
          </h2>
          <ol className="mt-4 space-y-4">
            {trending.map((p, i) => (
              <li key={p.slug} className="flex gap-4">
                <span className="font-display text-3xl font-bold text-zinc-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link href={`/noticias/${p.slug}`} className="group space-y-1">
                  <p className="font-medium leading-snug text-white group-hover:text-acid">
                    {p.title}
                  </p>
                  <p className="text-xs text-zinc-500">♥ {p.likes} curtidas</p>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      {/* Últimas */}
      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-white">Últimas</h2>
          <Link href="/categoria/noticias" className="text-sm text-acid hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>

      {/* Newsletter / comunidade */}
      <section className="mt-16 overflow-hidden rounded-2xl border border-line bg-gradient-to-r from-volt/30 via-panel to-acid/20 p-8 sm:p-12">
        <h2 className="font-display text-3xl font-bold text-white">
          Entre pro squad.
        </h2>
        <p className="mt-2 max-w-xl text-zinc-300">
          Crie sua conta para curtir, comentar e receber os jogos grátis da semana direto
          no e-mail.
        </p>
        <Link
          href="/entrar"
          className="mt-6 inline-block rounded-md bg-acid px-6 py-3 font-semibold text-ink hover:brightness-110"
        >
          Criar conta grátis
        </Link>
      </section>
    </div>
  );
}

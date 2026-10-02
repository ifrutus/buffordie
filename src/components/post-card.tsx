/* eslint-disable @next/next/no-img-element -- imagens externas das fontes, servidas direto delas */
import Link from "next/link";
import { getSection, type SectionSlug } from "@/lib/sections";
import { timeAgo, type RadarItem } from "@/lib/radar";
import { formatDate, type Post } from "@/lib/posts";

const GRADIENTS: Record<SectionSlug, [string, string]> = {
  noticias: ["#65a30d", "#0a0b0f"],
  games: ["#0284c7", "#0a0b0f"],
  atualizacoes: ["#d97706", "#0a0b0f"],
  competitivo: ["#6d28d9", "#0a0b0f"],
  reviews: ["#dc2626", "#0a0b0f"],
};

export function SectionBadge({ slug }: { slug: SectionSlug }) {
  const s = getSection(slug);
  if (!s) return null;
  return (
    <span className={`inline-block rounded px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider ${s.badge}`}>
      {s.name}
    </span>
  );
}

export function Cover({
  image,
  section,
  score,
  label,
  className = "",
}: {
  image?: string | null;
  section: SectionSlug;
  score?: number | null;
  /** Texto da capa quando não há foto (ex.: nome da fonte). */
  label?: string;
  className?: string;
}) {
  const [from, to] = GRADIENTS[section];
  const initials = (label ?? getSection(section)?.name ?? "BD")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className={`relative overflow-hidden bg-panel ${className}`}
      style={image ? undefined : { backgroundImage: `radial-gradient(120% 90% at 0% 0%, ${from} 0%, ${to} 70%)` }}
    >
      {image ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(rgb(255 255 255 / .08) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .08) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <span className="absolute -bottom-6 -right-2 select-none font-display text-[7rem] font-bold leading-none text-white/10">
            {initials}
          </span>
          {label && (
            <span className="absolute left-4 top-4 font-display text-xs font-bold uppercase tracking-[.2em] text-white/70">
              {label}
            </span>
          )}
        </>
      )}
      <div className="scanlines pointer-events-none absolute inset-0" />
      {score != null && (
        <span className="absolute right-3 top-3 grid size-12 place-items-center rounded-full border-2 border-white/80 bg-ink/70 font-display text-lg font-bold text-white">
          {score.toFixed(1)}
        </span>
      )}
    </div>
  );
}

/** Matéria própria do Buff or Die. */
export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-line bg-panel transition hover:-translate-y-0.5 hover:border-zinc-600">
      <Link href={`/noticias/${post.slug}`} className="block">
        <Cover image={post.coverUrl} section={post.section} score={post.score} className="aspect-video" />
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <SectionBadge slug={post.section} />
            <span className="font-display text-[11px] font-bold uppercase tracking-wider text-acid">Buff or Die</span>
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug text-white group-hover:text-acid">{post.title}</h3>
          <p className="line-clamp-2 text-sm text-zinc-400">{post.excerpt}</p>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>{formatDate(post.publishedAt)}</span>
            <span>♥ {post.likes}</span>
            <span>💬 {post.comments}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/** Notícia de outra fonte: abre a página do Buff or Die (resumo, comunidade e link para a matéria original). */
export function RadarCard({ item, compact = false }: { item: RadarItem; compact?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-line bg-panel transition hover:-translate-y-0.5 hover:border-zinc-600">
      <Link href={`/radar/${item.id}`} className="flex h-full flex-col">
        {!compact && <Cover image={item.image} section={item.section} label={item.sourceName} className="aspect-video" />}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <SectionBadge slug={item.section} />
            <span className="text-xs font-medium text-zinc-400">{item.sourceName}</span>
          </div>
          <h3 className="font-display text-base font-semibold leading-snug text-white group-hover:text-acid">{item.title}</h3>
          {!compact && item.excerpt && <p className="line-clamp-2 text-sm text-zinc-400">{item.excerpt}</p>}
          <p className="mt-auto pt-1 text-xs text-zinc-500">
            <time dateTime={item.publishedAt}>{timeAgo(item.publishedAt)}</time> · via {item.sourceName}
          </p>
        </div>
      </Link>
    </article>
  );
}

export function RadarRow({ item }: { item: RadarItem }) {
  return (
    <li>
      <Link href={`/radar/${item.id}`} className="group block space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          {item.sourceName} · {timeAgo(item.publishedAt)}
        </p>
        <p className="font-medium leading-snug text-white group-hover:text-acid">{item.title}</p>
      </Link>
    </li>
  );
}

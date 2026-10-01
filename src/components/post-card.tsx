import Link from "next/link";
import { formatDate, getCategory, type Post } from "@/lib/content";

export function CategoryBadge({ slug }: { slug: string }) {
  const cat = getCategory(slug);
  if (!cat) return null;
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider ${cat.color}`}
    >
      {cat.name}
    </span>
  );
}

export function Cover({
  post,
  className = "",
}: {
  post: Post;
  className?: string;
}) {
  const [from, to] = post.cover;
  return (
    <div
      className={`scanlines relative overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden
    >
      {post.score !== undefined && (
        <span className="absolute right-3 top-3 grid size-12 place-items-center rounded-full border-2 border-white/80 bg-ink/70 font-display text-lg font-bold text-white">
          {post.score.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export function Stats({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-4 text-xs text-zinc-500">
      <span>{formatDate(post.publishedAt)}</span>
      <span aria-label={`${post.likes} curtidas`}>♥ {post.likes}</span>
      <span aria-label={`${post.comments} comentários`}>💬 {post.comments}</span>
    </div>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-line bg-panel transition hover:-translate-y-0.5 hover:border-zinc-600">
      <Link href={`/noticias/${post.slug}`} className="block">
        <Cover post={post} className="aspect-video" />
        <div className="space-y-3 p-4">
          <CategoryBadge slug={post.category} />
          <h3 className="font-display text-lg font-semibold leading-snug text-white group-hover:text-acid">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm text-zinc-400">{post.excerpt}</p>
          <Stats post={post} />
        </div>
      </Link>
    </article>
  );
}

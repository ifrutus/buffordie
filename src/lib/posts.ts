import "server-only";
import { cache } from "react";
import { supabasePublic } from "@/lib/supabase/server";
import type { SectionSlug } from "@/lib/sections";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  score: number | null;
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
  authorName: string;
  section: SectionSlug;
  platforms: string[];
  likes: number;
  comments: number;
};

const SELECT = `
  id, slug, title, excerpt, content, cover_url, score, published_at, reading_minutes, tags, author_name,
  category:categories!inner(slug),
  platforms:post_platforms(platform:platforms(name))
`;

type Row = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  score: number | string | null;
  published_at: string;
  reading_minutes: number;
  tags: string[];
  author_name: string;
  category: { slug: string } | { slug: string }[];
  platforms: { platform: { name: string } | { name: string }[] | null }[];
};

const one = <T,>(v: T | T[]) => (Array.isArray(v) ? v[0] : v);

async function withStats(rows: Row[]): Promise<Post[]> {
  if (!rows.length) return [];
  const { data: stats } = await supabasePublic()
    .from("post_stats")
    .select("post_id, likes, comments")
    .in("post_id", rows.map((r) => r.id));
  const byId = new Map((stats ?? []).map((s) => [s.post_id as string, s]));
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    coverUrl: r.cover_url,
    score: r.score == null ? null : Number(r.score),
    publishedAt: r.published_at,
    readingMinutes: r.reading_minutes,
    tags: r.tags,
    authorName: r.author_name,
    section: one(r.category).slug as SectionSlug,
    platforms: r.platforms.map((p) => one(p.platform)?.name).filter(Boolean) as string[],
    likes: Number(byId.get(r.id)?.likes ?? 0),
    comments: Number(byId.get(r.id)?.comments ?? 0),
  }));
}

/** Matérias publicadas (RLS já filtra rascunhos). Nunca lança erro: sem banco, o site segue só com o Radar. */
export const getPosts = cache(async (opts: { section?: SectionSlug; limit?: number } = {}) => {
  let q = supabasePublic()
    .from("posts")
    .select(SELECT)
    .order("published_at", { ascending: false })
    .limit(opts.limit ?? 24);
  if (opts.section) q = q.eq("category.slug", opts.section);
  const { data, error } = await q;
  if (error) {
    console.warn("[posts]", error.message);
    return [];
  }
  return withStats((data ?? []) as Row[]);
});

export const getPost = cache(async (slug: string) => {
  const { data, error } = await supabasePublic().from("posts").select(SELECT).eq("slug", slug).maybeSingle();
  if (error) console.warn("[post]", error.message);
  if (!data) return null;
  return (await withStats([data as Row]))[0];
});

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso));
}

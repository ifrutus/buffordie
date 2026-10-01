import "server-only";
import { supabasePublic } from "@/lib/supabase/server";
import type { Post } from "@/lib/posts";
import type { RadarItem } from "@/lib/radar";

export type Hot = { kind: "post" | "radar"; id: string; title: string; href: string; source: string; comments: number; likes: number };

/** Discussões mais ativas da semana, cruzadas com as matérias e o Radar atuais. */
export async function getHotDiscussions(posts: Post[], radar: RadarItem[], limit = 5): Promise<Hot[]> {
  const { data, error } = await supabasePublic()
    .from("hot_discussions")
    .select("kind, target_id, comments, likes, score")
    .order("score", { ascending: false })
    .limit(30);
  if (error || !data) return [];
  const out: Hot[] = [];
  for (const d of data) {
    if (d.kind === "post") {
      const p = posts.find((x) => x.id === d.target_id);
      if (p) out.push({ kind: "post", id: p.id, title: p.title, href: `/noticias/${p.slug}`, source: "BuffOrDie", comments: d.comments, likes: d.likes });
    } else {
      const r = radar.find((x) => x.id === d.target_id);
      if (r) out.push({ kind: "radar", id: r.id, title: r.title, href: `/radar/${r.id}`, source: r.sourceName, comments: d.comments, likes: d.likes });
    }
    if (out.length >= limit) break;
  }
  return out;
}

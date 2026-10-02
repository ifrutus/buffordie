import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { getRadar } from "@/lib/radar";
import { supabasePublic } from "@/lib/supabase/server";

export const revalidate = 60;

export async function generateStaticParams() {
  return [];
}

async function getProfile(username: string) {
  const { data } = await supabasePublic()
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, role, created_at")
    .eq("username", username.toLowerCase())
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: PageProps<"/u/[username]">): Promise<Metadata> {
  const { username } = await params;
  const p = await getProfile(username);
  if (!p) return { title: "Perfil não encontrado" };
  return { title: `${p.display_name || p.username} (@${p.username})`, description: p.bio ?? undefined };
}

const ROLE: Record<string, string> = { author: "Autor", editor: "Redação", admin: "Admin" };

export default async function PublicProfile({ params }: PageProps<"/u/[username]">) {
  const { username } = await params;
  const p = await getProfile(username);
  if (!p) notFound();

  const sb = supabasePublic();
  const [{ data: postComments }, { data: radarComments }, radar] = await Promise.all([
    sb
      .from("comments")
      .select("id, body, created_at, post:posts(slug, title)")
      .eq("author_id", p.id)
      .eq("hidden", false)
      .order("created_at", { ascending: false })
      .limit(10),
    sb.from("radar_comments").select("id, body, created_at, item_id").eq("author_id", p.id).eq("hidden", false).order("created_at", { ascending: false }).limit(10),
    getRadar(),
  ]);

  type Activity = { id: string; body: string; created_at: string; title: string; href: string };
  const one = <T,>(v: T | T[] | null) => (Array.isArray(v) ? v[0] : v);
  const activity: Activity[] = [
    ...(postComments ?? []).flatMap((c) => {
      const post = one(c.post as { slug: string; title: string } | { slug: string; title: string }[] | null);
      return post ? [{ id: c.id, body: c.body, created_at: c.created_at, title: post.title, href: `/noticias/${post.slug}` }] : [];
    }),
    ...(radarComments ?? []).flatMap((c) => {
      const item = radar.find((i) => i.id === c.item_id);
      return item ? [{ id: c.id, body: c.body, created_at: c.created_at, title: item.title, href: `/radar/${item.id}` }] : [];
    }),
  ]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 12);

  const since = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(p.created_at));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        <Avatar url={p.avatar_url} name={p.display_name || p.username} size={112} />
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h1 className="font-display text-3xl font-bold text-white">{p.display_name || p.username}</h1>
            {ROLE[p.role] && (
              <span className="rounded bg-acid px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider text-ink">{ROLE[p.role]}</span>
            )}
          </div>
          <p className="text-zinc-500">@{p.username} · no Buff or Die desde {since}</p>
          {p.bio && <p className="max-w-xl whitespace-pre-line text-zinc-300">{p.bio}</p>}
        </div>
      </header>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-xl font-bold text-white">Comentários recentes</h2>
        {activity.length ? (
          <ul className="space-y-4">
            {activity.map((a) => (
              <li key={a.id} className="rounded-xl border border-line bg-panel p-4">
                <Link href={a.href} className="text-sm font-semibold text-zinc-400 hover:text-acid">em “{a.title}”</Link>
                <p className="mt-2 whitespace-pre-line break-words text-zinc-200">{a.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500">Nenhum comentário ainda.</p>
        )}
      </section>
    </div>
  );
}

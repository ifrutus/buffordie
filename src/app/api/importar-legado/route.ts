// Importador único das matérias do site antigo. Só a redação logada pode rodar.
// Copia as imagens do servidor antigo para o Supabase Storage e publica as matérias
// com o autor = quem chamou. Pode rodar de novo sem duplicar (pula slugs existentes).
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { legacyPosts } from "@/lib/legado";
import { supabaseServer } from "@/lib/supabase/server";

export const maxDuration = 60;

const OLD = /https?:\/\/buffordie\.com\.br\/uploads\/[^\s)"]+/g;
const isOld = (u: string) => /^https?:\/\/buffordie\.com\.br\/uploads\//.test(u);

export async function POST() {
  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ erro: "entre na sua conta" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role, display_name, username").eq("id", auth.user.id).single();
  if (!profile || !["author", "editor", "admin"].includes(profile.role))
    return NextResponse.json({ erro: "apenas a redação" }, { status: 403 });

  const { data: cats } = await supabase.from("categories").select("id, slug");
  const catId = new Map((cats ?? []).map((c) => [c.slug, c.id]));

  const copied = new Map<string, string>();
  const imgErrors: string[] = [];
  async function copy(url: string): Promise<string> {
    if (copied.has(url)) return copied.get(url)!;
    try {
      const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 BuffOrDie-migracao" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = res.headers.get("content-type") ?? "image/jpeg";
      if (!type.startsWith("image/")) throw new Error(`não é imagem (${type})`);
      const name = decodeURIComponent(new URL(url).pathname.split("/").pop()!).replace(/[^\w.-]/g, "-");
      const path = `legado/${name}`;
      const { error } = await supabase.storage
        .from("midia")
        .upload(path, await res.arrayBuffer(), { contentType: type, cacheControl: "31536000", upsert: false });
      if (error && !/exists|duplicate/i.test(error.message)) throw new Error(error.message);
      const pub = supabase.storage.from("midia").getPublicUrl(path).data.publicUrl;
      copied.set(url, pub);
      return pub;
    } catch (e) {
      imgErrors.push(`${url}: ${(e as Error).message}`);
      return "";
    }
  }

  const result: { slug: string; status: string }[] = [];
  for (const p of legacyPosts) {
    const { data: exists } = await supabase.from("posts").select("id").eq("slug", p.slug).maybeSingle();
    if (exists) {
      result.push({ slug: p.slug, status: "já existia" });
      continue;
    }
    let content = p.content;
    for (const url of new Set(content.match(OLD) ?? [])) {
      const novo = await copy(url);
      // imagem que não copiou: remove o bloco em vez de deixar link quebrado
      content = novo ? content.split(url).join(novo) : content.replace(new RegExp(`!\\[[^\\]]*\\]\\(${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\)\\n*`, "g"), "");
    }
    const cover = p.cover ? (isOld(p.cover) ? await copy(p.cover) : p.cover) : null;

    const words = content.split(/\s+/).length;
    const { error } = await supabase.from("posts").insert({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content,
      cover_url: cover || null,
      score: p.score ?? null,
      status: "published",
      published_at: new Date(`${p.date}T12:00:00-03:00`).toISOString(),
      reading_minutes: Math.max(1, Math.round(words / 200)),
      tags: p.tags,
      author_id: auth.user.id,
      author_name: profile.display_name || profile.username,
      category_id: catId.get(p.section),
    });
    result.push({ slug: p.slug, status: error ? `erro: ${error.message}` : "publicada" });
  }

  revalidateTag("posts", { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ result, imagens: copied.size, imgErrors });
}

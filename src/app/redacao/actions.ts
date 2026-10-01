"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { sections } from "@/lib/sections";
import { supabaseServer } from "@/lib/supabase/server";

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function createPost(formData: FormData) {
  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/entrar?next=/redacao");

  const str = (k: string) => String(formData.get(k) ?? "").trim();
  const title = str("title");
  const excerpt = str("excerpt");
  const content = str("content");
  const section = str("section");
  const cover = str("cover_url");
  const scoreRaw = str("score").replace(",", ".");
  const status = str("status") === "draft" ? "draft" : "published";
  const tags = str("tags").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 10);

  const fail = (msg: string) => redirect(`/redacao?erro=${encodeURIComponent(msg)}`);
  if (title.length < 8) fail("O título precisa ter pelo menos 8 caracteres.");
  if (content.length < 200) fail("O texto precisa ter pelo menos 200 caracteres.");
  if (!sections.some((s) => s.slug === section)) fail("Escolha uma seção.");
  if (cover && !/^https:\/\//.test(cover)) fail("A imagem de capa precisa ser um link https://");
  const score = scoreRaw ? Number(scoreRaw) : null;
  if (score != null && !(score >= 0 && score <= 10)) fail("A nota precisa ser entre 0 e 10.");

  const [{ data: cat }, { data: profile }] = await Promise.all([
    supabase.from("categories").select("id").eq("slug", section).single(),
    supabase.from("profiles").select("display_name, username").eq("id", auth.user.id).single(),
  ]);
  if (!cat) fail("Seção não encontrada.");

  // slug único
  const base = slugify(title) || "materia";
  let slug = base;
  for (let i = 2; i < 50; i++) {
    const { data: exists } = await supabase.from("posts").select("id").eq("slug", slug).maybeSingle();
    if (!exists) break;
    slug = `${base}-${i}`;
  }

  const words = content.split(/\s+/).length;
  const { error } = await supabase.from("posts").insert({
    slug,
    title,
    excerpt: excerpt || content.slice(0, 180),
    content,
    cover_url: cover || null,
    score: section === "reviews" ? score : null,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
    reading_minutes: Math.max(1, Math.round(words / 200)),
    tags,
    author_id: auth.user.id,
    author_name: profile?.display_name || profile?.username || "Redação BuffOrDie",
    category_id: cat!.id,
  });
  if (error) fail(error.message.includes("row-level security") ? "Seu usuário não tem permissão de redação." : error.message);

  updateTag("posts");
  revalidatePath("/");
  revalidatePath(`/secao/${section}`);
  redirect(status === "published" ? `/noticias/${slug}` : "/redacao?ok=rascunho");
}

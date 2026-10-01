import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getRadar, timeAgo } from "@/lib/radar";
import { trendingTopics } from "@/lib/radar/trending";
import { sections } from "@/lib/sections";
import { supabaseServer } from "@/lib/supabase/server";
import { createPost } from "./actions";

export const metadata: Metadata = { title: "Redação", robots: { index: false, follow: false } };

const input =
  "w-full rounded-md border border-line bg-ink px-3 py-2.5 text-white placeholder:text-zinc-600 focus:border-acid focus:outline-none";

export default async function RedacaoPage({ searchParams }: PageProps<"/redacao">) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/entrar?next=/redacao");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, role")
    .eq("id", auth.user.id)
    .single();

  if (!profile || !["author", "editor", "admin"].includes(profile.role)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20">
        <h1 className="font-display text-3xl font-bold text-white">Redação</h1>
        <p className="mt-4 text-zinc-400">
          Seu usuário <strong className="text-white">@{profile?.username}</strong> ainda não tem acesso de redação.
          Peça para um administrador liberar seu acesso.
        </p>
      </div>
    );
  }

  const [radar, { data: mine }] = await Promise.all([
    getRadar(),
    supabase
      .from("posts")
      .select("slug, title, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);
  const topics = trendingTopics(radar, { minSources: 2 }).slice(0, 10);
  const pauta = topics.find((t) => t.key === one(sp.pauta));
  const erro = one(sp.erro);
  const ok = one(sp.ok);

  const fontes = pauta
    ? "\n\nFontes: " + pauta.items.map((i) => `[${i.sourceName}](${i.url})`).join(", ")
    : "";

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[360px_1fr]">
      <aside className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Redação</h1>
          <p className="mt-1 text-sm text-zinc-400">Pautas em alta: assuntos que várias fontes estão cobrindo.</p>
        </div>
        {topics.length === 0 && <p className="text-sm text-zinc-500">Nenhum assunto em comum entre as fontes agora.</p>}
        <ol className="space-y-3">
          {topics.map((t) => (
            <li key={t.key} className={`rounded-xl border p-4 ${pauta?.key === t.key ? "border-acid bg-acid/5" : "border-line bg-panel"}`}>
              <p className="font-medium leading-snug text-white">{t.title}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {t.sources.length} fontes · {timeAgo(t.latest)}
              </p>
              <ul className="mt-2 space-y-1">
                {t.items.slice(0, 4).map((i) => (
                  <li key={i.id} className="truncate text-xs">
                    <a href={i.url} target="_blank" rel="noopener" className="text-zinc-400 hover:text-acid">
                      {i.sourceName}: {i.title}
                    </a>
                  </li>
                ))}
              </ul>
              <Link href={`/redacao?pauta=${t.key}`} className="mt-3 inline-block text-sm font-semibold text-acid hover:underline">
                Escrever sobre isso →
              </Link>
            </li>
          ))}
        </ol>
      </aside>

      <section>
        {erro && <p className="mb-4 rounded-md border border-blood/50 bg-blood/10 px-4 py-3 text-sm text-red-200">{erro}</p>}
        {ok && <p className="mb-4 rounded-md border border-acid/50 bg-acid/10 px-4 py-3 text-sm text-lime-100">Rascunho salvo.</p>}

        <form action={createPost} className="space-y-4 rounded-2xl border border-line bg-panel p-6">
          <h2 className="font-display text-xl font-bold text-white">{pauta ? "Nova matéria sobre a pauta" : "Nova matéria"}</h2>
          {pauta && (
            <p className="text-sm text-zinc-400">
              Escreva com suas palavras, com o ângulo do BuffOrDie — não copie o texto das fontes. As fontes já foram
              adicionadas no fim do texto.
            </p>
          )}
          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Título</span>
            <input name="title" required minLength={8} maxLength={140} className={input} placeholder="Manchete da matéria" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Linha fina (resumo em 1–2 frases)</span>
            <input name="excerpt" maxLength={240} className={input} placeholder="Aparece nos cards e no Google" />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block space-y-1">
              <span className="text-sm text-zinc-300">Seção</span>
              <select name="section" defaultValue={pauta?.section ?? "noticias"} className={input}>
                {sections.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm text-zinc-300">Nota (só reviews)</span>
              <input name="score" inputMode="decimal" placeholder="ex.: 8.5" className={input} />
            </label>
            <label className="block space-y-1">
              <span className="text-sm text-zinc-300">Tags</span>
              <input name="tags" placeholder="ps5, rpg, cblol" className={input} />
            </label>
          </div>
          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Imagem de capa (link https://)</span>
            <input name="cover_url" type="url" placeholder="Use imagens próprias ou de press kit oficial" className={input} />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Texto</span>
            <textarea
              name="content"
              required
              minLength={200}
              rows={16}
              defaultValue={fontes}
              className={`${input} font-sans leading-relaxed`}
              placeholder={"Escreva a matéria. Deixe uma linha em branco entre parágrafos.\nLinks: [texto](https://...)  ·  Negrito: **texto**"}
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button name="status" value="published" className="rounded-md bg-acid px-5 py-2.5 font-semibold text-ink hover:brightness-110">
              Publicar agora
            </button>
            <button name="status" value="draft" className="rounded-md border border-line px-5 py-2.5 font-semibold text-zinc-300 hover:border-zinc-500">
              Salvar rascunho
            </button>
          </div>
        </form>

        {mine && mine.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-white">Últimas matérias</h2>
            <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-panel">
              {mine.map((p) => (
                <li key={p.slug} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  {p.status === "published" ? (
                    <Link href={`/noticias/${p.slug}`} className="truncate text-white hover:text-acid">{p.title}</Link>
                  ) : (
                    <span className="truncate text-zinc-300">{p.title}</span>
                  )}
                  <span className={`shrink-0 text-xs ${p.status === "published" ? "text-acid" : "text-amber-400"}`}>
                    {p.status === "published" ? "publicada" : "rascunho"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

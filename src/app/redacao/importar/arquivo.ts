import "server-only";
import { parseHTML } from "linkedom";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Importa as matérias do BuffOrDie antigo (Weebly, buffordie.com.br) para a Redação.
 * Roda uma vez, antes de o domínio apontar para a Vercel. As imagens vão para o Storage (midia/arquivo/).
 */
const OLD = "http://buffordie.com.br";

type Item = {
  path: string;
  section: "noticias" | "games" | "atualizacoes" | "competitivo" | "reviews";
  title: string;
  date: string; // data original (ou aproximada quando o original não tinha)
  by?: string; // autor original, citado no rodapé
  score?: number;
  cover?: string; // imagem de capa quando a matéria não tem uma no topo
  tags: string[];
};

const U = (f: string) => `${OLD}/uploads/8/9/5/9/89592829/${f}`;
const YT = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

export const ARQUIVO: Item[] = [
  { path: "/review-sekiro-shadows-die-twice.html", section: "reviews", title: "Review: Sekiro: Shadows Die Twice", date: "2019-11-01", by: "Ian D. Reis", score: 9, cover: U("sekiro1_orig.png"), tags: ["Sekiro", "FromSoftware"] },
  { path: "/red-dead-redemption-review.html", section: "reviews", title: "Review: Red Dead Redemption 2", date: "2018-11-29", by: "MaximunPoder", score: 9, tags: ["Red Dead Redemption 2", "Rockstar"] },
  { path: "/review-god-of-war.html", section: "reviews", title: "Review: God of War (PS4)", date: "2018-07-01", by: "@tstatee", score: 10, tags: ["God of War", "PS4"] },
  { path: "/review-resident-evil-2.html", section: "reviews", title: "Review: Resident Evil 2 Remake", date: "2019-02-13", by: "MaximunPoder", score: 10, tags: ["Resident Evil", "Capcom"] },
  { path: "/review-far-cry-new-dawn.html", section: "reviews", title: "Review: Far Cry New Dawn", date: "2020-01-20", by: "@tsstatee", score: 8, tags: ["Far Cry", "Ubisoft"] },
  { path: "/review-far-cry-3-classic-edition.html", section: "reviews", title: "Review: Far Cry 3 Classic Edition", date: "2020-01-20", by: "@tsstatee", score: 9, tags: ["Far Cry", "Ubisoft"] },
  { path: "/review-far-cry-5.html", section: "reviews", title: "Review: Far Cry 5", date: "2020-01-14", by: "@tsstatee", score: 9.5, tags: ["Far Cry", "Ubisoft"] },
  { path: "/review-far-cry-5-lost-on-mars.html", section: "reviews", title: "Review: Far Cry 5 – Lost on Mars", date: "2020-01-14", by: "@tsstatee", score: 7, tags: ["Far Cry", "DLC"] },
  { path: "/review-far-cry-5-hours-of-darkness.html", section: "reviews", title: "Review: Far Cry 5 – Hours of Darkness", date: "2020-01-14", by: "@tsstatee", score: 5, tags: ["Far Cry", "DLC"] },
  { path: "/review-spider-man-ps4.html", section: "reviews", title: "Review: Marvel's Spider-Man (PS4)", date: "2020-01-01", by: "@tstatee", tags: ["Spider-Man", "PS4", "Insomniac"] },
  { path: "/tudo-que-rolou-no-tga-2019.html", section: "noticias", title: "The Game Awards 2019: Sekiro leva o GOTY e tudo que rolou no evento", date: "2019-12-15", by: "@tsstatee", tags: ["The Game Awards", "GOTY"] },
  { path: "/duas-semanas-de-games-gratis-epic-games-store.html", section: "noticias", title: "Epic Games Store dará um jogo grátis por dia durante duas semanas", date: "2019-12-18", by: "Merehj", cover: U("apagar_orig.png"), tags: ["Epic Games Store", "Jogos grátis"] },
  { path: "/games-gratis-ps-plus.html", section: "noticias", title: "PS Plus de dezembro de 2019: Titanfall 2 e Monster Energy Supercross", date: "2019-12-05", tags: ["PS Plus", "Jogos grátis"] },
  { path: "/xbox-live-dezembro.html", section: "noticias", title: "Xbox Live Gold de dezembro de 2019: os jogos grátis do mês", date: "2019-12-05", cover: U("xbox-live_orig.jpg"), tags: ["Xbox Live Gold", "Jogos grátis"] },
  { path: "/ps-plus-abril-2019.html", section: "noticias", title: "PS Plus de abril de 2019: Conan Exiles e The Surge", date: "2019-03-27", cover: U("plus_orig.jpg"), tags: [] },
  { path: "/devil-may-cry-5-revelado.html", section: "noticias", title: "Devil May Cry 5 ganha trailer e data de lançamento na gamescom", date: "2018-08-22", cover: U("devil-may-cry-5_orig.jpg"), tags: [] },
  { path: "/live-ign-super-smash-bros.html", section: "noticias", title: "Super Smash Bros. Ultimate: assista à live de gameplay da IGN", date: "2018-12-06", cover: U("super-smash-ridley-twitter_orig.png"), tags: ["Super Smash Bros. Ultimate", "Nintendo Switch"] },
  { path: "/20-jogos-de-nes-gratis.html", section: "noticias", title: "Nintendo Switch Online traz 20 clássicos do NES", date: "2018-09-20", cover: U("nes-switch-online-main_orig.jpg"), tags: ["Nintendo Switch", "NES", "Retrô"] },
  { path: "/ashe-review-overwatch.html", section: "atualizacoes", title: "Ashe chega a Overwatch: conheça as habilidades da nova heroína", date: "2018-11-13", tags: ["Overwatch", "Blizzard"] },
  { path: "/overwatch_dark_souls.html", section: "games", title: "Overwatch encontra Dark Souls em crossover feito por fãs", date: "2018-10-01", cover: U("maxresdefault_orig.jpg"), tags: [] },
  { path: "/overwatch-evolucao.html", section: "games", title: "A evolução de Overwatch: do protótipo ao jogo que amamos", date: "2018-10-01", cover: YT("CBFrwRXUV-g"), tags: ["Overwatch"] },
  { path: "/top-10-atalhos-menos-usados-overwatch.html", section: "competitivo", title: "Overwatch: 10 atalhos pouco usados que evitam derrotas", date: "2018-10-01", cover: U("overwatch-junkrat_orig.jpg"), tags: ["Overwatch", "Dicas"] },
  { path: "/paciencia-zero-preconceito.html", section: "competitivo", title: "Não toleramos preconceito: o caso de toxicidade contra uma jogadora de Overwatch", date: "2019-01-10", cover: U("hurt-ana-editado_1_orig.png"), tags: ["Overwatch", "Comunidade"] },
];

type Block = { t: "h" | "p"; x: string } | { t: "img"; src: string; cap: string; link: string } | { t: "video"; url: string };

/** Converte o HTML de um parágrafo do Weebly no formato da Redação (**negrito**, [link](url)). */
function md(el: Element, base: string): string {
  let s = "";
  for (const n of Array.from(el.childNodes)) {
    if (n.nodeType === 3) s += n.textContent ?? "";
    else if (n.nodeName === "BR") s += "\n";
    else if (n.nodeName === "A") {
      const a = n as HTMLAnchorElement;
      const t = (a.textContent ?? "").trim();
      const href = a.getAttribute("href") ?? "";
      let url = "";
      try {
        url = new URL(href, base).href;
      } catch {}
      // Links para páginas do site antigo deixam de existir: fica só o texto.
      s += !t ? "" : /^https?:/.test(url) && !url.includes("buffordie.com.br") ? `[${t}](${url})` : t;
    } else if (/^(B|STRONG)$/.test(n.nodeName)) {
      const t = md(n as Element, base).trim();
      s += t ? `**${t}**` : "";
    } else if (/^(DIV|P|LI|H\d)$/.test(n.nodeName)) s += "\n" + md(n as Element, base);
    else if (n.nodeType === 1) s += md(n as Element, base);
  }
  return s;
}

function parse(html: string, url: string): Block[] {
  const { document } = parseHTML(html);
  const root = document.querySelector("#wsite-content");
  if (!root) return [];
  const blocks: Block[] = [];
  for (const e of Array.from(root.querySelectorAll(".wsite-content-title, .paragraph, .wsite-image img, iframe"))) {
    if (e.tagName === "IMG") {
      const box = e.closest(".wsite-image");
      const cap = Array.from(box?.querySelectorAll("div") ?? []).find((d) => /display:\s*block/.test(d.getAttribute("style") ?? ""));
      blocks.push({
        t: "img",
        src: new URL(e.getAttribute("src") ?? "", url).href.replace(/\?\d+$/, ""),
        cap: (cap?.textContent ?? "").trim(),
        link: e.closest("a")?.getAttribute("href") ?? "",
      });
    } else if (e.tagName === "IFRAME") {
      const id = (e.getAttribute("src") ?? "").match(/youtube\.com\/embed\/([\w-]{11})/)?.[1];
      if (id) blocks.push({ t: "video", url: `https://www.youtube.com/watch?v=${id}` });
    } else if (e.classList.contains("wsite-content-title")) {
      const x = (e.textContent ?? "").trim();
      if (x) blocks.push({ t: "h", x });
    } else {
      const x = md(e, url)
        .replace(/[ ​]/g, " ")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n[ \t]+/g, "\n")
        .replace(/\*\*\s*\*\*/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      if (x) blocks.push({ t: "p", x });
    }
  }
  return blocks;
}

const fmt = (d: string) => d.split("-").reverse().join("/");
const titleCase = (s: string) => (s === s.toUpperCase() || s === s.toLowerCase() ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s);

/** Monta o texto final da matéria. Devolve também as tags e a capa encontradas. */
function build(item: Item, blocks: Block[]) {
  const tags = new Set(item.tags);
  const out: string[] = [];
  let cover = item.cover ?? "";
  let first = true;
  let stop = false;

  for (const b of blocks) {
    if (stop) break;
    if (b.t === "img") {
      // Cards de navegação do site antigo (levam a páginas que vão sumir) ficam de fora.
      if (b.link.includes("buffordie.com.br") || (b.link && !b.link.startsWith("http"))) continue;
      if (!cover && first) {
        cover = b.src;
        first = false;
        continue;
      }
      if (b.src === cover) continue;
      const cap = b.cap.replace(/^Picture$/i, "").replace(/^Imagem:\s*/i, "");
      out.push(`![${cap}](${b.src})`);
      first = false;
      continue;
    }
    if (b.t === "video") {
      out.push(b.url);
      first = false;
      continue;
    }
    if (b.t === "h") {
      out.push(`**${titleCase(b.x)}**`);
      continue;
    }
    let x = b.x;
    // Assinatura do original ("Escrito por ...") vai para o rodapé.
    if (/^Escrito (e editado )?por /i.test(x) || /^\d{2}\/\d{2}\/\d{2} - escrito por/i.test(x)) continue;
    // Chamadas para seções do site antigo.
    if (/^\*\*(Veja|Confira nossos outros)/i.test(x) || /^(Quer saber mais sobre|Não se esqueça de comentar)/i.test(x)) {
      if (/^\*\*/.test(x) || /^Quer saber/.test(x)) stop = true;
      continue;
    }
    x = x
      .replace(/\n?Para saber mais sobre (o game|a personagem)[\s\S]*$/i, "")
      .replace(/\n?Leia mais sobre overwatch clicando aqui\s*$/i, "")
      .replace(/^Curtiu esse post e quer saber mais sobre games\?\n?/im, "")
      .replace(/\nFoto\b/g, "")
      .replace(/ Foto$/gm, "")
      .replace(/^Enredo:Sekiro: Shadows Die Twice/, "**Enredo:** Sekiro: Shadows Die Twice");
    const tagLine = x.match(/^Tags:\s*(.+)$/im);
    if (tagLine) {
      for (const t of tagLine[1].split(",")) if (t.trim()) tags.add(t.trim());
      x = x.replace(/\n*^Tags:.*$/im, "");
    }
    x = x.replace(/\n{3,}/g, "\n\n").trim();
    if (x) out.push(x);
  }

  out.push(`— Do arquivo do BuffOrDie: publicada originalmente em ${fmt(item.date)}${item.by ? `, por ${item.by}` : ""}.`);
  return { content: out.join("\n\n"), cover, tags: [...tags].slice(0, 10) };
}

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Copia uma imagem do site antigo para o Storage e devolve a URL nova. */
async function rehost(sb: SupabaseClient, src: string): Promise<string> {
  if (!src.startsWith(OLD)) return src;
  const res = await fetch(src, { cache: "no-store" });
  if (!res.ok) throw new Error(`imagem ${res.status}: ${src}`);
  const type = res.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
  const name = src.split("/").pop()!.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
  const path = `arquivo/${name}`;
  const { error } = await sb.storage.from("midia").upload(path, await res.arrayBuffer(), { contentType: type, upsert: true, cacheControl: "31536000" });
  if (error) throw new Error(`upload ${name}: ${error.message}`);
  return sb.storage.from("midia").getPublicUrl(path).data.publicUrl;
}

async function pool<T, R>(items: T[], n: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k]);
      }
    }),
  );
  return out;
}

export async function importArquivo(sb: SupabaseClient, user: { id: string; name: string }) {
  const log: string[] = [];
  const { data: cats } = await sb.from("categories").select("id, slug");
  const catId = new Map((cats ?? []).map((c) => [c.slug as string, c.id as number]));

  // 1) Lê e monta as matérias.
  const built = await pool(ARQUIVO, 6, async (item) => {
    const res = await fetch(OLD + item.path, { cache: "no-store" });
    if (!res.ok) throw new Error(`${item.path}: HTTP ${res.status}`);
    return { item, ...build(item, parse(await res.text(), OLD + item.path)) };
  });

  // 2) Copia as imagens (capas + corpo) para o Storage.
  const srcs = new Set<string>();
  for (const b of built) {
    if (b.cover) srcs.add(b.cover);
    for (const m of b.content.matchAll(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/g)) srcs.add(m[1]);
  }
  const map = new Map<string, string>();
  await pool([...srcs], 6, async (src) => {
    try {
      map.set(src, await rehost(sb, src));
    } catch (e) {
      log.push(`⚠ ${(e as Error).message}`);
    }
  });

  // 3) Grava (re-executar atualiza em vez de duplicar).
  let ok = 0;
  for (const b of built) {
    let content = b.content;
    for (const [from, to] of map) content = content.split(from).join(to);
    content = content.replace(/!\[[^\]]*\]\(http:\/\/buffordie\.com\.br[^)]*\)\n*/g, ""); // imagem que não copiou
    const words = content.split(/\s+/).length;
    const firstText =
      content
        .split(/\n{2,}/)
        .filter((p) => !/^(!\[|https?:)/.test(p))
        .map((p) => p.split("\n").filter((l) => !/^\*\*[^*]+\*\*:?$/.test(l.trim())).join(" "))
        .find((p) => p.length > 40) ?? "";
    const row = {
      slug: slugify(b.item.title),
      title: b.item.title,
      excerpt: firstText.replace(/\*\*|\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").slice(0, 180).trim(),
      content,
      cover_url: map.get(b.cover) ?? (b.cover.startsWith("https://") ? b.cover : null),
      score: b.item.score ?? null,
      status: "published",
      published_at: new Date(`${b.item.date}T12:00:00-03:00`).toISOString(),
      reading_minutes: Math.max(1, Math.round(words / 200)),
      tags: b.tags,
      author_id: user.id,
      author_name: user.name,
      category_id: catId.get(b.item.section)!,
    };
    const { error } = await sb.from("posts").upsert(row, { onConflict: "slug" });
    if (error) log.push(`✗ ${b.item.title}: ${error.message}`);
    else ok++;
  }
  return { ok, total: ARQUIVO.length, images: map.size, log };
}

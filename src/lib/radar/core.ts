// Núcleo do Radar: lê feeds RSS/Atom, normaliza e classifica por seção.
// Sem dependências do Next — também roda direto no Node (scripts/check-feeds.ts).
import { XMLParser } from "fast-xml-parser";

export type SectionSlug = "noticias" | "games" | "atualizacoes" | "competitivo" | "reviews";

export type Source = {
  id: string;
  name: string;
  home: string;
  /** URLs de feed conhecidas, tentadas em ordem. */
  feeds: string[];
  /** Seção padrão quando nenhuma palavra-chave bate. */
  defaultSection?: SectionSlug;
  /** Fonte generalista (tecnologia/cultura pop): só entra o que for de games. */
  gamesOnly?: boolean;
  /** Domínio usado no plano C (feed do Google Notícias filtrado pelo site). */
  googleNewsSite?: string;
};

export type RadarItem = {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  image?: string;
  publishedAt: string; // ISO
  sourceId: string;
  sourceName: string;
  section: SectionSlug;
};

export type Fetcher = (url: string) => Promise<Response>;

const UA = "Mozilla/5.0 (compatible; BuffOrDieRadar/1.0; +https://buffordie.com.br)";

// ---------- texto ----------

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…",
  ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
};

export function decodeEntities(s: string) {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

export function stripHtml(s: string) {
  return decodeEntities(s.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** Resumo curto (não reproduz a matéria — só o suficiente para contextualizar o link). */
export function shortExcerpt(s: string, max = 180) {
  const text = stripHtml(s);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : max).replace(/[,;:.\s]+$/, "") + "…";
}

function textOf(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return textOf(v[0]);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    return textOf(o["#text"] ?? o["__cdata"] ?? "");
  }
  return "";
}

function arr<T>(v: T | T[] | undefined): T[] {
  return v == null ? [] : Array.isArray(v) ? v : [v];
}

// ---------- classificação ----------

const has = (text: string, words: RegExp) => words.test(text);

const RE_COMPETITIVO =
  /\b(e-?sports?|campeonat\w*|torneio\w*|cblol|lta|cbcs|major|vct|valorant champions|champions tour|worlds|msi|iem|blast|pgl|esl|lbff|ffws|free fire world|copa|playoffs?|final(?:ista)?s?|semifina\w*|roster|elenco|contrata\w*|furia|loud|pain gaming|mibr|imperial|red canids|vivo keyd|fluxo|liquid|navi|faze|vitality|g2|t1|lol|counter-?strike|cs2|r6|rainbow six|dota)\b/i;
const RE_ATUALIZACOES =
  /\b(atualiza\w*|update|patch|hotfix|notas de patch|temporada|season|nova season|passe de batalha|battle pass|dlc|expans\w*|nerf\w*|buff\w*|balanceament\w*|novo mapa|novos? agentes?|novos? personage\w*|evento|versão \d|v\d+\.\d+)\b/i;
const RE_REVIEWS = /\b(review|análise|analisamos|vale a pena|nota final|testamos|impressões)\b/i;
const RE_GAMES =
  /\b(guia|dicas?|como (?:fazer|conseguir|desbloquear|jogar)|lista|melhores|ranking|trailer|gameplay|jogos? grátis|de graça|promoç\w*|lançament\w*|lança\w*|chega\w*|data de lançamento|requisitos|pré-venda|game pass|ps plus|epic games|steam)\b/i;

const RE_IS_GAME =
  /\b(game|games|gamer|jog[oa]s?|jogar|videogame|console|playstation|ps[45]|xbox|nintendo|switch|steam|epic games|game pass|ps plus|e-?sports?|rpg|fps|mmo|battle royale|gta|minecraft|fortnite|roblox|league of legends|valorant|counter-?strike|cs2|free fire|pokémon|pokemon|zelda|mario|call of duty|ea sports|fc \d\d|riot|blizzard|ubisoft|capcom|bethesda|sony|rockstar|twitch)\b/i;

export function classify(title: string, excerpt: string, categories: string[], fallback: SectionSlug = "noticias"): SectionSlug {
  const text = `${title} ${categories.join(" ")} ${excerpt}`;
  const head = `${title} ${categories.join(" ")}`;
  if (has(head, RE_REVIEWS)) return "reviews";
  if (has(head, RE_COMPETITIVO)) return "competitivo";
  if (has(head, RE_ATUALIZACOES)) return "atualizacoes";
  if (has(head, RE_GAMES)) return "games";
  if (fallback === "competitivo") return "competitivo";
  if (has(text, RE_COMPETITIVO) && /\b(e-?sports?|campeonat|torneio|cblol|major|vct)\b/i.test(text)) return "competitivo";
  return fallback;
}

// Páginas institucionais, cupons e apostas não entram no Radar.
const RE_JUNK =
  /\b(cupo(?:m|ns)|desconto exclusivo|apostas?|bets?|cassino|odds|palpites?|bônus de boas-vindas|patrocinad\w*|publieditorial|estatísticas e resultado|vs\.? tbd|campeonatos finalizados|notícias e coberturas|ao vivo e online|onde assistir)\b/i;

// Páginas automáticas de partida/evento ("TIME A vs TIME B", "CCT Series #6").
const RE_MATCH_PAGE = /\bseries #\d+\b|^\S.{0,60}\svs\.?\s.{1,60}$/i;

export function isJunk(title: string) {
  const words = title.split(/\s+/).length;
  if (words < 3 || RE_JUNK.test(title)) return true;
  // "LOUD vs FURIA: quem leva a final?" é manchete; "LOUD vs FURIA - Liga X" é página de partida.
  return RE_MATCH_PAGE.test(title) && !title.includes(":") && words < 9;
}

// Títulos com "game" que não são de games.
const RE_FALSE_GAME = /\b(game of thrones|squid game|hunger games|jogos vorazes|game changer|jogo (?:do|de) (?:futebol|brasileirão|campeonato brasileiro))\b/gi;

export function isAboutGames(title: string, excerpt: string, categories: string[]) {
  return RE_IS_GAME.test(`${title} ${categories.join(" ")} ${excerpt}`.replace(RE_FALSE_GAME, " "));
}

// ---------- parse ----------

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@",
  cdataPropName: "__cdata",
  processEntities: true,
  htmlEntities: true,
  trimValues: true,
});

/** Troca miniaturas (Blogger "s72-c", WordPress "-150x150") pela versão grande da mesma imagem. */
export function upgradeImage(url: string | undefined): string | undefined {
  if (!url) return url;
  let u = decodeEntities(url.trim());
  if (u.startsWith("//")) u = "https:" + u;
  if (/googleusercontent\.com|blogger\.com|bp\.blogspot\.com/.test(u)) {
    u = u
      .replace(/\/(?:s|w)\d+(?:-h\d+)?(?:-[a-z0-9-]+)?\//i, "/s1280/")
      .replace(/=(?:s|w)\d+(?:-h\d+)?(?:-[a-z0-9-]+)?$/i, "=s1280");
  }
  return u.replace(/-\d{2,4}x\d{2,4}(\.(?:jpe?g|png|webp|gif))(\?.*)?$/i, "$1$2");
}

function pickImage(it: Record<string, unknown>, html: string): string | undefined {
  const media = [
    ...arr(it["media:content"] as Record<string, string>[]),
    ...arr(it["media:thumbnail"] as Record<string, string>[]),
    ...arr(it["enclosure"] as Record<string, string>[]),
  ];
  for (const m of media) {
    const url = m?.["@url"];
    const type = m?.["@type"] ?? m?.["@medium"] ?? "image";
    if (url && /image/.test(type)) return url;
  }
  const img = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return img?.[1];
}

function idFrom(url: string) {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (Math.imul(31, h) + url.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

export function parseFeed(xml: string, source: Source, opts: { googleNews?: boolean } = {}): RadarItem[] {
  const doc = parser.parse(xml);
  const rssItems = arr(doc?.rss?.channel?.item ?? doc?.["rdf:RDF"]?.item);
  const atomEntries = arr(doc?.feed?.entry);
  const out: RadarItem[] = [];

  const push = (raw: Record<string, unknown>, link: string, html: string, date: string, cats: string[]) => {
    let title = stripHtml(textOf(raw.title));
    // Google Notícias acrescenta " - Nome do Site" (às vezes "| SITE - slogan") no fim do título.
    if (opts.googleNews) title = title.replace(/\s*\|[^|]*$/, "").replace(/\s+[-–]\s+[^-–]{2,40}$/, "");
    if (!title || !link || isJunk(title)) return;
    // Pelo Google Notícias também vêm páginas de time/campeonato com título curto: só manchetes de verdade.
    if (opts.googleNews && title.split(/\s+/).length < 5) return;
    let excerpt = shortExcerpt(html);
    if (opts.googleNews || excerpt.toLowerCase().startsWith(title.toLowerCase().slice(0, 30))) excerpt = "";
    if (source.gamesOnly && !isAboutGames(title, excerpt, cats)) return;
    const d = new Date(date);
    out.push({
      id: `${source.id}-${idFrom(link)}`,
      title,
      url: link,
      excerpt,
      image: upgradeImage(pickImage(raw, html)),
      publishedAt: Number.isNaN(+d) ? new Date().toISOString() : d.toISOString(),
      sourceId: source.id,
      sourceName: source.name,
      section: classify(title, excerpt, cats, source.defaultSection),
    });
  };

  for (const it of rssItems as Record<string, unknown>[]) {
    const html = textOf(it.description) || textOf(it["content:encoded"]);
    const cats = arr(it.category as unknown[]).map(textOf);
    push(it, textOf(it.link).trim() || textOf(it.guid), html, textOf(it.pubDate) || textOf(it["dc:date"]), cats);
  }
  for (const e of atomEntries as Record<string, unknown>[]) {
    const links = arr(e.link as Record<string, string>[]);
    const link = (links.find((l) => !l["@rel"] || l["@rel"] === "alternate") ?? links[0])?.["@href"] ?? "";
    const html = textOf(e.summary) || textOf(e.content);
    const cats = arr(e.category as Record<string, string>[]).map((c) => c?.["@term"] ?? "");
    push(e, link, html, textOf(e.published) || textOf(e.updated), cats);
  }
  return out;
}

// ---------- descoberta e coleta ----------

export function discoverFeedUrls(html: string, base: string): string[] {
  const urls: string[] = [];
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (!/rel=["']?alternate/i.test(tag) || !/(rss|atom)\+xml/i.test(tag)) continue;
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
    if (href) urls.push(new URL(decodeEntities(href), base).toString());
  }
  return [...new Set(urls)];
}

const looksLikeFeed = (body: string) => /<(rss|feed|rdf:RDF)\b/i.test(body.slice(0, 2000));

export function googleNewsFeed(site: string) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(`site:${site} when:7d`)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
}

// ---------- Google Notícias → link real + foto oficial ----------

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

export const isGoogleNewsLink = (url: string) => /^https:\/\/news\.google\.com\/(rss\/)?articles\//.test(url);

/** Lê só o <head> da página (para pegar og:image sem baixar a página inteira). */
async function readHead(res: Response, limit = 400_000) {
  if (!res.body) return (await res.text()).slice(0, limit);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let html = "";
  while (html.length < limit) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value, { stream: true });
    if (/<\/head>/i.test(html)) break;
  }
  reader.cancel().catch(() => {});
  return html;
}

export function findOgImage(html: string, base: string): string | undefined {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (!/(property|name)=["'](og:image(:secure_url)?|twitter:image)["']/i.test(tag)) continue;
    const content = tag.match(/content=["']([^"']+)["']/i)?.[1];
    if (content) {
      try {
        return upgradeImage(new URL(decodeEntities(content), base).toString());
      } catch {}
    }
  }
}

export type ResolvedArticle = { url: string; image?: string };

/**
 * Descobre o link original de uma notícia do Google Notícias (mesmo método usado por leitores de RSS)
 * e a foto oficial da matéria (og:image). Devolve null se não conseguir.
 */
export async function resolveGoogleNewsArticle(gnewsUrl: string, timeoutMs = 6000): Promise<ResolvedArticle | null> {
  const headers = { "user-agent": BROWSER_UA, "accept-language": "pt-BR,pt;q=0.9" };
  const signal = () => AbortSignal.timeout(timeoutMs);
  try {
    const id = new URL(gnewsUrl).pathname.split("/").pop();
    if (!id) return null;
    const page = await fetch(`https://news.google.com/articles/${id}`, { headers, signal: signal(), cache: "no-store" });
    const html = await page.text();
    const sg = html.match(/data-n-a-sg="([^"]+)"/)?.[1];
    const ts = html.match(/data-n-a-ts="([^"]+)"/)?.[1];
    if (!sg || !ts) return null;
    const payload = [
      "garturlreq",
      [["X", "X", ["X", "X"], null, null, 1, 1, "US:en", null, 1, null, null, null, null, null, 0, 1], "X", "X", 1, [1, 1, 1], 1, 1, null, 0, 0, null, 0],
      id,
      Number(ts),
      sg,
    ];
    const res = await fetch("https://news.google.com/_/DotsSplashUi/data/batchexecute", {
      method: "POST",
      headers: { ...headers, "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: "f.req=" + encodeURIComponent(JSON.stringify([[["Fbv4je", JSON.stringify(payload), null, "generic"]]])),
      signal: signal(),
      cache: "no-store",
    });
    const text = await res.text();
    const m = text.match(/\\"garturlres\\",\\"(https?:[^"\\]+)/) ?? text.match(/garturlres[^h]+(https?:\/\/[^"\\]+)/);
    const url = m?.[1]?.replace(/\\u003d/g, "=").replace(/\\u0026/g, "&");
    if (!url || isGoogleNewsLink(url)) return null;
    let image: string | undefined;
    try {
      const art = await fetch(url, { headers, signal: signal(), cache: "no-store", redirect: "follow" });
      if (art.ok) image = findOgImage(await readHead(art), art.url || url);
    } catch {}
    return { url, image };
  } catch {
    return null;
  }
}

export type SourceResult = { source: Source; feedUrl?: string; items: RadarItem[]; error?: string };

export async function fetchSource(source: Source, fetcher: Fetcher): Promise<SourceResult> {
  const tried: string[] = []; // "url → resultado", para diagnóstico
  const attempted = new Set<string>();

  const get = async (url: string) => {
    attempted.add(url);
    try {
      const res = await fetcher(url);
      const body = res.ok ? await res.text() : "";
      return { status: res.status, body };
    } catch (e) {
      return { status: 0, body: "", err: e instanceof Error ? (e.cause instanceof Error ? e.cause.message : e.message) : String(e) };
    }
  };

  const tryFeed = async (url: string) => {
    const r = await get(url);
    const ok = r.status === 200 && looksLikeFeed(r.body);
    tried.push(`${url} → ${ok ? "ok" : r.status ? `HTTP ${r.status}${r.status === 200 ? " (não é feed)" : ""}` : r.err}`);
    return ok ? r.body : null;
  };

  try {
    for (const url of source.feeds) {
      const body = await tryFeed(url);
      if (body) return { source, feedUrl: url, items: parseFeed(body, source) };
    }
    // Plano B: descobrir o feed pela própria página do site.
    const home = await get(source.home);
    tried.push(`${source.home} (página) → ${home.status ? `HTTP ${home.status}` : home.err}`);
    if (home.status === 200) {
      for (const url of discoverFeedUrls(home.body, source.home)) {
        if (attempted.has(url)) continue;
        const body = await tryFeed(url);
        if (body) return { source, feedUrl: url, items: parseFeed(body, source) };
      }
    }
    // Plano C: Google Notícias filtrado pelo domínio da fonte.
    if (source.googleNewsSite) {
      const url = googleNewsFeed(source.googleNewsSite);
      const body = await tryFeed(url);
      if (body) return { source, feedUrl: url, items: parseFeed(body, source, { googleNews: true }) };
    }
    return { source, items: [], error: `nenhum feed válido — ${tried.join(" | ")}` };
  } catch (e) {
    return { source, items: [], error: e instanceof Error ? e.message : String(e) };
  }
}

export const defaultHeaders = { "user-agent": UA, accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html;q=0.8" };

/** Junta, remove duplicadas (mesmo link ou mesmo título) e ordena do mais novo para o mais antigo. */
export function mergeItems(lists: RadarItem[][]) {
  const seen = new Set<string>();
  const all: RadarItem[] = [];
  for (const it of lists.flat()) {
    const key = it.title.toLowerCase().replace(/\W+/g, "");
    if (seen.has(it.url) || seen.has(key)) continue;
    seen.add(it.url);
    seen.add(key);
    all.push(it);
  }
  const now = Date.now() + 5 * 60_000;
  return all
    .filter((i) => +new Date(i.publishedAt) <= now)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

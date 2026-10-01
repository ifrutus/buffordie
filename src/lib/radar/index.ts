import { unstable_cache } from "next/cache";
import { cache } from "react";
import {
  defaultHeaders,
  fetchSource,
  isGoogleNewsLink,
  mergeItems,
  resolveGoogleNewsArticle,
  type RadarItem,
  type SectionSlug,
} from "./core.ts";
import { sources } from "./sources.ts";

export type { RadarItem };

/** Quanto tempo (s) cada feed fica em cache antes de ser lido de novo. */
export const RADAR_REVALIDATE = 900;

const nextFetcher = (url: string) =>
  fetch(url, {
    headers: defaultHeaders,
    signal: AbortSignal.timeout(8000),
    next: { revalidate: RADAR_REVALIDATE, tags: ["radar"] },
  });

/** Link real + foto de uma notícia do Google Notícias — resolvido uma vez e guardado por 7 dias. */
const resolveCached = unstable_cache(
  async (gnewsUrl: string) => resolveGoogleNewsArticle(gnewsUrl),
  ["radar-gnews-resolve-v1"],
  { revalidate: 7 * 24 * 3600 },
);

/** Resolve até `limit` notícias do Google Notícias em paralelo, dentro de um prazo; o resto fica para a próxima rodada. */
async function enrich(items: RadarItem[], limit = 60, budgetMs = 20_000): Promise<RadarItem[]> {
  const pending = items.filter((i) => isGoogleNewsLink(i.url)).slice(0, limit);
  const resolved = new Map<string, { url: string; image?: string }>();
  const deadline = new Promise<void>((r) => setTimeout(r, budgetMs));
  const queue = [...pending];
  const worker = async () => {
    for (let it = queue.shift(); it; it = queue.shift()) {
      const r = await resolveCached(it.url).catch(() => null);
      if (r) resolved.set(it.id, r);
    }
  };
  await Promise.race([Promise.all(Array.from({ length: 6 }, worker)), deadline]);
  return items.map((i) => {
    const r = resolved.get(i.id);
    return r ? { ...i, url: r.url, image: i.image ?? r.image } : i;
  });
}

/** Todas as notícias das fontes, já classificadas e ordenadas. Nunca lança erro. */
export const getRadar = cache(async (): Promise<RadarItem[]> => {
  const results = await Promise.all(sources.map((s) => fetchSource(s, nextFetcher)));
  for (const r of results) if (r.error) console.warn(`[radar] ${r.source.name}: ${r.error}`);
  // Limita por fonte para nenhuma dominar o feed.
  const merged = mergeItems(results.map((r) => r.items.slice(0, 25)));
  return enrich(merged);
});

export async function getRadarItem(id: string) {
  return (await getRadar()).find((i) => i.id === id) ?? null;
}

export async function getRadarBySection(section: SectionSlug, limit = 24) {
  return (await getRadar()).filter((i) => i.section === section).slice(0, limit);
}

export function timeAgo(iso: string) {
  const diff = Math.max(0, Date.now() - +new Date(iso)) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  const d = Math.floor(diff / 86400);
  return d === 1 ? "ontem" : `há ${d} dias`;
}

import { cache } from "react";
import { defaultHeaders, fetchSource, mergeItems, type RadarItem, type SectionSlug } from "./core.ts";
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

/** Todas as notícias das fontes, já classificadas e ordenadas. Nunca lança erro. */
export const getRadar = cache(async (): Promise<RadarItem[]> => {
  const results = await Promise.all(sources.map((s) => fetchSource(s, nextFetcher)));
  for (const r of results) if (r.error) console.warn(`[radar] ${r.source.name}: ${r.error}`);
  // Limita por fonte para nenhuma dominar o feed.
  return mergeItems(results.map((r) => r.items.slice(0, 25)));
});

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

import { unstable_cache } from "next/cache";
import { cache } from "react";
import {
  defaultHeaders,
  fetchSource,
  fetchOgImage,
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
// Falhas lançam erro de propósito: o unstable_cache não guarda erros, então a próxima rodada tenta de novo.
const resolveCached = unstable_cache(
  async (gnewsUrl: string) => {
    const r = await resolveGoogleNewsArticle(gnewsUrl);
    if (!r) throw new Error("não resolvido");
    return r;
  },
  ["radar-gnews-resolve-v4"],
  { revalidate: 7 * 24 * 3600 },
);

/** Foto oficial de uma matéria sem imagem no feed — guardada por 7 dias. */
const ogImageCached = unstable_cache(
  async (url: string) => {
    const img = await fetchOgImage(url);
    if (!img) throw new Error("sem foto");
    return img;
  },
  ["radar-og-image-v3"],
  {
    revalidate: 7 * 24 * 3600,
  },
);

/**
 * Completa as notícias: link real + foto das que vêm pelo Google Notícias e foto oficial das que vêm sem imagem.
 * Roda em paralelo dentro de um prazo; o que não der tempo fica para a próxima rodada (o resto já está em cache).
 */
async function enrich(items: RadarItem[], limit = 110, budgetMs = 25_000): Promise<RadarItem[]> {
  const pending = items.filter((i) => isGoogleNewsLink(i.url) || !i.image).slice(0, limit);
  const resolved = new Map<string, { url: string; image?: string }>();
  const deadline = new Promise<void>((r) => setTimeout(r, budgetMs));
  const queue = [...pending];
  const worker = async () => {
    for (let it = queue.shift(); it; it = queue.shift()) {
      if (isGoogleNewsLink(it.url)) {
        const r = await resolveCached(it.url).catch(() => null);
        if (r) resolved.set(it.id, r);
      } else {
        const image = await ogImageCached(it.url).catch(() => null);
        if (image) resolved.set(it.id, { url: it.url, image });
      }
    }
  };
  await Promise.race([Promise.all(Array.from({ length: 5 }, worker)), deadline]);
  return items.map((i) => {
    const r = resolved.get(i.id);
    return r ? { ...i, url: r.url, image: i.image ?? r.image } : i;
  });
}

async function buildRadar(): Promise<RadarItem[]> {
  const results = await Promise.all(sources.map((s) => fetchSource(s, nextFetcher)));
  for (const r of results) if (r.error) console.warn(`[radar] ${r.source.name}: ${r.error}`);
  // Limita por fonte para nenhuma dominar o feed.
  const merged = mergeItems(results.map((r) => r.items.slice(0, 25)));
  return enrich(merged);
}

/**
 * O Radar inteiro é montado uma vez a cada 15 min e compartilhado por todas as páginas
 * (assim o Google Notícias não recebe dezenas de pedidos simultâneos).
 */
const radarShared = unstable_cache(buildRadar, ["radar-all-v2"], { revalidate: RADAR_REVALIDATE, tags: ["radar"] });

/** Todas as notícias das fontes, já classificadas e ordenadas. Nunca lança erro. */
export const getRadar = cache(async (): Promise<RadarItem[]> => {
  try {
    return await radarShared();
  } catch {
    return buildRadar();
  }
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

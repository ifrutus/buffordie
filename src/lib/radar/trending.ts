// Agrupa notícias de fontes diferentes que falam do mesmo assunto.
// Puro (sem Next) para poder ser testado direto no Node.
import type { RadarItem } from "./core.ts";

const STOP = new Set(
  `a o as os um uma uns umas de do da dos das em no na nos nas por pelo pela pelos pelas para pra com sem sob sobre entre ate até
  e ou mas que se ja já nao não sim mais menos muito muita muitos muitas pouco todo toda todos todas outro outra
  ser estar ter haver foi era sao são esta está estao estão tem têm vai vão pode podem deve devem fica ficam
  seu sua seus suas meu minha nosso nossa ele ela eles elas voce você isso isto esse essa este esta aquele aquela
  como quando onde qual quais quem porque porquê ainda agora hoje ontem amanha amanhã depois antes novo nova novos novas
  primeiro primeira ano anos dia dias semana mes mês veja confira entenda saiba diz afirma revela anuncia anunciado anunciada
  chega chegam ganha ganham traz trazem recebe recebem the and for with from game games jogo jogos`.split(/\s+/),
);

export function keywords(title: string): Set<string> {
  const words = title
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => (w.length >= 3 || /\d/.test(w)) && !STOP.has(w));
  return new Set(words);
}

function similar(a: Set<string>, b: Set<string>) {
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  const jaccard = shared / (a.size + b.size - shared || 1);
  return shared >= 3 || (shared >= 2 && jaccard >= 0.3);
}

export type Topic = {
  key: string;
  title: string; // manchete representativa
  items: RadarItem[];
  sources: string[];
  latest: string;
  section: RadarItem["section"];
};

/** Assuntos cobertos por pelo menos `minSources` fontes diferentes, do mais quente para o menos. */
export function trendingTopics(items: RadarItem[], { minSources = 2, maxAgeHours = 48 } = {}): Topic[] {
  const now = Date.now();
  const recent = items.filter((i) => now - +new Date(i.publishedAt) < maxAgeHours * 3600_000);
  const kw = recent.map((i) => keywords(i.title));

  // union-find
  const parent = recent.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < recent.length; i++)
    for (let j = i + 1; j < recent.length; j++)
      if (recent[i].sourceId !== recent[j].sourceId && similar(kw[i], kw[j])) parent[find(i)] = find(j);

  const groups = new Map<number, RadarItem[]>();
  recent.forEach((it, i) => groups.set(find(i), [...(groups.get(find(i)) ?? []), it]));

  const topics: Topic[] = [];
  for (const group of groups.values()) {
    const sources = [...new Set(group.map((g) => g.sourceName))];
    if (sources.length < minSources) continue;
    const sorted = [...group].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    // seção mais frequente no grupo
    const count = new Map<string, number>();
    for (const g of group) count.set(g.section, (count.get(g.section) ?? 0) + 1);
    const section = [...count.entries()].sort((a, b) => b[1] - a[1])[0][0] as RadarItem["section"];
    // manchete: a com mais palavras-chave em comum com o resto do grupo
    const rep = [...group].sort((a, b) => b.title.length - a.title.length)[0];
    topics.push({ key: sorted[0].id, title: rep.title, items: sorted, sources, latest: sorted[0].publishedAt, section });
  }
  return topics.sort((a, b) => b.sources.length - a.sources.length || +new Date(b.latest) - +new Date(a.latest));
}

/** Outras notícias (de outras fontes) sobre o mesmo assunto de `item`. */
export function relatedCoverage(item: RadarItem, items: RadarItem[], limit = 4): RadarItem[] {
  const k = keywords(item.title);
  return items.filter((i) => i.id !== item.id && i.sourceId !== item.sourceId && similar(k, keywords(i.title))).slice(0, limit);
}

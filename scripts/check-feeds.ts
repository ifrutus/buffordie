// Verifica cada fonte do Radar: qual feed respondeu, quantas notícias e como foram classificadas.
// Uso: node scripts/check-feeds.ts   (Node 22.18+ / 24, roda TypeScript direto)
import { appendFileSync } from "node:fs";
import { defaultHeaders, fetchSource } from "../src/lib/radar/core.ts";
import { sources } from "../src/lib/radar/sources.ts";

const fetcher = (url: string) => fetch(url, { headers: defaultHeaders, signal: AbortSignal.timeout(15000), redirect: "follow" });
const results = await Promise.all(sources.map((s) => fetchSource(s, fetcher)));

const lines = ["| Fonte | Status | Feed | Itens | Seções |", "|---|---|---|---|---|"];
for (const r of results) {
  const bySection: Record<string, number> = {};
  for (const i of r.items) bySection[i.section] = (bySection[i.section] ?? 0) + 1;
  const sec = Object.entries(bySection).map(([k, v]) => `${k}:${v}`).join(" ");
  const ok = r.items.length > 0;
  lines.push(`| ${r.source.name} | ${ok ? "✅" : "❌"} | ${r.feedUrl ?? r.error ?? "-"} | ${r.items.length} | ${sec} |`);
  const msg = ok
    ? `${r.source.name} OK via ${r.feedUrl} — ${r.items.length} itens (${sec}) — ex.: ${r.items.slice(0, 2).map((i) => `[${i.section}] ${i.title}`).join(" / ")}`
    : `${r.source.name} FALHOU — ${r.error ?? "feed sem itens de games"}`;
  console.log(`::${ok ? "notice" : "warning"} title=radar-${r.source.id}::${msg.replace(/\n/g, " ")}`);
}
console.log(lines.join("\n"));
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Radar — fontes\n\n${lines.join("\n")}\n`);

// Diagnóstico temporário de imagens/feeds (roda no GitHub Actions).
import { googleNewsFeed, parseFeed } from "../src/lib/radar/core.ts";
const BROWSER = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36", "accept-language": "pt-BR,pt;q=0.9", accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" };
const get = async (u: string) => { try { const r = await fetch(u, { headers: BROWSER, redirect: "follow", signal: AbortSignal.timeout(15000) }); const t = await r.text(); return { s: r.status, url: r.url, t, server: r.headers.get("server") }; } catch (e) { return { s: 0, url: u, t: "", server: String(e) }; } };
const og = (h: string) => h.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i)?.[1] ?? h.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image/i)?.[1];
for (const u of ["https://maisesports.com.br/feed/", "https://maisesports.com.br/", "https://draft5.gg/", "https://draft5.gg/feed", "https://maisesports.com.br/sitemap_index.xml", "https://draft5.gg/sitemap.xml", "https://draft5.gg/noticias"]) {
  const r = await get(u);
  console.log(`::notice title=fetch::${u} -> ${r.s} server=${r.server} final=${r.url} feed=${/<(rss|feed)\b/i.test(r.t.slice(0, 2000))} og=${og(r.t) ?? "-"} len=${r.t.length} rss-links=${(r.t.match(/application\/(rss|atom)\+xml[^>]*/gi) ?? []).slice(0, 2).join(" ")}`);
}
const gn = await get(googleNewsFeed("draft5.gg"));
const items = parseFeed(gn.t, { id: "d", name: "Draft5", home: "", feeds: [] }, { googleNews: true }).slice(0, 2);
for (const it of items) {
  const r = await get(it.url);
  const m = r.t.match(/data-n-a-sg="([^"]+)"[^>]*data-n-a-ts="([^"]+)"/) ?? r.t.match(/data-n-a-ts="([^"]+)"[^>]*data-n-a-sg="([^"]+)"/);
  console.log(`::notice title=gnews::${it.title.slice(0, 50)} -> ${r.s} final=${r.url.slice(0, 120)} og=${og(r.t) ?? "-"} sig=${m ? "sim" : "nao"} len=${r.t.length}`);
  // descobre o link real pela API batchexecute (mesmo método dos leitores de RSS)
  const id = new URL(it.url).pathname.split("/").pop()!;
  const page = await get(`https://news.google.com/articles/${id}`);
  const sg = page.t.match(/data-n-a-sg="([^"]+)"/)?.[1], ts = page.t.match(/data-n-a-ts="([^"]+)"/)?.[1];
  if (sg && ts) {
    const req = [[["Fbv4je", JSON.stringify(["garturlreq", [["X", "X", ["X", "X"], null, null, 1, 1, "US:en", null, 1, null, null, null, null, null, 0, 1], "X", "X", 1, [1, 1, 1], 1, 1, null, 0, 0, null, 0], id, Number(ts), sg]), null, "generic"]]];
    const res = await fetch("https://news.google.com/_/DotsSplashUi/data/batchexecute", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8", ...BROWSER }, body: "f.req=" + encodeURIComponent(JSON.stringify(req)) });
    const txt = await res.text();
    const real = txt.match(/https?:\\\/\\\/[^"\\]+|https?:\/\/(?!news\.google)[^"\\]+/)?.[0]?.replace(/\\\//g, "/");
    const art = real ? await get(real) : null;
    console.log(`::notice title=gnews-decode::status=${res.status} real=${real ?? "-"} artStatus=${art?.s} og=${art ? og(art.t) ?? "-" : "-"}`);
  } else console.log(`::notice title=gnews-decode::sem assinatura (page ${page.s}, len ${page.t.length})`);
}
const gb = await get("https://www.gameblast.com.br/feeds/posts/default?alt=rss");
console.log(`::notice title=gameblast::${(gb.t.match(/<media:thumbnail[^>]+>/i) ?? ["-"])[0]}`);

// Diagnóstico temporário: sitemaps de notícias do Draft5 e Mais Esports.
const H = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36" };
const get = async (u: string) => { try { const r = await fetch(u, { headers: H, signal: AbortSignal.timeout(15000) }); return { s: r.status, t: await r.text() }; } catch (e) { return { s: 0, t: String(e) }; } };
const show = (t: string) => t.replace(/\s+/g, " ").slice(0, 900);
for (const u of ["https://maisesports.com.br/sitemap_index.xml", "https://draft5.gg/sitemap.xml", "https://maisesports.com.br/news-sitemap.xml", "https://maisesports.com.br/robots.txt", "https://draft5.gg/robots.txt"]) {
  const r = await get(u);
  console.log(`::notice title=sm::${u} -> ${r.s} :: ${show(r.t)}`);
  const locs = [...r.t.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((l) => /news|noticia|post|article/i.test(l)).slice(0, 4);
  for (const l of locs) {
    const c = await get(l);
    console.log(`::notice title=sm-child::${l} -> ${c.s} :: ${show(c.t)}`);
  }
}

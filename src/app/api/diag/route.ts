// TEMPORÁRIO: diagnóstico da resolução do Google Notícias no servidor da Vercel.
import { googleNewsFeed, parseFeed } from "@/lib/radar/core";

export const dynamic = "force-dynamic";

export async function GET() {
  const H = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36", "accept-language": "pt-BR,pt;q=0.9" };
  const out: Record<string, unknown> = {};
  const feed = await fetch(googleNewsFeed("draft5.gg"), { headers: H, cache: "no-store" });
  const xml = await feed.text();
  out.feed = feed.status;
  const item = parseFeed(xml, { id: "d", name: "D", home: "", feeds: [] }, { googleNews: true })[0];
  out.item = item?.url;
  if (!item) return Response.json(out);
  const id = new URL(item.url).pathname.split("/").pop()!;
  const page = await fetch(`https://news.google.com/articles/${id}`, { headers: H, cache: "no-store" });
  const html = await page.text();
  out.page = { status: page.status, url: page.url, len: html.length, sg: /data-n-a-sg/.test(html), consent: /consent\.google/.test(page.url + html.slice(0, 3000)), head: html.slice(0, 200) };
  return Response.json(out);
}

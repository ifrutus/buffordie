/* eslint-disable @next/next/no-img-element -- imagens das matérias (Supabase Storage ou links externos) */
import { Fragment, type ReactNode } from "react";

// Formatação simples para matérias:
//   parágrafos (linha em branco), **negrito**, [links](https://...)
//   ![legenda](https://...imagem)       → imagem com legenda
//   [video](https://...mp4|webm|mov)    → vídeo
//   https://youtube.com/watch?v=...     (sozinho na linha) → player do YouTube
const TOKEN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
const IMAGE_BLOCK = /^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/;
const VIDEO_BLOCK = /^\[(?:video|vídeo)[^\]]*\]\((https?:\/\/[^\s)]+)\)$/i;
const YT = /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})\S*$/;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index} className="font-semibold text-white">{m[1]}</strong>);
    else
      out.push(
        <a key={m.index} href={m[3]} target="_blank" rel="noopener" className="text-acid underline-offset-2 hover:underline">
          {m[2]}
        </a>,
      );
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function block(para: string, key: number): ReactNode {
  const p = para.trim();
  const img = p.match(IMAGE_BLOCK);
  if (img)
    return (
      <figure key={key} className="my-8">
        <img src={img[2]} alt={img[1]} loading="lazy" className="w-full rounded-xl border border-line" />
        {img[1] && !/^legenda da imagem$/i.test(img[1]) && (
          <figcaption className="mt-2 text-center text-sm text-zinc-500">{img[1]}</figcaption>
        )}
      </figure>
    );
  const vid = p.match(VIDEO_BLOCK);
  if (vid)
    return (
      <video key={key} src={vid[1]} controls preload="metadata" playsInline className="my-8 w-full rounded-xl border border-line" />
    );
  const yt = p.match(YT);
  if (yt)
    return (
      <div key={key} className="my-8 aspect-video overflow-hidden rounded-xl border border-line">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${yt[1]}`}
          title="Vídeo do YouTube"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      </div>
    );
  return (
    <p key={key}>
      {p.split("\n").map((line, j) => (
        <Fragment key={j}>
          {j > 0 && <br />}
          {inline(line)}
        </Fragment>
      ))}
    </p>
  );
}

export function RichText({ text }: { text: string }) {
  return <>{text.split(/\n{2,}/).filter((p) => p.trim()).map(block)}</>;
}

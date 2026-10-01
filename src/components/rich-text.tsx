import { Fragment, type ReactNode } from "react";

// Formatação simples para matérias: parágrafos, **negrito** e [links](https://...).
const TOKEN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

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

export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i}>
          {para.split("\n").map((line, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {inline(line)}
            </Fragment>
          ))}
        </p>
      ))}
    </>
  );
}

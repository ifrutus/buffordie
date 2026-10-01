import type { Metadata } from "next";
import Link from "next/link";
import { ARQUIVO } from "./arquivo";
import { runImport } from "./actions";

export const metadata: Metadata = { title: "Importar arquivo", robots: { index: false, follow: false } };
export const maxDuration = 300;

export default async function ImportarPage({ searchParams }: PageProps<"/redacao/importar">) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const ok = one(sp.ok);
  const erro = one(sp.erro);
  const log = one(sp.log);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <Link href="/redacao" className="text-sm text-zinc-500 hover:text-acid">← Redação</Link>
      <h1 className="font-display text-3xl font-bold text-white">Importar o BuffOrDie antigo</h1>
      <p className="text-zinc-400">
        Copia {ARQUIVO.length} matérias do site antigo (buffordie.com.br) com textos, imagens e vídeos, publicadas com a data original e
        você como autor. Rodar de novo só atualiza, não duplica.
      </p>
      {erro && <p className="rounded-md border border-blood/50 bg-blood/10 px-4 py-3 text-sm text-red-200">{erro}</p>}
      {ok && (
        <div className="rounded-md border border-acid/50 bg-acid/10 px-4 py-3 text-sm text-lime-100">
          <p id="resultado">
            {ok} de {one(sp.total)} matérias importadas · {one(sp.imagens)} imagens copiadas.
          </p>
          {log && <pre className="mt-2 whitespace-pre-wrap text-xs text-zinc-300">{log}</pre>}
        </div>
      )}
      <form action={runImport}>
        <button className="rounded-md bg-acid px-6 py-3 font-semibold text-ink hover:brightness-110">Importar agora</button>
      </form>
    </div>
  );
}

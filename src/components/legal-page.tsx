import type { ReactNode } from "react";

// Moldura das páginas institucionais (Sobre, Contato, Privacidade).
export function LegalPage({ kicker, title, intro, children }: { kicker: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <header className="mt-10 border-b border-line pb-6">
        <p className="font-display text-sm uppercase tracking-widest text-acid">{kicker}</p>
        <h1 className="mt-1 font-display text-4xl font-bold text-white">{title}</h1>
        {intro && <p className="mt-3 text-lg text-zinc-400">{intro}</p>}
      </header>
      <div className="mt-8 space-y-5 leading-relaxed text-zinc-300 [&_a]:text-acid [&_a:hover]:underline [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-white [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2 [&_strong]:text-white">
        {children}
      </div>
    </div>
  );
}

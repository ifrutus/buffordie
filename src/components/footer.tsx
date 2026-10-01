import Link from "next/link";
import { Logo } from "./header";
import { sections } from "@/lib/sections";
import { sources } from "@/lib/radar/sources";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-panel">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-zinc-400">
            O hub de games do Brasil, feito por quem joga. Matérias próprias, comunidade e o Radar com as
            notícias dos principais sites de games do país.
          </p>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-white">Seções</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li><Link href="/radar" className="hover:text-acid">Radar</Link></li>
            {sections.map((s) => (
              <li key={s.slug}>
                <Link href={`/secao/${s.slug}`} className="hover:text-acid">{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-white">Fontes do Radar</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            {sources.map((s) => (
              <li key={s.id}>
                <a href={s.home} className="hover:text-acid" rel="noopener noreferrer" target="_blank">{s.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-4 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} BuffOrDie. Notícias do Radar pertencem às respectivas fontes, com link para a matéria original.
      </div>
    </footer>
  );
}

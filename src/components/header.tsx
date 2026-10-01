import Link from "next/link";
import { sections } from "@/lib/sections";
import { UserMenu } from "./user-menu";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2" aria-label="BuffOrDie — início">
      <span className="grid size-8 place-items-center rounded-md bg-acid font-display text-sm font-bold text-ink transition group-hover:rotate-6">
        B/D
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-white">
        BUFF<span className="text-acid">OR</span>DIE
      </span>
    </Link>
  );
}

const nav = [{ href: "/radar", label: "Radar" }, ...sections.map((s) => ({ href: `/secao/${s.slug}`, label: s.name }))];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
        <Logo />
        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Seções">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-panel hover:text-white"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <form action="/busca" className="hidden sm:block" role="search">
            <label htmlFor="busca-topo" className="sr-only">Buscar</label>
            <input
              id="busca-topo"
              name="q"
              placeholder="Buscar jogos…"
              className="w-40 rounded-md border border-line bg-panel px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:w-56 focus:border-acid focus:outline-none md:transition-all"
            />
          </form>
          <UserMenu />
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-line px-4 py-2 lg:hidden" aria-label="Seções (mobile)">
        {[{ href: "/busca", label: "🔍 Buscar" }, ...nav].map((n) => (
          <Link key={n.href} href={n.href} className="shrink-0 rounded-full border border-line px-3 py-1 text-xs text-zinc-300">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

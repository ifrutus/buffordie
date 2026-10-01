import Link from "next/link";
import { categories } from "@/lib/content";

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

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
        <Logo />
        <nav className="hidden flex-1 items-center gap-1 md:flex" aria-label="Seções">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categoria/${c.slug}`}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-panel hover:text-white"
            >
              {c.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/busca"
            className="hidden rounded-md border border-line px-3 py-2 text-sm text-zinc-400 transition hover:text-white sm:block"
          >
            Buscar jogos…
          </Link>
          <Link
            href="/entrar"
            className="rounded-md bg-acid px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            Entrar
          </Link>
        </div>
      </div>
      <nav
        className="flex gap-1 overflow-x-auto border-t border-line px-4 py-2 md:hidden"
        aria-label="Seções (mobile)"
      >
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categoria/${c.slug}`}
            className="shrink-0 rounded-full border border-line px-3 py-1 text-xs text-zinc-300"
          >
            {c.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}

import Link from "next/link";
import { Logo } from "./header";
import { categories } from "@/lib/content";

const social = [
  { name: "YouTube", href: "https://youtube.com" },
  { name: "Instagram", href: "https://instagram.com" },
  { name: "X / Twitter", href: "https://x.com" },
  { name: "Facebook", href: "https://facebook.com" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-panel">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-zinc-400">
            Artigos, gameplays, reviews e e-sports. O hub de games do Brasil, feito por
            quem joga — indie, AAA e mobile.
          </p>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-white">
            Seções
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categoria/${c.slug}`} className="hover:text-acid">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-white">
            Siga
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            {social.map((s) => (
              <li key={s.name}>
                <a href={s.href} className="hover:text-acid" rel="noopener noreferrer">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} BuffOrDie. Todos os direitos reservados.
      </div>
    </footer>
  );
}

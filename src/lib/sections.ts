// Seções editoriais — espelham a tabela public.categories do Supabase.
export type SectionSlug = "noticias" | "games" | "atualizacoes" | "competitivo" | "reviews";

export type Section = {
  slug: SectionSlug;
  name: string;
  tagline: string;
  badge: string; // classes Tailwind do selo
};

export const sections: Section[] = [
  {
    slug: "noticias",
    name: "Notícias",
    tagline: "O que está acontecendo na indústria: anúncios, lançamentos e bastidores.",
    badge: "bg-acid text-ink",
  },
  {
    slug: "games",
    name: "Games",
    tagline: "Guias, listas, trailers, jogos grátis e tudo sobre o que jogar.",
    badge: "bg-sky-400 text-ink",
  },
  {
    slug: "atualizacoes",
    name: "Atualizações",
    tagline: "Patches, temporadas, DLCs e notas de atualização dos seus jogos.",
    badge: "bg-amber-400 text-ink",
  },
  {
    slug: "competitivo",
    name: "Competitivo",
    tagline: "E-sports: CBLOL, CS, Valorant, Free Fire, campeonatos e times brasileiros.",
    badge: "bg-volt text-white",
  },
  {
    slug: "reviews",
    name: "Reviews",
    tagline: "Análises e notas: vale ou não vale o seu tempo (e o seu dinheiro)?",
    badge: "bg-blood text-white",
  },
];

export function getSection(slug: string) {
  return sections.find((s) => s.slug === slug);
}

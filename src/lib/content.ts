// Conteúdo de exemplo enquanto o banco (Prisma) não está conectado.
// Quando o banco entrar, estas funções passam a consultar o Prisma
// mantendo a mesma assinatura — as páginas não precisam mudar.

export type Category = {
  slug: string;
  name: string;
  color: string; // classe Tailwind de cor do selo
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: Category["slug"];
  platforms: string[];
  author: string;
  publishedAt: string; // ISO
  readingMinutes: number;
  likes: number;
  comments: number;
  cover: [string, string]; // gradiente placeholder (de, para)
  score?: number; // nota de review (0–10)
  body: string[];
};

export const categories: Category[] = [
  { slug: "noticias", name: "Notícias", color: "bg-acid text-ink" },
  { slug: "reviews", name: "Reviews", color: "bg-blood text-white" },
  { slug: "esports", name: "E-Sports", color: "bg-volt text-white" },
  { slug: "gameplays", name: "Gameplays", color: "bg-amber-400 text-ink" },
  { slug: "blog", name: "Blog", color: "bg-zinc-200 text-ink" },
];

const lorem = [
  "O cenário brasileiro de games nunca esteve tão aquecido. Estúdios nacionais ganham espaço em vitrines internacionais e a comunidade cresce em todas as plataformas.",
  "Neste texto, reunimos o que já se sabe, o que ainda é rumor e o que realmente importa para quem joga — sem enrolação e com a curadoria da redação BuffOrDie.",
  "Fique de olho nos próximos dias: atualizaremos esta matéria assim que houver novidades oficiais. Comente abaixo o que você achou e marque aquele amigo que precisa saber disso.",
];

export const posts: Post[] = [
  {
    slug: "games-brasileiros-em-destaque-2026",
    title: "Games brasileiros dominam vitrine de independentes em 2026",
    excerpt:
      "Estúdios nacionais emplacam títulos entre os mais desejados das lojas digitais. Veja quem está puxando a fila.",
    category: "noticias",
    platforms: ["PC", "PS5", "Switch"],
    author: "Redação BuffOrDie",
    publishedAt: "2026-09-30T14:00:00-03:00",
    readingMinutes: 5,
    likes: 342,
    comments: 48,
    cover: ["#16a34a", "#0f172a"],
    body: lorem,
  },
  {
    slug: "review-souls-like-do-ano",
    title: "Review: o souls-like do ano pune, mas recompensa cada passo",
    excerpt:
      "Combate preciso, chefes memoráveis e um mundo que esconde segredos em cada canto. Vale cada morte.",
    category: "reviews",
    platforms: ["PS5", "Xbox Series", "PC"],
    author: "Rick",
    publishedAt: "2026-09-29T18:30:00-03:00",
    readingMinutes: 9,
    likes: 811,
    comments: 132,
    cover: ["#dc2626", "#111827"],
    score: 9.2,
    body: lorem,
  },
  {
    slug: "cblol-final-de-temporada",
    title: "CBLoL: o que esperar da final mais disputada dos últimos anos",
    excerpt:
      "Análise dos elencos, do meta atual e das apostas da redação para a grande decisão.",
    category: "esports",
    platforms: ["PC"],
    author: "Redação BuffOrDie",
    publishedAt: "2026-09-28T20:00:00-03:00",
    readingMinutes: 7,
    likes: 276,
    comments: 91,
    cover: ["#7c3aed", "#0b1020"],
    body: lorem,
  },
  {
    slug: "jogos-gratis-do-mes",
    title: "Jogos grátis do mês: PS Plus, Game Pass e Epic Games Store",
    excerpt:
      "A lista completa do que você pode resgatar sem gastar nada — e até quando cada jogo fica disponível.",
    category: "noticias",
    platforms: ["PS5", "Xbox Series", "PC"],
    author: "Redação BuffOrDie",
    publishedAt: "2026-09-27T10:00:00-03:00",
    readingMinutes: 4,
    likes: 1204,
    comments: 76,
    cover: ["#0ea5e9", "#0f172a"],
    body: lorem,
  },
  {
    slug: "gameplay-primeiras-horas-metroidvania",
    title: "Gameplay: as primeiras 2 horas do novo metroidvania",
    excerpt:
      "Sem cortes e sem spoilers do final — veja como o jogo se comporta desde o primeiro minuto.",
    category: "gameplays",
    platforms: ["Switch", "PC"],
    author: "Rick",
    publishedAt: "2026-09-26T16:00:00-03:00",
    readingMinutes: 3,
    likes: 189,
    comments: 22,
    cover: ["#f59e0b", "#1c1917"],
    body: lorem,
  },
  {
    slug: "review-indie-cozy-brasileiro",
    title: "Review: o indie cozy brasileiro que vai roubar seu fim de semana",
    excerpt:
      "Trilha sonora impecável, arte feita à mão e uma história que abraça. Um dos jogos mais charmosos do ano.",
    category: "reviews",
    platforms: ["PC", "Switch"],
    author: "Redação BuffOrDie",
    publishedAt: "2026-09-25T12:00:00-03:00",
    readingMinutes: 6,
    likes: 455,
    comments: 39,
    cover: ["#ec4899", "#1e1b4b"],
    score: 8.6,
    body: lorem,
  },
  {
    slug: "comunidade-sem-preconceito",
    title: "Gamer de verdade não discrimina: por uma comunidade melhor",
    excerpt:
      "Um texto sobre respeito, inclusão e por que o chat tóxico só faz a gente perder partida.",
    category: "blog",
    platforms: [],
    author: "Rick",
    publishedAt: "2026-09-24T09:00:00-03:00",
    readingMinutes: 5,
    likes: 623,
    comments: 104,
    cover: ["#14b8a6", "#042f2e"],
    body: lorem,
  },
  {
    slug: "valorant-champions-recap",
    title: "Valorant Champions: as jogadas que todo mundo está comentando",
    excerpt:
      "Clutches impossíveis, estratégias novas e o desempenho dos brasileiros no torneio.",
    category: "esports",
    platforms: ["PC"],
    author: "Redação BuffOrDie",
    publishedAt: "2026-09-23T22:00:00-03:00",
    readingMinutes: 6,
    likes: 398,
    comments: 57,
    cover: ["#ef4444", "#3b0764"],
    body: lorem,
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCategory(slug: string) {
  return posts.filter((p) => p.category === slug);
}

export function getLatestPosts(limit = posts.length) {
  return [...posts]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, limit);
}

export function getTrendingPosts(limit = 5) {
  return [...posts].sort((a, b) => b.likes - a.likes).slice(0, limit);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso));
}

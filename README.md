# BuffOrDie 🎮

O hub de games do Brasil — notícias, reviews, gameplays, e-sports e comunidade.
Nova versão do [buffordie.com.br](https://buffordie.com.br) (antes em Weebly).

## Stack

- **Next.js 16** (App Router, React 19, Server Components, SSG)
- **Tailwind CSS 4** (tema em `src/app/globals.css`)
- **TypeScript**
- **Prisma + PostgreSQL** (schema pronto em `prisma/schema.prisma`, ainda não conectado)
- Fontes auto-hospedadas via Fontsource (Chakra Petch + Inter)

## Rodando local

```bash
npm install
npm run dev
# http://localhost:3000
```

## Estrutura

```
src/
  app/
    page.tsx                 # Home: destaque, "Em alta", últimas, CTA
    noticias/[slug]/         # Matéria/review com like + comentários
    categoria/[slug]/        # Notícias, Reviews, E-Sports, Gameplays, Blog
    busca/                   # Busca simples (?q=)
    entrar/                  # Login (placeholder)
  components/                # Header, Footer, PostCard, LikeButton, Comments
  lib/content.ts             # Conteúdo de exemplo (troca por Prisma depois)
prisma/schema.prisma         # User, Post, Category, Platform, Comment, Like
```

## Roadmap

- [x] Layout base, home, matéria, categorias, busca
- [x] Likes e comentários (UI, estado local)
- [ ] Banco PostgreSQL (Neon/Supabase) + Prisma
- [ ] Login com Auth.js (Google, Discord, Twitch)
- [ ] Likes/comentários persistidos (Server Actions) + moderação
- [ ] CMS / painel de redação (MDX ou headless CMS)
- [ ] Migrar conteúdos antigos do site atual
- [ ] SEO: sitemap, RSS, OG images dinâmicas
- [ ] Deploy na Vercel + domínio buffordie.com.br

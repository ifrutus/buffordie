# BuffOrDie 🎮

O hub de games do Brasil — notícias, reviews, gameplays, e-sports e comunidade.
Nova versão do [buffordie.com.br](https://buffordie.com.br) (antes em Weebly).

## Stack

- **Next.js 16** (App Router, React 19, Server Components, SSG)
- **Tailwind CSS 4** (tema em `src/app/globals.css`)
- **TypeScript**
- **Supabase** (PostgreSQL + login + armazenamento de imagens) — região São Paulo
- Fontes auto-hospedadas via Fontsource (Chakra Petch + Inter)

## Rodando local

```bash
cp .env.example .env.local   # e preencha a chave
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
  lib/content.ts             # Conteúdo de exemplo (troca pelo Supabase depois)
supabase/migrations/         # SQL do banco: profiles, posts, categories, platforms, comments, likes + RLS
```

## Roadmap

- [x] Layout base, home, matéria, categorias, busca
- [x] Likes e comentários (UI, estado local)
- [x] Banco no Supabase (tabelas, segurança RLS, categorias e plataformas)
- [ ] Ligar o site ao Supabase (supabase-js)
- [ ] Login com Supabase Auth (Google, Discord, Twitch)
- [ ] Likes/comentários persistidos (Server Actions) + moderação
- [ ] CMS / painel de redação (MDX ou headless CMS)
- [ ] Migrar conteúdos antigos do site atual
- [ ] SEO: sitemap, RSS, OG images dinâmicas
- [ ] Deploy na Vercel + domínio buffordie.com.br

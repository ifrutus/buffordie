# BuffOrDie 🎮

O hub de games do Brasil — notícias, games, atualizações, competitivo e reviews, com comunidade (login, curtidas e comentários) e o **Radar**, que reúne as últimas dos principais sites de games do país.

Nova versão do [buffordie.com.br](https://buffordie.com.br).

## Stack

- **Next.js 16** (App Router, React 19, ISR) + **Tailwind CSS 4** + TypeScript
- **Supabase** (São Paulo): PostgreSQL, login (Google, Discord, Twitch e link por e-mail) e segurança por RLS
- Fontes auto-hospedadas (Chakra Petch + Inter)

## Rodando local

```bash
npm install
npm run dev        # http://localhost:3000
```

As chaves públicas do Supabase já vêm como padrão em `src/lib/supabase/env.ts` (veja `.env.example` para sobrescrever). **Nunca** coloque a chave secreta (`sb_secret_…`) no código.

## Seções

| Seção | O que entra |
|---|---|
| Notícias | indústria, anúncios, bastidores |
| Games | guias, listas, trailers, lançamentos, jogos grátis |
| Atualizações | patches, temporadas, DLCs |
| Competitivo | e-sports: CBLOL, CS, Valorant, Free Fire… |
| Reviews | análises e notas |

## Radar de notícias

`src/lib/radar/` lê os feeds RSS das fontes a cada 15 min, classifica cada notícia numa seção por palavras-chave e mostra **título, resumo curto e link para a matéria original** (nunca o texto completo — o conteúdo é das fontes).

- Fontes em `src/lib/radar/sources.ts`: IGN Brasil, Omelete (ex-The Enemy), Voxel, TecMundo, Mais Esports, Draft5, Flow Games, GameBlast, Adrenaline, Jovem Nerd.
- Se o feed de uma fonte muda, o leitor tenta: URLs conhecidas → descoberta na página inicial → Google Notícias filtrado pelo site.
- Filtra páginas de cupom/apostas e, em sites generalistas, só aceita conteúdo de games.
- O workflow **Verificar fontes do Radar** (GitHub Actions) testa todas as fontes a cada mudança e toda segunda-feira. Para rodar local: `node scripts/check-feeds.ts`.

## Banco (Supabase)

- `supabase/migrations/` — SQL aplicado no projeto (tabelas, RLS, seções, matéria de boas-vindas).
- `supabase/tests/rls_test.sql` — teste de segurança: simula usuários e confere que ninguém curte/comenta/edita em nome de outro, nem vira admin sozinho. Tudo é desfeito no final.
- Para dar permissão de redação a alguém: `update profiles set role = 'editor' where username = '…';`

## Estrutura

```
src/
  app/
    page.tsx              # Home: destaque, Radar ao vivo, faixa por seção
    radar/                # Radar completo, filtro por fonte
    secao/[slug]/         # Matérias próprias + Radar da seção
    noticias/[slug]/      # Matéria própria com likes e comentários
    busca/                # Busca em matérias e Radar
    entrar/ auth/         # Login e retorno do login
  components/             # Header, Footer, cards, LikeButton, Comments, UserMenu
  lib/radar/              # Leitor de feeds (core.ts sem dependência do Next)
  lib/supabase/           # Clientes (navegador, servidor, público)
  proxy.ts                # Renova a sessão nas rotas de login
```

## Roadmap

- [x] Layout, seções, busca
- [x] Supabase: banco, RLS, login, likes e comentários
- [x] Radar com 10 fontes brasileiras
- [ ] Ativar Google, Discord e Twitch no Supabase (criar os apps de login)
- [ ] E-mail próprio (SMTP) para o link de acesso chegar a qualquer pessoa
- [x] Deploy na Vercel (publica a cada push no main)
- [ ] Domínio buffordie.com.br na Vercel
- [ ] Painel de redação para publicar matérias próprias
- [ ] SEO: sitemap, RSS próprio, imagens de compartilhamento

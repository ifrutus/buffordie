# Buff or Die 🎮

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

- Cada notícia tem uma página própria no Buff or Die (`/radar/[id]`) com resumo, crédito, botão para a matéria original, curtidas, comentários e "outras fontes falando disso". Essas páginas são `noindex` com canonical apontando para a fonte (o Google credita o original).
- Notícias que chegam pelo Google Notícias têm o link real e a foto oficial (og:image) descobertos e guardados por 7 dias; miniaturas são trocadas pela versão grande.
- O Radar inteiro é montado uma vez a cada 15 min e compartilhado entre as páginas.
- `trending.ts` agrupa notícias de fontes diferentes sobre o mesmo assunto ("Assuntos do momento" na home e pautas da redação).

- Fontes em `src/lib/radar/sources.ts`: IGN Brasil, Omelete (ex-The Enemy), Voxel, TecMundo, Mais Esports, Draft5, Flow Games, GameBlast, Adrenaline, Jovem Nerd.
- Se o feed de uma fonte muda, o leitor tenta: URLs conhecidas → descoberta na página inicial → Google Notícias filtrado pelo site.
- Filtra páginas de cupom/apostas e, em sites generalistas, só aceita conteúdo de games.
- O workflow **Verificar fontes do Radar** (GitHub Actions) testa todas as fontes a cada mudança e toda segunda-feira. Para rodar local: `node scripts/check-feeds.ts`.

## Redação

`/redacao` (só para `author`/`editor`/`admin`): pautas em alta (assuntos que várias fontes estão cobrindo) e formulário para publicar matérias próprias — com links (`[texto](https://...)`) e **negrito**. As fontes da pauta entram automaticamente no fim do texto.

Para liberar alguém: a pessoa entra no site uma vez e depois, no SQL Editor do Supabase:

```sql
update profiles set role = 'editor' where id = (select id from auth.users where email = 'email@dela.com');
```

## Banco (Supabase)

- `supabase/migrations/` — SQL aplicado no projeto (tabelas, RLS, seções, matéria de boas-vindas).
- `supabase/tests/` — testes de segurança (RLS): simulam usuários e conferem que ninguém curte/comenta/edita em nome de outro, nem vira admin sozinho, e que visitantes não veem rascunhos. Tudo é desfeito no final.

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
- [x] Página própria para cada notícia do Radar, com comunidade
- [x] Painel de redação com pautas em alta
- [x] "Assuntos do momento" e "Mais comentadas" na home
- [ ] Upload de imagem de capa (Supabase Storage) e edição de matérias
- [ ] SEO: sitemap, RSS próprio, imagens de compartilhamento

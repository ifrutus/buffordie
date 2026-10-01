-- Novas seções editoriais + autoria livre (matérias da redação sem conta vinculada)

-- Seções: Notícias, Games, Atualizações, Competitivo, Reviews
update public.categories set slug = 'competitivo', name = 'Competitivo' where slug = 'esports';
update public.categories set slug = 'games', name = 'Games' where slug = 'gameplays';
update public.categories set slug = 'atualizacoes', name = 'Atualizações' where slug = 'blog';

alter table public.categories add column if not exists position smallint not null default 0;
update public.categories set position = case slug
  when 'noticias' then 1 when 'games' then 2 when 'atualizacoes' then 3
  when 'competitivo' then 4 when 'reviews' then 5 else 9 end;

-- Matérias podem ser assinadas pela "Redação" sem um usuário vinculado
alter table public.posts alter column author_id drop not null;
alter table public.posts add column if not exists author_name text not null default 'Redação BuffOrDie';

-- Primeira matéria própria
insert into public.posts (slug, title, excerpt, content, status, published_at, reading_minutes, category_id, tags)
select
  'bem-vindo-ao-novo-buffordie',
  'Bem-vindo ao novo BuffOrDie',
  'O site foi reconstruído do zero: mais rápido, com login, curtidas, comentários e um radar com as notícias dos principais sites de games do Brasil.',
  'O BuffOrDie voltou de cara nova. Depois de anos no ar, o site foi reconstruído do zero para virar o que sempre quisemos que ele fosse: um ponto de encontro de quem joga no Brasil.

Agora você pode criar sua conta, curtir e comentar as matérias. E no Radar você encontra, num lugar só, as últimas notícias dos principais sites de games do país — sempre com o crédito e o link para a matéria original.

As seções estão organizadas em Notícias, Games, Atualizações, Competitivo e Reviews. Conta pra gente nos comentários o que você quer ver por aqui.',
  'published', now(), 2,
  (select id from public.categories where slug = 'noticias'),
  array['buffordie', 'comunidade']
where not exists (select 1 from public.posts where slug = 'bem-vindo-ao-novo-buffordie');

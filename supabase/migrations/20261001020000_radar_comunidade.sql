-- Curtidas e comentários nas notícias do Radar (item_id = id estável gerado a partir do link da notícia)

create table public.radar_likes (
  item_id text not null check (char_length(item_id) between 3 and 64),
  user_id uuid not null references public.profiles (id) on delete cascade default auth.uid(),
  created_at timestamptz not null default now(),
  primary key (item_id, user_id)
);

create table public.radar_comments (
  id uuid primary key default gen_random_uuid(),
  item_id text not null check (char_length(item_id) between 3 and 64),
  author_id uuid not null references public.profiles (id) on delete cascade,
  parent_id uuid references public.radar_comments (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index radar_comments_item_idx on public.radar_comments (item_id, created_at desc);

alter table public.radar_likes enable row level security;
alter table public.radar_comments enable row level security;

create policy "radar likes públicos" on public.radar_likes for select using (true);
create policy "radar curtir" on public.radar_likes for insert to authenticated with check (user_id = auth.uid());
create policy "radar descurtir" on public.radar_likes for delete to authenticated using (user_id = auth.uid());

create policy "radar comentários visíveis" on public.radar_comments for select
  using (not hidden or author_id = auth.uid() or public.is_staff());
create policy "radar comentar" on public.radar_comments for insert to authenticated
  with check (author_id = auth.uid() and hidden = false);
create policy "radar apagar próprio comentário" on public.radar_comments for delete to authenticated
  using (author_id = auth.uid() or public.is_staff());
create policy "radar moderar comentários" on public.radar_comments for update to authenticated
  using (public.is_staff());

-- Discussões mais ativas dos últimos 7 dias (matérias próprias + Radar)
create or replace view public.hot_discussions with (security_invoker = true) as
select kind, target_id, sum(comments)::int as comments, sum(likes)::int as likes,
       sum(comments) * 3 + sum(likes) as score
from (
  select 'post' as kind, post_id::text as target_id, 1 as comments, 0 as likes
    from public.comments where not hidden and created_at > now() - interval '7 days'
  union all
  select 'post', post_id::text, 0, 1 from public.likes where created_at > now() - interval '7 days'
  union all
  select 'radar', item_id, 1, 0 from public.radar_comments where not hidden and created_at > now() - interval '7 days'
  union all
  select 'radar', item_id, 0, 1 from public.radar_likes where created_at > now() - interval '7 days'
) t
group by kind, target_id;

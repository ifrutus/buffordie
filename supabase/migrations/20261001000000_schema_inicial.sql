-- BuffOrDie — schema inicial (Supabase / PostgreSQL)
-- Usuários vêm do Supabase Auth (auth.users); "profiles" guarda os dados públicos.

-- ========== Tabelas ==========

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null check (char_length(username) between 3 and 30),
  display_name text,
  avatar_url text,
  role text not null default 'reader' check (role in ('reader', 'author', 'editor', 'admin')),
  created_at timestamptz not null default now()
);

create table public.categories (
  id smallint generated always as identity primary key,
  slug text unique not null,
  name text not null
);

create table public.platforms (
  id smallint generated always as identity primary key,
  slug text unique not null,
  name text not null
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  content text not null default '', -- Markdown
  cover_url text,
  score numeric(3, 1) check (score between 0 and 10), -- nota de review
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  published_at timestamptz,
  reading_minutes smallint not null default 3,
  tags text[] not null default '{}',
  author_id uuid not null references public.profiles (id),
  category_id smallint not null references public.categories (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_published_idx on public.posts (status, published_at desc);
create index posts_category_idx on public.posts (category_id);

create table public.post_platforms (
  post_id uuid references public.posts (id) on delete cascade,
  platform_id smallint references public.platforms (id) on delete cascade,
  primary key (post_id, platform_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  parent_id uuid references public.comments (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  hidden boolean not null default false, -- moderação
  created_at timestamptz not null default now()
);
create index comments_post_idx on public.comments (post_id, created_at desc);

create table public.likes (
  post_id uuid references public.posts (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete cascade default auth.uid(),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id) -- 1 like por usuário por post
);

-- ========== Helpers ==========

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('author', 'editor', 'admin')
  );
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger posts_updated_at before update on public.posts
  for each row execute function public.touch_updated_at();

-- Cria o profile automaticamente quando alguém se cadastra
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  base text := coalesce(
    new.raw_user_meta_data ->> 'user_name',
    new.raw_user_meta_data ->> 'preferred_username',
    split_part(new.email, '@', 1),
    'gamer'
  );
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    left(regexp_replace(lower(base), '[^a-z0-9_]', '', 'g'), 20) || '_' || left(new.id::text, 4),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', base),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Contadores para listagens (respeita RLS de quem consulta)
create or replace view public.post_stats with (security_invoker = true) as
select
  p.id as post_id,
  (select count(*) from public.likes l where l.post_id = p.id) as likes,
  (select count(*) from public.comments c where c.post_id = p.id and not c.hidden) as comments
from public.posts p;

-- ========== Segurança (RLS) ==========

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.platforms enable row level security;
alter table public.posts enable row level security;
alter table public.post_platforms enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;

-- Leitura pública
create policy "perfis públicos" on public.profiles for select using (true);
create policy "categorias públicas" on public.categories for select using (true);
create policy "plataformas públicas" on public.platforms for select using (true);
create policy "posts publicados" on public.posts for select
  using (status = 'published' and published_at <= now() or public.is_staff());
create policy "plataformas dos posts" on public.post_platforms for select using (true);
create policy "comentários visíveis" on public.comments for select
  using (not hidden or author_id = auth.uid() or public.is_staff());
create policy "likes públicos" on public.likes for select using (true);

-- Usuário edita só o próprio perfil (sem poder mudar o próprio cargo)
create policy "editar próprio perfil" on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- Likes: cada um curte/descurte por si
create policy "curtir" on public.likes for insert to authenticated with check (user_id = auth.uid());
create policy "descurtir" on public.likes for delete to authenticated using (user_id = auth.uid());

-- Comentários: logado comenta; autor apaga o seu; staff modera
create policy "comentar" on public.comments for insert to authenticated
  with check (author_id = auth.uid() and hidden = false);
create policy "apagar próprio comentário" on public.comments for delete to authenticated
  using (author_id = auth.uid() or public.is_staff());
create policy "moderar comentários" on public.comments for update to authenticated
  using (public.is_staff());

-- Redação (author/editor/admin) gerencia posts
create policy "redação cria posts" on public.posts for insert to authenticated with check (public.is_staff());
create policy "redação edita posts" on public.posts for update to authenticated using (public.is_staff());
create policy "redação apaga posts" on public.posts for delete to authenticated using (public.is_staff());
create policy "redação plataformas" on public.post_platforms for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- ========== Dados iniciais ==========

insert into public.categories (slug, name) values
  ('noticias', 'Notícias'),
  ('reviews', 'Reviews'),
  ('esports', 'E-Sports'),
  ('gameplays', 'Gameplays'),
  ('blog', 'Blog');

insert into public.platforms (slug, name) values
  ('pc', 'PC'),
  ('ps5', 'PS5'),
  ('xbox-series', 'Xbox Series'),
  ('switch', 'Switch'),
  ('mobile', 'Mobile');

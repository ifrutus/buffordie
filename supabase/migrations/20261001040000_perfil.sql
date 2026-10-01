-- Perfil: bio, nome de usuário escolhido no cadastro, avatares

alter table public.profiles add column if not exists bio text check (char_length(bio) <= 300);

-- Nome de usuário: minúsculas, números, _ e . (3 a 30)
update public.profiles set username = regexp_replace(lower(username), '[^a-z0-9_.]', '', 'g') where username !~ '^[a-z0-9_.]{3,30}$';
alter table public.profiles drop constraint if exists profiles_username_format;
alter table public.profiles add constraint profiles_username_format check (username ~ '^[a-z0-9_.]{3,30}$');

-- Cadastro: usa o nome de usuário escolhido (se válido e livre); senão gera um automático
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  wanted text := lower(coalesce(new.raw_user_meta_data ->> 'username', ''));
  base text := coalesce(
    new.raw_user_meta_data ->> 'user_name',
    new.raw_user_meta_data ->> 'preferred_username',
    split_part(new.email, '@', 1),
    'gamer'
  );
  uname text;
begin
  if wanted ~ '^[a-z0-9_.]{3,30}$' and not exists (select 1 from public.profiles where username = wanted) then
    uname := wanted;
  else
    uname := left(regexp_replace(lower(base), '[^a-z0-9_]', '', 'g'), 20) || '_' || left(new.id::text, 4);
    if uname !~ '^[a-z0-9_.]{3,30}$' then uname := 'gamer_' || left(new.id::text, 8); end if;
  end if;
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    uname,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', wanted, base),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

-- Disponibilidade de nome de usuário (sem expor dados): true se livre
create or replace function public.username_available(u text)
returns boolean language sql stable security definer set search_path = '' as $$
  select lower(u) ~ '^[a-z0-9_.]{3,30}$' and not exists (select 1 from public.profiles where username = lower(u));
$$;
grant execute on function public.username_available(text) to anon, authenticated;

-- Avatares: cada usuário só mexe na própria pasta (avatares/<id do usuário>/...)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatares', 'avatares', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "avatares: leitura" on storage.objects for select using (bucket_id = 'avatares');
create policy "avatares: envia o próprio" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatares: troca o próprio" on storage.objects for update to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatares: apaga o próprio" on storage.objects for delete to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);

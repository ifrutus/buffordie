-- Mídia da redação: imagens e vídeos das matérias (Supabase Storage)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'midia', 'midia', true, 52428800, -- 50 MB (limite do plano grátis)
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update
  set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Leitura pública (bucket público); só a redação envia, troca e apaga.
create policy "midia: redação envia" on storage.objects for insert to authenticated
  with check (bucket_id = 'midia' and public.is_staff());
create policy "midia: redação atualiza" on storage.objects for update to authenticated
  using (bucket_id = 'midia' and public.is_staff());
create policy "midia: redação apaga" on storage.objects for delete to authenticated
  using (bucket_id = 'midia' and public.is_staff());
create policy "midia: leitura" on storage.objects for select
  using (bucket_id = 'midia');

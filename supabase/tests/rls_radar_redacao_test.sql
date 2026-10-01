-- Teste de RLS: Radar (curtidas/comentários), redação e visitantes. Tudo é desfeito no final.
do $$
declare
  u1 uuid := gen_random_uuid(); u2 uuid := gen_random_uuid(); ed uuid := gen_random_uuid();
  cid uuid; n int; report text := '';
begin
  insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at) values
    (u1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'r1@buffordie.test', '{}', now(), now()),
    (u2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'r2@buffordie.test', '{}', now(), now()),
    (ed, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ed@buffordie.test', '{}', now(), now());
  update public.profiles set role = 'editor' where id = ed;

  perform set_config('request.jwt.claims', json_build_object('sub', u1, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  insert into public.radar_likes (item_id, user_id) values ('ign-teste', u1); report := report || 'radar curtir: ok; ';
  begin insert into public.radar_likes (item_id, user_id) values ('ign-teste', u2); report := report || 'curtir por outro: FALHA; ';
  exception when insufficient_privilege then report := report || 'curtir por outro bloqueado: ok; '; end;
  insert into public.radar_comments (item_id, author_id, body) values ('ign-teste', u1, 'bom demais') returning id into cid; report := report || 'radar comentar: ok; ';
  begin insert into public.radar_comments (item_id, author_id, body) values ('ign-teste', u2, 'fake'); report := report || 'comentar por outro: FALHA; ';
  exception when insufficient_privilege then report := report || 'comentar por outro bloqueado: ok; '; end;
  select comments into n from public.hot_discussions where kind = 'radar' and target_id = 'ign-teste';
  report := report || format('mais comentadas conta: %s; ', n);
  begin insert into public.posts (slug, title, category_id) values ('x-teste', 'Leitor tentando publicar', 1); report := report || 'leitor publicar: FALHA; ';
  exception when insufficient_privilege then report := report || 'leitor publicar bloqueado: ok; '; end;

  perform set_config('request.jwt.claims', json_build_object('sub', u2, 'role', 'authenticated')::text, true);
  delete from public.radar_comments where id = cid; get diagnostics n = row_count;
  report := report || format('apagar comentário alheio: %s; ', case when n = 0 then 'bloqueado ok' else 'FALHA' end);

  perform set_config('request.jwt.claims', json_build_object('sub', ed, 'role', 'authenticated')::text, true);
  insert into public.posts (slug, title, content, category_id, author_id, status, published_at)
    values ('teste-editor', 'Matéria do editor de teste', repeat('texto ', 50), 1, ed, 'draft', null);
  report := report || 'editor publicar: ok; ';
  select count(*) into n from public.posts where slug = 'teste-editor';
  report := report || format('editor vê rascunho: %s; ', case when n = 1 then 'ok' else 'FALHA' end);
  update public.radar_comments set hidden = true where id = cid; get diagnostics n = row_count;
  report := report || format('editor modera comentário: %s; ', case when n = 1 then 'ok' else 'FALHA' end);

  execute 'set local role anon';
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  select count(*) into n from public.posts where slug = 'teste-editor';
  report := report || format('visitante vê rascunho: %s; ', case when n = 0 then 'não (ok)' else 'FALHA' end);
  select count(*) into n from public.radar_comments where id = cid;
  report := report || format('visitante vê comentário oculto: %s', case when n = 0 then 'não (ok)' else 'FALHA' end);

  raise exception 'RESULTADO (tudo desfeito) => %', report;
end $$;

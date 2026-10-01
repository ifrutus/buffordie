-- Teste de RLS com usuários simulados. Tudo é desfeito no final (exceção proposital).
do $$
declare
  u1 uuid := gen_random_uuid();
  u2 uuid := gen_random_uuid();
  pid uuid := (select id from public.posts where slug = 'bem-vindo-ao-novo-buffordie');
  cid uuid;
  n int;
  report text := '';
begin
  insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at)
  values (u1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'teste1@buffordie.test', '{"full_name":"Teste Um","user_name":"Teste.Um"}', now(), now()),
         (u2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'teste2@buffordie.test', '{}', now(), now());
  select count(*) into n from public.profiles where id in (u1, u2);
  report := report || format('perfis criados pelo trigger: %s/2; ', n);
  report := report || format('username gerado: %s; ', (select username from public.profiles where id = u1));

  -- age como u1
  perform set_config('request.jwt.claims', json_build_object('sub', u1, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';

  insert into public.likes (post_id, user_id) values (pid, u1);
  report := report || 'u1 curtiu: ok; ';
  begin insert into public.likes (post_id, user_id) values (pid, u1); report := report || 'like duplicado: FALHA (aceitou); ';
  exception when unique_violation then report := report || 'like duplicado bloqueado: ok; '; end;
  begin insert into public.likes (post_id, user_id) values (pid, u2); report := report || 'curtir em nome de outro: FALHA (aceitou); ';
  exception when insufficient_privilege then report := report || 'curtir em nome de outro bloqueado: ok; '; end;

  insert into public.comments (post_id, author_id, body) values (pid, u1, 'primeiro!') returning id into cid;
  report := report || 'u1 comentou: ok; ';
  begin insert into public.comments (post_id, author_id, body) values (pid, u2, 'fake'); report := report || 'comentar como outro: FALHA (aceitou); ';
  exception when insufficient_privilege then report := report || 'comentar como outro bloqueado: ok; '; end;

  begin update public.profiles set role = 'admin' where id = u1; report := report || 'virar admin sozinho: FALHA (aceitou); ';
  exception when insufficient_privilege then report := report || 'virar admin sozinho bloqueado: ok; '; end;
  update public.profiles set display_name = 'Novo Nome' where id = u1;
  report := report || format('editar o próprio nome: %s; ', case when (select display_name from public.profiles where id = u1) = 'Novo Nome' then 'ok' else 'FALHA' end);
  update public.profiles set display_name = 'Hack' where id = u2;
  get diagnostics n = row_count;
  report := report || format('editar perfil de outro: %s; ', case when n = 0 then 'bloqueado ok' else 'FALHA' end);

  begin insert into public.posts (slug, title, category_id) values ('hack', 'x', 1); report := report || 'leitor criar matéria: FALHA (aceitou); ';
  exception when insufficient_privilege then report := report || 'leitor criar matéria bloqueado: ok; '; end;

  -- age como u2: não pode apagar comentário de u1
  perform set_config('request.jwt.claims', json_build_object('sub', u2, 'role', 'authenticated')::text, true);
  delete from public.comments where id = cid;
  get diagnostics n = row_count;
  report := report || format('u2 apagar comentário de u1: %s; ', case when n = 0 then 'bloqueado ok' else 'FALHA' end);
  delete from public.likes where post_id = pid and user_id = u1;
  get diagnostics n = row_count;
  report := report || format('u2 descurtir por u1: %s; ', case when n = 0 then 'bloqueado ok' else 'FALHA' end);

  -- volta a u1: apaga o próprio comentário e descurte
  perform set_config('request.jwt.claims', json_build_object('sub', u1, 'role', 'authenticated')::text, true);
  select likes into n from public.post_stats where post_id = pid;
  report := report || format('contador de likes visto: %s; ', n);
  delete from public.comments where id = cid;
  get diagnostics n = row_count;
  report := report || format('u1 apagar próprio comentário: %s; ', case when n = 1 then 'ok' else 'FALHA' end);
  delete from public.likes where post_id = pid and user_id = u1;
  get diagnostics n = row_count;
  report := report || format('u1 descurtir: %s', case when n = 1 then 'ok' else 'FALHA' end);

  raise exception 'RESULTADO (tudo desfeito) => %', report;
end $$;

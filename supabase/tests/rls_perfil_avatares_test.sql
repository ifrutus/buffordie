-- Teste de RLS: perfil (bio/usuário) e avatares. Tudo é desfeito no final.
do $$
declare
  u1 uuid := gen_random_uuid(); u2 uuid := gen_random_uuid(); n int; report text := '';
begin
  insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at) values
    (u1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'p1@buffordie.test', '{"username":"teste_escolhido"}', now(), now()),
    (u2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'p2@buffordie.test', '{"username":"teste_escolhido"}', now(), now());
  report := report || format('usuário escolhido: %s; ', (select username from public.profiles where id = u1));
  report := report || format('repetido vira automático: %s; ', (select username from public.profiles where id = u2));
  report := report || format('disponível(teste_escolhido)=%s, disponível(novo_nick)=%s, disponível(Inválido!)=%s; ',
    public.username_available('teste_escolhido'), public.username_available('novo_nick'), public.username_available('Inválido!'));

  perform set_config('request.jwt.claims', json_build_object('sub', u1, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  update public.profiles set bio = 'Jogo de tudo', display_name = 'Teste' where id = u1;
  report := report || format('editar bio: %s; ', case when (select bio from public.profiles where id = u1) = 'Jogo de tudo' then 'ok' else 'FALHA' end);
  begin update public.profiles set bio = repeat('x', 301) where id = u1; report := report || 'bio > 300: FALHA; ';
  exception when check_violation then report := report || 'bio > 300 bloqueada: ok; '; end;
  begin update public.profiles set username = 'Com Espaço' where id = u1; report := report || 'usuário inválido: FALHA; ';
  exception when check_violation then report := report || 'usuário inválido bloqueado: ok; '; end;
  update public.profiles set bio = 'hack' where id = u2; get diagnostics n = row_count;
  report := report || format('editar perfil alheio: %s; ', case when n = 0 then 'bloqueado ok' else 'FALHA' end);

  insert into storage.objects (bucket_id, name, owner) values ('avatares', u1::text || '/a.webp', u1);
  report := report || 'avatar na própria pasta: ok; ';
  begin insert into storage.objects (bucket_id, name, owner) values ('avatares', u2::text || '/a.webp', u1); report := report || 'avatar na pasta alheia: FALHA; ';
  exception when insufficient_privilege then report := report || 'avatar na pasta alheia bloqueado: ok; '; end;
  begin insert into storage.objects (bucket_id, name, owner) values ('midia', 'x/y.webp', u1); report := report || 'leitor enviar mídia da redação: FALHA; ';
  exception when insufficient_privilege then report := report || 'leitor enviar mídia da redação bloqueado: ok'; end;

  raise exception 'RESULTADO (tudo desfeito) => %', report;
end $$;

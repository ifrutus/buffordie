-- Nome oficial: "Buff or Die" (com espaços).
alter table public.posts alter column author_name set default 'Redação Buff or Die';
update public.posts set
  title       = replace(title, 'BuffOrDie', 'Buff or Die'),
  excerpt     = replace(excerpt, 'BuffOrDie', 'Buff or Die'),
  content     = replace(content, 'BuffOrDie', 'Buff or Die'),
  author_name = replace(author_name, 'BuffOrDie', 'Buff or Die')
where title like '%BuffOrDie%' or excerpt like '%BuffOrDie%' or content like '%BuffOrDie%' or author_name like '%BuffOrDie%';

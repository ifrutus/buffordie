// Valores públicos (seguros no navegador — o banco é protegido por RLS).
// Os padrões apontam para o projeto buffordie; sobrescreva via .env.local / Vercel.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://znihghmusgspwezlhiop.supabase.co";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_nIYMBHcbYj2IMuaq1EQX1w_ASnELT1O";

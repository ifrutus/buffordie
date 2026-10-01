"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase/env";
import { supabaseServer } from "@/lib/supabase/server";

type Provider = "google" | "discord" | "twitch";
const PROVIDERS: Provider[] = ["google", "discord", "twitch"];

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Só aceita caminhos internos (evita redirecionar para outro site). */
function safeNext(v: FormDataEntryValue | null) {
  const s = typeof v === "string" ? v : "/";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/";
}

const back = (modo: string, next: string, erro: string) =>
  redirect(`/entrar?modo=${modo}&erro=${encodeURIComponent(erro)}&next=${encodeURIComponent(next)}`);

/** Cliente sem sessão, fluxo "implícito": links de e-mail funcionam em qualquer navegador/aparelho. */
const implicitClient = () =>
  createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { flowType: "implicit", persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signInWithProvider(formData: FormData) {
  const provider = formData.get("provider") as Provider;
  if (!PROVIDERS.includes(provider)) redirect("/entrar?erro=provedor");
  const next = safeNext(formData.get("next"));
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${await origin()}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error || !data.url) back("entrar", next, error?.message ?? "oauth");
  redirect(data.url!);
}

export async function signInWithPassword(formData: FormData) {
  const next = safeNext(formData.get("next"));
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!EMAIL.test(email) || !password) back("entrar", next, "Preencha e-mail e senha.");
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    back(
      "entrar",
      next,
      /invalid login/i.test(error.message)
        ? "E-mail ou senha incorretos. Se você sempre entrou pelo link do e-mail, use “Esqueci minha senha” para criar uma."
        : /not confirmed/i.test(error.message)
          ? "Confirme seu e-mail antes de entrar."
          : error.message,
    );
  }
  redirect(next);
}

export async function signUp(formData: FormData) {
  const next = safeNext(formData.get("next"));
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!/^[a-z0-9_.]{3,30}$/.test(username))
    back("cadastro", next, "Nome de usuário: 3 a 30 caracteres, só letras minúsculas, números, _ e ponto.");
  if (!EMAIL.test(email)) back("cadastro", next, "Digite um e-mail válido.");
  if (password.length < 8) back("cadastro", next, "A senha precisa ter pelo menos 8 caracteres.");

  const supabase = await supabaseServer();
  const { data: free } = await supabase.rpc("username_available", { u: username });
  if (free === false) back("cadastro", next, `O nome de usuário @${username} já está em uso.`);

  // Fluxo implícito: o link de confirmação funciona em qualquer navegador/aparelho.
  const { data, error } = await implicitClient().auth.signUp({
    email,
    password,
    options: {
      data: { username, display_name: username },
      emailRedirectTo: `${await origin()}/auth/confirmar?next=${encodeURIComponent("/perfil?novo=1")}`,
    },
  });
  if (error) {
    back(
      "cadastro",
      next,
      /already registered|already exists/i.test(error.message)
        ? "Esse e-mail já tem conta. Entre com sua senha ou use “Esqueci minha senha”."
        : /password/i.test(error.message)
          ? "Senha fraca: use pelo menos 8 caracteres, misturando letras e números."
          : error.message,
    );
  }
  // Se a confirmação de e-mail estiver desligada no Supabase, a conta já nasce logada.
  if (data.session) {
    await supabase.auth.setSession({ access_token: data.session.access_token, refresh_token: data.session.refresh_token });
    redirect("/perfil?novo=1");
  }
  redirect(`/entrar?modo=entrar&enviado=confirmar&next=${encodeURIComponent(next)}`);
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNext(formData.get("next"));
  if (!EMAIL.test(email)) back("link", next, "Digite um e-mail válido.");
  const { error } = await implicitClient().auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${await origin()}/auth/confirmar?next=${encodeURIComponent(next)}`, shouldCreateUser: true },
  });
  if (error) back("link", next, error.message);
  redirect(`/entrar?modo=link&enviado=1&next=${encodeURIComponent(next)}`);
}

export async function resetPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL.test(email)) back("senha", "/", "Digite um e-mail válido.");
  const { error } = await implicitClient().auth.resetPasswordForEmail(email, {
    redirectTo: `${await origin()}/auth/confirmar?next=${encodeURIComponent("/perfil?senha=1")}`,
  });
  if (error) back("senha", "/", error.message);
  redirect("/entrar?modo=senha&enviado=1");
}

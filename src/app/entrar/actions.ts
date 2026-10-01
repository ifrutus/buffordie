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

export async function signInWithProvider(formData: FormData) {
  const provider = formData.get("provider") as Provider;
  if (!PROVIDERS.includes(provider)) redirect("/entrar?erro=provedor");
  const next = safeNext(formData.get("next"));
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${await origin()}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error || !data.url) redirect(`/entrar?erro=${encodeURIComponent(error?.message ?? "oauth")}&next=${encodeURIComponent(next)}`);
  redirect(data.url);
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const next = safeNext(formData.get("next"));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect(`/entrar?erro=email&next=${encodeURIComponent(next)}`);
  // Fluxo "implícito": o link do e-mail já traz a sessão, então funciona em qualquer navegador/aparelho
  // (o fluxo PKCE padrão só funciona no mesmo navegador que pediu o link).
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { flowType: "implicit", persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${await origin()}/auth/confirmar?next=${encodeURIComponent(next)}` },
  });
  if (error) redirect(`/entrar?erro=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  redirect(`/entrar?enviado=1&next=${encodeURIComponent(next)}`);
}

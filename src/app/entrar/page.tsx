import type { Metadata } from "next";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase/env";
import { signInWithEmail, signInWithProvider } from "./actions";

/** Quais logins sociais estão ativados no Supabase (Authentication → Sign In / Providers). */
async function enabledProviders(): Promise<Record<string, boolean>> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: SUPABASE_KEY },
      next: { revalidate: 300 },
    });
    return res.ok ? ((await res.json()).external ?? {}) : {};
  } catch {
    return {};
  }
}

export const metadata: Metadata = { title: "Entrar" };

const providers = [
  { id: "google", label: "Google", style: "bg-white text-ink hover:bg-zinc-200" },
  { id: "discord", label: "Discord", style: "bg-[#5865F2] text-white hover:brightness-110" },
  { id: "twitch", label: "Twitch", style: "bg-[#9146FF] text-white hover:brightness-110" },
] as const;

const ERRORS: Record<string, string> = {
  email: "Digite um e-mail válido.",
  provedor: "Forma de login inválida.",
  callback: "O link expirou ou já foi usado. Tente de novo.",
};

export default async function SignInPage({ searchParams }: PageProps<"/entrar">) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const next = one(sp.next) ?? "/";
  const erro = one(sp.erro);
  const enviado = one(sp.enviado);
  const enabled = await enabledProviders();

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-white">Entre pro squad</h1>
      <p className="mt-2 text-zinc-400">Curta, comente e participe da comunidade BuffOrDie.</p>

      {erro && (
        <p className="mt-6 rounded-md border border-blood/50 bg-blood/10 px-4 py-3 text-sm text-red-200">
          {ERRORS[erro] ?? `Não foi possível entrar: ${erro}`}
        </p>
      )}
      {enviado && (
        <p className="mt-6 rounded-md border border-acid/50 bg-acid/10 px-4 py-3 text-sm text-lime-100">
          Pronto! Enviamos um link de acesso para o seu e-mail. Abra-o neste mesmo navegador.
        </p>
      )}

      <form action={signInWithProvider} className="mt-8 space-y-3">
        <input type="hidden" name="next" value={next} />
        {providers.map((p) =>
          enabled[p.id] ? (
            <button
              key={p.id}
              name="provider"
              value={p.id}
              className={`w-full rounded-md px-4 py-3 text-left font-semibold transition ${p.style}`}
            >
              Continuar com {p.label}
            </button>
          ) : (
            <div
              key={p.id}
              className="flex w-full items-center justify-between rounded-md border border-line bg-panel px-4 py-3 font-semibold text-zinc-500"
            >
              Continuar com {p.label} <span className="text-xs font-normal">em breve</span>
            </div>
          ),
        )}
      </form>

      <div className="my-8 flex items-center gap-4 text-xs uppercase tracking-widest text-zinc-600">
        <span className="h-px flex-1 bg-line" /> ou por e-mail <span className="h-px flex-1 bg-line" />
      </div>

      <form action={signInWithEmail} className="space-y-3">
        <input type="hidden" name="next" value={next} />
        <label htmlFor="email" className="sr-only">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          className="w-full rounded-md border border-line bg-panel px-4 py-3 text-white placeholder:text-zinc-600 focus:border-acid focus:outline-none"
        />
        <button className="w-full rounded-md bg-acid px-4 py-3 font-semibold text-ink hover:brightness-110">
          Receber link de acesso
        </button>
        <p className="text-xs text-zinc-500">Sem senha: você recebe um link e entra com um clique.</p>
      </form>
    </div>
  );
}

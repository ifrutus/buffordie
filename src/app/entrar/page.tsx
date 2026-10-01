import type { Metadata } from "next";
import Link from "next/link";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase/env";
import { resetPassword, signInWithEmail, signInWithPassword, signInWithProvider, signUp } from "./actions";

export const metadata: Metadata = { title: "Entrar" };

/** Quais logins sociais estão ativados no Supabase (Authentication → Sign In / Providers). */
async function enabledProviders(): Promise<Record<string, boolean>> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_KEY }, next: { revalidate: 300 } });
    return res.ok ? ((await res.json()).external ?? {}) : {};
  } catch {
    return {};
  }
}

const providers = [
  { id: "google", label: "Google", style: "bg-white text-ink hover:bg-zinc-200" },
  { id: "discord", label: "Discord", style: "bg-[#5865F2] text-white hover:brightness-110" },
  { id: "twitch", label: "Twitch", style: "bg-[#9146FF] text-white hover:brightness-110" },
] as const;

/** Traduz as mensagens do Supabase Auth que podem aparecer para o leitor. */
function translate(msg: string) {
  if (msg === "callback") return "O link expirou ou já foi usado. Tente de novo.";
  if (msg === "provedor") return "Forma de login inválida.";
  const wait = msg.match(/after (\d+) seconds?/i);
  if (wait) return `Já enviamos um link há pouco. Confira seu e-mail (e o spam) ou aguarde ${wait[1]} segundos.`;
  if (/rate limit|too many/i.test(msg))
    return "Muitos e-mails enviados em pouco tempo. Entre com e-mail e senha, ou tente o link de novo em alguns minutos.";
  return msg;
}

const input =
  "w-full rounded-md border border-line bg-panel px-4 py-3 text-white placeholder:text-zinc-600 focus:border-acid focus:outline-none";
const primary = "w-full rounded-md bg-acid px-4 py-3 font-semibold text-ink hover:brightness-110";

const MODES = [
  { id: "entrar", label: "Entrar" },
  { id: "cadastro", label: "Criar conta" },
  { id: "link", label: "Link por e-mail" },
] as const;

export default async function SignInPage({ searchParams }: PageProps<"/entrar">) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const next = one(sp.next) ?? "/";
  const erro = one(sp.erro);
  const enviado = one(sp.enviado);
  const modo = one(sp.modo) ?? "entrar";
  const enabled = await enabledProviders();
  const anyProvider = providers.some((p) => enabled[p.id]);
  const q = (m: string) => `/entrar?modo=${m}&next=${encodeURIComponent(next)}`;

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-white">{modo === "cadastro" ? "Crie sua conta" : "Entre pro squad"}</h1>
      <p className="mt-2 text-zinc-400">Curta, comente e participe da comunidade BuffOrDie.</p>

      {modo !== "senha" && (
        <nav className="mt-6 grid grid-cols-3 gap-1 rounded-lg border border-line bg-panel p-1 text-sm" aria-label="Forma de entrar">
          {MODES.map((m) => (
            <Link
              key={m.id}
              href={q(m.id)}
              className={`rounded-md px-2 py-2 text-center font-semibold ${modo === m.id ? "bg-acid text-ink" : "text-zinc-400 hover:text-white"}`}
            >
              {m.label}
            </Link>
          ))}
        </nav>
      )}

      {erro && (
        <p className="mt-5 rounded-md border border-blood/50 bg-blood/10 px-4 py-3 text-sm text-red-200">{translate(erro)}</p>
      )}
      {enviado && (
        <p className="mt-5 rounded-md border border-acid/50 bg-acid/10 px-4 py-3 text-sm text-lime-100">
          {enviado === "confirmar"
            ? "Conta criada! Enviamos um e-mail para confirmar seu endereço (confira o spam). Depois de confirmar, entre com seu e-mail e senha."
            : modo === "senha"
              ? "Se esse e-mail tiver conta, enviamos um link para criar uma nova senha (confira o spam)."
              : "Pronto! Enviamos um link de acesso para o seu e-mail (confira também o spam)."}
        </p>
      )}

      {modo === "entrar" && (
        <form action={signInWithPassword} className="mt-6 space-y-3">
          <input type="hidden" name="next" value={next} />
          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">E-mail</span>
            <input name="email" type="email" required autoComplete="email" placeholder="seu@email.com" className={input} />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Senha</span>
            <input name="password" type="password" required autoComplete="current-password" className={input} />
          </label>
          <button className={primary}>Entrar</button>
          <p className="flex justify-between text-sm">
            <Link href="/entrar?modo=senha" className="text-zinc-400 hover:text-acid">Esqueci minha senha</Link>
            <Link href={q("cadastro")} className="text-acid hover:underline">Criar conta</Link>
          </p>
        </form>
      )}

      {modo === "cadastro" && (
        <form action={signUp} className="mt-6 space-y-3">
          <input type="hidden" name="next" value={next} />
          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Nome de usuário</span>
            <div className="flex items-center rounded-md border border-line bg-panel focus-within:border-acid">
              <span className="pl-4 text-zinc-500">@</span>
              <input
                name="username"
                required
                minLength={3}
                maxLength={30}
                pattern="[a-z0-9_.]{3,30}"
                title="3 a 30 caracteres: letras minúsculas, números, _ e ponto"
                autoComplete="username"
                placeholder="seu_nick"
                className="w-full bg-transparent px-2 py-3 text-white placeholder:text-zinc-600 focus:outline-none"
              />
            </div>
            <span className="text-xs text-zinc-500">Letras minúsculas, números, _ e ponto. É assim que a comunidade vai te ver.</span>
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">E-mail</span>
            <input name="email" type="email" required autoComplete="email" placeholder="seu@email.com" className={input} />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Senha</span>
            <input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="mínimo 8 caracteres" className={input} />
          </label>
          <button className={primary}>Criar conta</button>
          <p className="text-xs text-zinc-500">Ao criar a conta você concorda em manter o respeito nos comentários.</p>
        </form>
      )}

      {modo === "link" && (
        <form action={signInWithEmail} className="mt-6 space-y-3">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="email" className="sr-only">E-mail</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="seu@email.com" className={input} />
          <button className={primary}>Receber link de acesso</button>
          <p className="text-xs text-zinc-500">Sem senha: você recebe um link e entra com um clique, em qualquer aparelho.</p>
        </form>
      )}

      {modo === "senha" && (
        <form action={resetPassword} className="mt-6 space-y-3">
          <p className="text-sm text-zinc-400">Digite seu e-mail e enviamos um link para você criar uma nova senha.</p>
          <input name="email" type="email" required autoComplete="email" placeholder="seu@email.com" className={input} />
          <button className={primary}>Enviar link</button>
          <Link href="/entrar" className="block text-center text-sm text-zinc-400 hover:text-acid">← Voltar</Link>
        </form>
      )}

      {modo !== "senha" && (
        <>
          <div className="my-8 flex items-center gap-4 text-xs uppercase tracking-widest text-zinc-600">
            <span className="h-px flex-1 bg-line" /> {anyProvider ? "ou continue com" : "em breve"} <span className="h-px flex-1 bg-line" />
          </div>
          <form action={signInWithProvider} className="grid grid-cols-3 gap-2">
            <input type="hidden" name="next" value={next} />
            {providers.map((p) =>
              enabled[p.id] ? (
                <button key={p.id} name="provider" value={p.id} className={`rounded-md px-3 py-2.5 text-sm font-semibold transition ${p.style}`}>
                  {p.label}
                </button>
              ) : (
                <span key={p.id} className="rounded-md border border-line bg-panel px-3 py-2.5 text-center text-sm font-semibold text-zinc-600" title="Em breve">
                  {p.label}
                </span>
              ),
            )}
          </form>
        </>
      )}
    </div>
  );
}

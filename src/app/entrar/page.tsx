import type { Metadata } from "next";

export const metadata: Metadata = { title: "Entrar" };

// TODO: integrar Auth.js (Google, Discord, Twitch) — ver ROADMAP no README.
export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="font-display text-3xl font-bold text-white">Entre pro squad</h1>
      <p className="mt-2 text-zinc-400">Curta, comente e salve suas matérias favoritas.</p>
      <div className="mt-8 space-y-3">
        {["Google", "Discord", "Twitch"].map((p) => (
          <button
            key={p}
            type="button"
            disabled
            className="w-full rounded-md border border-line bg-panel px-4 py-3 text-left font-medium text-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continuar com {p} <span className="float-right text-xs text-zinc-500">em breve</span>
          </button>
        ))}
      </div>
    </div>
  );
}

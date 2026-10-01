"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

// Destino do link mágico: a sessão vem no fragmento da URL (#access_token=...), lido só no navegador.
export default function ConfirmarPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    const nextParam = query.get("next") ?? "/";
    const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/";
    const access_token = hash.get("access_token");
    const refresh_token = hash.get("refresh_token");
    const failure = hash.get("error_description") ?? query.get("error_description");

    if (failure || !access_token || !refresh_token) {
      Promise.resolve().then(() =>
        setError(failure?.replace(/\+/g, " ") ?? "Link inválido ou incompleto. Peça um novo link de acesso."),
      );
      return;
    }
    supabaseBrowser()
      .auth.setSession({ access_token, refresh_token })
      .then(({ error: e }) => {
        if (e) setError("O link expirou ou já foi usado. Peça um novo link de acesso.");
        else {
          window.history.replaceState(null, "", window.location.pathname); // tira os tokens da barra de endereço
          router.replace(next);
          router.refresh();
        }
      });
  }, [router]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      {error ? (
        <>
          <h1 className="font-display text-2xl font-bold text-white">Não deu para entrar</h1>
          <p className="mt-3 text-zinc-400">{error}</p>
          <Link href="/entrar" className="mt-8 inline-block rounded-md bg-acid px-5 py-2.5 font-semibold text-ink">
            Pedir novo link
          </Link>
        </>
      ) : (
        <>
          <p className="font-display text-2xl font-bold text-white">Entrando…</p>
          <p className="mt-3 text-zinc-500">Só um instante.</p>
        </>
      )}
    </div>
  );
}

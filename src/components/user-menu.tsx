"use client";

/* eslint-disable @next/next/no-img-element -- avatar vindo do Google/Discord/Twitch */
import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";

export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => {
    const sb = supabaseBrowser();
    sb.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = sb.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  return user; // undefined = carregando
}

export function UserMenu() {
  const user = useUser();

  if (user === undefined) return <span className="h-9 w-20 animate-pulse rounded-md bg-panel" aria-hidden />;

  if (!user)
    return (
      <Link href="/entrar" className="rounded-md bg-acid px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110">
        Entrar
      </Link>
    );

  const meta = user.user_metadata ?? {};
  const name: string = meta.full_name ?? meta.name ?? meta.user_name ?? user.email?.split("@")[0] ?? "gamer";
  const avatar: string | undefined = meta.avatar_url;

  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md border border-line px-2 py-1.5 text-sm text-white hover:border-zinc-600">
        {avatar ? (
          <img src={avatar} alt="" className="size-6 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <span className="grid size-6 place-items-center rounded-full bg-volt text-xs font-bold">{name[0]?.toUpperCase()}</span>
        )}
        <span className="hidden max-w-28 truncate sm:inline">{name}</span>
      </summary>
      <div className="absolute right-0 mt-2 w-48 rounded-lg border border-line bg-panel p-1 shadow-xl">
        <p className="truncate px-3 py-2 text-xs text-zinc-500">{user.email}</p>
        <form action="/auth/sair" method="post">
          <button className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-300 hover:bg-ink hover:text-white">Sair</button>
        </form>
      </div>
    </details>
  );
}

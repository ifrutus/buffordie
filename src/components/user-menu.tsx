"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Avatar } from "./avatar";

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

type MiniProfile = { id: string; username: string; display_name: string | null; avatar_url: string | null; role: string };

function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<MiniProfile | null>(null);
  useEffect(() => {
    if (!userId) return;
    supabaseBrowser()
      .from("profiles")
      .select("id, username, display_name, avatar_url, role")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [userId]);
  return profile?.id === userId ? profile : null;
}

export function UserMenu() {
  const user = useUser();
  const profile = useProfile(user?.id);

  if (user === undefined) return <span className="h-9 w-20 animate-pulse rounded-md bg-panel" aria-hidden />;

  if (!user)
    return (
      <Link href="/entrar" className="rounded-md bg-acid px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110">
        Entrar
      </Link>
    );

  const meta = user.user_metadata ?? {};
  const name: string = profile?.display_name || profile?.username || meta.full_name || meta.name || user.email?.split("@")[0] || "gamer";
  const avatar: string | undefined = profile?.avatar_url ?? meta.avatar_url;
  const isStaff = ["author", "editor", "admin"].includes(profile?.role ?? "");
  const item = "block rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-ink hover:text-white";

  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md border border-line px-2 py-1.5 text-sm text-white hover:border-zinc-600">
        <Avatar url={avatar} name={name} size={24} />
        <span className="hidden max-w-28 truncate sm:inline">{name}</span>
      </summary>
      <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-line bg-panel p-1 shadow-xl">
        <p className="truncate px-3 py-2 text-xs text-zinc-500">{profile ? `@${profile.username}` : user.email}</p>
        <Link href="/perfil" className={item}>👤 Meu perfil</Link>
        {profile && <Link href={`/u/${profile.username}`} className={item}>🌐 Perfil público</Link>}
        {isStaff && <Link href="/redacao" className={item}>✍️ Redação</Link>}
        <form action="/auth/sair" method="post">
          <button className={`${item} w-full text-left`}>Sair</button>
        </form>
      </div>
    </details>
  );
}

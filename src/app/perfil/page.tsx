"use client";

 
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { Avatar } from "@/components/avatar";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useUser } from "@/components/user-menu";

type Profile = { id: string; username: string; display_name: string | null; avatar_url: string | null; bio: string | null };

const input =
  "w-full rounded-md border border-line bg-ink px-3 py-2.5 text-white placeholder:text-zinc-600 focus:border-acid focus:outline-none";

/** Recorta no centro e reduz para 256×256 WebP. */
async function squareAvatar(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const side = Math.min(bmp.width, bmp.height);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  canvas.getContext("2d")!.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, 256, 256);
  return (await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.9))) ?? file;
}

function ProfileEditor() {
  const user = useUser();
  const router = useRouter();
  const params = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ display_name: "", username: "", bio: "" });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pw, setPw] = useState({ a: "", b: "" });
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user === null) router.replace("/entrar?next=/perfil");
    if (!user) return;
    supabaseBrowser()
      .from("profiles")
      .select("id, username, display_name, avatar_url, bio")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        setProfile(data);
        setForm({ display_name: data.display_name ?? "", username: data.username, bio: data.bio ?? "" });
        setAvatar(data.avatar_url);
      });
  }, [user, router]);

  async function uploadAvatar(file: File | undefined) {
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) return setMsg({ ok: false, text: "Escolha uma imagem." });
    setUploading(true);
    setMsg(null);
    const blob = await squareAvatar(file);
    const path = `${user.id}/avatar-${Date.now().toString(36)}.webp`;
    const sb = supabaseBrowser();
    const { error } = await sb.storage.from("avatares").upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
    setUploading(false);
    if (error) return setMsg({ ok: false, text: `Não foi possível enviar a foto: ${error.message}` });
    setAvatar(sb.storage.from("avatares").getPublicUrl(path).data.publicUrl);
    setMsg({ ok: true, text: "Foto carregada — clique em Salvar perfil para confirmar." });
    if (fileRef.current) fileRef.current.value = "";
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    const username = form.username.trim().toLowerCase();
    if (!/^[a-z0-9_.]{3,30}$/.test(username))
      return setMsg({ ok: false, text: "Nome de usuário: 3 a 30 caracteres, só letras minúsculas, números, _ e ponto." });
    setSaving(true);
    setMsg(null);
    const sb = supabaseBrowser();
    if (username !== profile.username) {
      const { data: free } = await sb.rpc("username_available", { u: username });
      if (!free) {
        setSaving(false);
        return setMsg({ ok: false, text: `@${username} já está em uso.` });
      }
    }
    const { error } = await sb
      .from("profiles")
      .update({ username, display_name: form.display_name.trim() || username, bio: form.bio.trim() || null, avatar_url: avatar })
      .eq("id", profile.id);
    setSaving(false);
    if (error) return setMsg({ ok: false, text: error.message.includes("duplicate") ? `@${username} já está em uso.` : error.message });
    setProfile({ ...profile, username, display_name: form.display_name, bio: form.bio, avatar_url: avatar });
    setMsg({ ok: true, text: "Perfil salvo!" });
    router.refresh();
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    if (pw.a.length < 8) return setPwMsg({ ok: false, text: "A senha precisa ter pelo menos 8 caracteres." });
    if (pw.a !== pw.b) return setPwMsg({ ok: false, text: "As senhas não conferem." });
    const { error } = await supabaseBrowser().auth.updateUser({ password: pw.a });
    if (error)
      return setPwMsg({
        ok: false,
        text: /reauthentication|recent/i.test(error.message)
          ? "Por segurança, saia e entre de novo antes de trocar a senha."
          : /different|same/i.test(error.message)
            ? "A nova senha precisa ser diferente da atual."
            : error.message,
      });
    setPw({ a: "", b: "" });
    setPwMsg({ ok: true, text: "Senha salva! Agora você pode entrar com e-mail e senha." });
  }

  if (!profile)
    return <div className="mx-auto max-w-2xl px-4 py-20 text-zinc-500">{user === undefined ? "Carregando…" : "Carregando seu perfil…"}</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-10 px-4 py-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Meu perfil</h1>
          <p className="text-sm text-zinc-500">{user?.email}</p>
        </div>
        <Link href={`/u/${profile.username}`} className="text-sm text-acid hover:underline">Ver perfil público →</Link>
      </header>

      {params.get("novo") && (
        <p className="rounded-md border border-acid/50 bg-acid/10 px-4 py-3 text-sm text-lime-100">
          Conta criada! Capriche no perfil: foto e bio ajudam a comunidade a te reconhecer.
        </p>
      )}

      <form onSubmit={save} className="space-y-5 rounded-2xl border border-line bg-panel p-6">
        <div className="flex items-center gap-5">
          <Avatar url={avatar} name={form.display_name || form.username} size={88} />
          <div className="space-y-2">
            <label className="inline-block cursor-pointer rounded-md border border-line px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-acid">
              {uploading ? "Enviando…" : "Trocar foto"}
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => uploadAvatar(e.target.files?.[0])} />
            </label>
            {avatar && (
              <button type="button" onClick={() => setAvatar(null)} className="ml-3 text-sm text-zinc-500 hover:text-blood">
                remover
              </button>
            )}
            <p className="text-xs text-zinc-500">A foto é recortada em quadrado automaticamente.</p>
          </div>
        </div>

        <label className="block space-y-1">
          <span className="text-sm text-zinc-300">Nome de exibição</span>
          <input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} maxLength={40} className={input} placeholder="Como você quer aparecer" />
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-zinc-300">Nome de usuário</span>
          <div className="flex items-center rounded-md border border-line bg-ink focus-within:border-acid">
            <span className="pl-3 text-zinc-500">@</span>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, "") })}
              maxLength={30}
              className="w-full bg-transparent px-2 py-2.5 text-white focus:outline-none"
            />
          </div>
          <span className="text-xs text-zinc-500">buffordie.vercel.app/u/{form.username || "…"}</span>
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-zinc-300">Bio</span>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value.slice(0, 300) })}
            rows={4}
            className={input}
            placeholder="Jogos favoritos, plataforma, time do coração no competitivo…"
          />
          <span className="block text-right text-xs text-zinc-500">{form.bio.length}/300</span>
        </label>

        {msg && <p className={`text-sm ${msg.ok ? "text-acid" : "text-blood"}`}>{msg.text}</p>}
        <button disabled={saving || uploading} className="rounded-md bg-acid px-6 py-2.5 font-semibold text-ink hover:brightness-110 disabled:opacity-50">
          {saving ? "Salvando…" : "Salvar perfil"}
        </button>
      </form>

      <form id="senha" onSubmit={changePassword} className={`space-y-4 rounded-2xl border bg-panel p-6 ${params.get("senha") ? "border-acid" : "border-line"}`}>
        <div>
          <h2 className="font-display text-xl font-bold text-white">Senha</h2>
          <p className="text-sm text-zinc-500">Crie ou troque sua senha para entrar com e-mail e senha.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input type="password" autoComplete="new-password" placeholder="Nova senha (mín. 8)" value={pw.a} onChange={(e) => setPw({ ...pw, a: e.target.value })} className={input} />
          <input type="password" autoComplete="new-password" placeholder="Repita a nova senha" value={pw.b} onChange={(e) => setPw({ ...pw, b: e.target.value })} className={input} />
        </div>
        {pwMsg && <p className={`text-sm ${pwMsg.ok ? "text-acid" : "text-blood"}`}>{pwMsg.text}</p>}
        <button className="rounded-md border border-line px-6 py-2.5 font-semibold text-zinc-200 hover:border-acid hover:text-white">Salvar senha</button>
      </form>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <Suspense>
      <ProfileEditor />
    </Suspense>
  );
}

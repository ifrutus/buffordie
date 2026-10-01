"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { importArquivo } from "./arquivo";

export async function runImport() {
  const sb = await supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) redirect("/entrar?next=/redacao/importar");
  const { data: profile } = await sb.from("profiles").select("username, display_name, role").eq("id", auth.user.id).single();
  if (!profile || !["author", "editor", "admin"].includes(profile.role)) redirect("/redacao");

  let result: Awaited<ReturnType<typeof importArquivo>>;
  try {
    result = await importArquivo(sb, { id: auth.user.id, name: profile.display_name || profile.username });
  } catch (e) {
    redirect(`/redacao/importar?erro=${encodeURIComponent((e as Error).message)}`);
  }
  updateTag("posts");
  revalidatePath("/", "layout");
  const q = new URLSearchParams({ ok: String(result.ok), total: String(result.total), imagens: String(result.images), log: result.log.join("\n") });
  redirect(`/redacao/importar?${q}`);
}

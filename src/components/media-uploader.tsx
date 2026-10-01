"use client";

/* eslint-disable @next/next/no-img-element -- prévias de mídia enviadas */
import { useCallback, useEffect, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type Media = { name: string; url: string; kind: "image" | "video" };

const BUCKET = "midia";
const MAX_VIDEO = 50 * 1024 * 1024;
const MAX_IMAGE = 15 * 1024 * 1024;

/** Reduz fotos grandes para no máximo 1920px e converte para WebP (carrega muito mais rápido). */
async function optimizeImage(file: File): Promise<Blob> {
  if (file.type === "image/gif" || file.size < 400_000) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1920 / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
  return blob && blob.size < file.size ? blob : file;
}

function safeName(name: string) {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "arquivo";
}

function insertAtCursor(text: string) {
  const ta = document.getElementById("content") as HTMLTextAreaElement | null;
  if (!ta) return;
  const start = ta.selectionStart ?? ta.value.length;
  const end = ta.selectionEnd ?? start;
  const before = ta.value.slice(0, start);
  const after = ta.value.slice(end);
  const block = `${before && !before.endsWith("\n\n") ? "\n\n" : ""}${text}\n\n`;
  ta.value = before + block + after.replace(/^\n+/, "");
  ta.focus();
  ta.selectionStart = ta.selectionEnd = before.length + block.length;
}

function setCover(url: string) {
  const input = document.getElementById("cover_url") as HTMLInputElement | null;
  if (input) input.value = url;
}

export function MediaUploader() {
  const [items, setItems] = useState<Media[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cover, setCoverState] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const publicUrl = (path: string) => supabaseBrowser().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const loadRecent = useCallback(async () => {
    const sb = supabaseBrowser();
    const month = new Date().toISOString().slice(0, 7).replace("-", "/");
    const { data } = await sb.storage.from(BUCKET).list(month, { limit: 24, sortBy: { column: "created_at", order: "desc" } });
    return (data ?? [])
      .filter((f) => f.id)
      .map((f) => ({
        name: f.name,
        url: publicUrl(`${month}/${f.name}`),
        kind: /\.(mp4|webm|mov)$/i.test(f.name) ? ("video" as const) : ("image" as const),
      }));
  }, []);

  useEffect(() => {
    let alive = true;
    loadRecent().then((list) => alive && setItems(list));
    return () => {
      alive = false;
    };
  }, [loadRecent]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const sb = supabaseBrowser();
    const month = new Date().toISOString().slice(0, 7).replace("-", "/");
    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo && !isImage) {
        setError(`"${file.name}" não é imagem nem vídeo.`);
        continue;
      }
      if (isVideo && file.size > MAX_VIDEO) {
        setError(`"${file.name}" tem mais de 50 MB. Para vídeos longos, suba no YouTube e cole o link no texto.`);
        continue;
      }
      if (isImage && file.size > MAX_IMAGE) {
        setError(`"${file.name}" é grande demais (máx. 15 MB).`);
        continue;
      }
      setBusy(file.name);
      const body = isImage ? await optimizeImage(file) : file;
      const ext = body.type === "image/webp" ? "webp" : (file.name.split(".").pop() ?? "bin").toLowerCase();
      const path = `${month}/${Date.now().toString(36)}-${safeName(file.name)}.${ext}`;
      const { error: upErr } = await sb.storage.from(BUCKET).upload(path, body, {
        contentType: body.type || file.type,
        cacheControl: "31536000",
      });
      if (upErr) setError(`Falha ao enviar "${file.name}": ${upErr.message}`);
      else setItems((prev) => [{ name: path.split("/").pop()!, url: publicUrl(path), kind: isVideo ? "video" : "image" }, ...prev]);
    }
    setBusy(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-line bg-ink/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Imagens e vídeos</p>
          <p className="text-xs text-zinc-500">JPG, PNG, WebP, GIF ou MP4/WebM (até 50 MB). Fotos grandes são otimizadas sozinhas.</p>
        </div>
        <label className="cursor-pointer rounded-md border border-line px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-acid hover:text-white">
          {busy ? `Enviando ${busy.slice(0, 20)}…` : "＋ Enviar arquivos"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            multiple
            className="sr-only"
            disabled={!!busy}
            onChange={(e) => upload(e.target.files)}
          />
        </label>
      </div>
      {error && <p className="text-sm text-blood">{error}</p>}
      {items.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => (
            <li key={m.url} className={`overflow-hidden rounded-lg border bg-panel ${cover === m.url ? "border-acid" : "border-line"}`}>
              <div className="aspect-video bg-ink">
                {m.kind === "image" ? (
                  <img src={m.url} alt="" className="size-full object-cover" loading="lazy" />
                ) : (
                  <video src={m.url} className="size-full object-cover" muted preload="metadata" />
                )}
              </div>
              <div className="flex flex-col gap-1 p-2 text-xs">
                <button
                  type="button"
                  onClick={() => insertAtCursor(m.kind === "image" ? `![Legenda da imagem](${m.url})` : `[video](${m.url})`)}
                  className="rounded bg-ink px-2 py-1 text-left text-zinc-300 hover:text-acid"
                >
                  ↳ Inserir no texto
                </button>
                {m.kind === "image" && (
                  <button
                    type="button"
                    onClick={() => {
                      setCover(m.url);
                      setCoverState(m.url);
                    }}
                    className="rounded bg-ink px-2 py-1 text-left text-zinc-300 hover:text-acid"
                  >
                    {cover === m.url ? "✓ Capa da matéria" : "★ Usar como capa"}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

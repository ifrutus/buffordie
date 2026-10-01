"use client";

import { useState, type FormEvent } from "react";

type Comment = { id: number; author: string; text: string; when: string };

const seed: Comment[] = [
  { id: 1, author: "gamerzinho_br", text: "Matéria top demais, já tô no hype!", when: "há 2 h" },
  { id: 2, author: "LunaPlays", text: "Finalmente alguém falando disso com calma. Valeu, BuffOrDie!", when: "há 5 h" },
];

// TODO: trocar o estado local por Server Actions + Prisma (tabela Comment) com moderação.
export function Comments({ total }: { total: number }) {
  const [items, setItems] = useState<Comment[]>(seed);
  const [text, setText] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setItems((prev) => [{ id: Date.now(), author: "você", text: value, when: "agora" }, ...prev]);
    setText("");
  }

  return (
    <section className="mt-12" aria-labelledby="comentarios">
      <h2 id="comentarios" className="font-display text-2xl font-bold text-white">
        Comentários <span className="text-zinc-500">({total + items.length - seed.length})</span>
      </h2>

      <form onSubmit={submit} className="mt-4 rounded-xl border border-line bg-panel p-4">
        <label htmlFor="novo-comentario" className="sr-only">
          Escreva um comentário
        </label>
        <textarea
          id="novo-comentario"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Manda a real: o que você achou?"
          className="w-full resize-y rounded-md border border-line bg-ink p-3 text-sm text-white placeholder:text-zinc-600 focus:border-acid focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-zinc-500">Respeito acima de tudo. Comentários tóxicos são removidos.</p>
          <button
            type="submit"
            disabled={!text.trim()}
            className="rounded-md bg-acid px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110 disabled:opacity-40"
          >
            Comentar
          </button>
        </div>
      </form>

      <ul className="mt-6 space-y-4">
        {items.map((c) => (
          <li key={c.id} className="flex gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-volt/30 font-display text-sm font-bold text-white">
              {c.author.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <p className="text-sm">
                <span className="font-semibold text-white">{c.author}</span>{" "}
                <span className="text-zinc-500">· {c.when}</span>
              </p>
              <p className="mt-1 text-zinc-300">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

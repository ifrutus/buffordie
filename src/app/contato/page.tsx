import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a redação do Buff or Die: pautas, correções, parcerias e anúncios.",
  alternates: { canonical: "/contato" },
};

const topics = [
  { emoji: "📰", title: "Pautas e dicas", text: "Viu algo que merece matéria? Manda que a gente investiga.", subject: "Sugestão de pauta" },
  { emoji: "✏️", title: "Correções", text: "Achou um erro numa matéria? Diga o link e o que está errado.", subject: "Correção" },
  { emoji: "🤝", title: "Parcerias e anúncios", text: "Publishers, marcas, times e eventos de e-sports.", subject: "Parceria" },
  { emoji: "🔒", title: "Privacidade e conta", text: "Cópia ou exclusão dos seus dados, problemas de login.", subject: "Privacidade" },
];

export default function ContatoPage() {
  const mailto = (subject: string) => `mailto:${site.contactEmail}?subject=${encodeURIComponent(`[Buff or Die] ${subject}`)}`;

  return (
    <LegalPage kicker="Institucional" title="Contato" intro="Respondemos em até 3 dias úteis.">
      <p>
        Nosso e-mail é <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. Para chegar mais rápido a
        quem resolve, escolha o assunto:
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {topics.map((t) => (
          <a
            key={t.subject}
            href={mailto(t.subject)}
            className="group block rounded-2xl border border-line bg-panel p-5 !text-zinc-300 transition hover:border-acid hover:!no-underline"
          >
            <span className="text-2xl" aria-hidden>{t.emoji}</span>
            <p className="mt-2 font-display text-lg font-bold text-white group-hover:text-acid">{t.title}</p>
            <p className="mt-1 text-sm text-zinc-400">{t.text}</p>
          </a>
        ))}
      </div>

      <p className="text-sm text-zinc-500">
        Dúvidas sobre como tratamos seus dados estão na <Link href="/privacidade">Política de Privacidade</Link>.
      </p>
    </LegalPage>
  );
}

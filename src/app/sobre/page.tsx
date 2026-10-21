import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { sections } from "@/lib/sections";
import { sources } from "@/lib/radar/sources";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Quem faz o Buff or Die, o hub de games do Brasil feito por quem joga.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <LegalPage
      kicker="Institucional"
      title="Sobre o Buff or Die"
      intro="O hub de games do Brasil, feito por quem joga."
    >
      <p>
        O Buff or Die nasceu da paixão por videogame e virou o lugar para acompanhar o que importa no mundo dos
        games em português: notícias, guias, atualizações, cenário competitivo e reviews com veredito sem rodeio.
        Ou o jogo merece um <strong>buff</strong>, ou merece <strong>die</strong>.
      </p>

      <h2>O que você encontra aqui</h2>
      <ul>
        {sections.map((s) => (
          <li key={s.slug}>
            <Link href={`/secao/${s.slug}`}>{s.name}</Link>: {s.tagline}
          </li>
        ))}
      </ul>

      <h2>Matérias próprias e Radar</h2>
      <p>
        As matérias do Buff or Die são escritas pela nossa redação, com opinião e análise de quem joga. Já o{" "}
        <Link href="/radar">Radar</Link> reúne as manchetes dos principais sites de games do país (
        {sources.map((s) => s.name).join(", ")}), sempre com título, resumo curto, crédito e link para a matéria
        original. O conteúdo do Radar pertence a cada fonte.
      </p>

      <h2>Comunidade</h2>
      <p>
        Crie sua conta para curtir, comentar e discutir com o squad. Comentários ofensivos, spam e golpes são
        removidos. Respeito é obrigatório; zoeira saudável é bem-vinda.
      </p>

      <h2>Como o site se mantém</h2>
      <p>
        O Buff or Die é gratuito para ler. Para pagar servidores e a redação, podemos exibir anúncios, sempre
        identificados como &quot;Publicidade&quot; e só com cookies de anúncio se você permitir. Anúncios não
        influenciam nossas notas e análises. Saiba mais na <Link href="/privacidade">Política de Privacidade</Link>.
      </p>

      <h2>Fale com a gente</h2>
      <p>
        Sugestão de pauta, correção, parceria ou anúncio? Vá para a página de <Link href="/contato">contato</Link>.
      </p>
    </LegalPage>
  );
}

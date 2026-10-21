import type { Metadata } from "next";
import Link from "next/link";
import { CookiePreferencesButton } from "@/components/cookie-consent";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como o Buff or Die coleta, usa e protege seus dados, de acordo com a LGPD.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  const mail = <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>;

  return (
    <LegalPage
      kicker="Institucional"
      title="Política de Privacidade"
      intro={<>Última atualização: {site.policyUpdatedAt}. Escrita em linguagem simples, de acordo com a Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018).</>}
    >
      <h2>1. Quem cuida dos seus dados</h2>
      <p>
        O responsável (controlador) pelos dados tratados no {site.name} ({site.url.replace("https://", "")}) é{" "}
        <strong>{site.controllerName}</strong>
        {site.controllerDocument ? <>, {site.controllerDocument}</> : null}. Qualquer dúvida ou pedido sobre
        privacidade: {mail}.
      </p>

      <h2>2. O que coletamos</h2>
      <h3>Se você só lê o site</h3>
      <ul>
        <li>Dados técnicos de acesso (endereço IP, navegador, páginas visitadas, data e hora), registrados pela hospedagem por segurança e para o site funcionar.</li>
        <li>Sua escolha sobre cookies, guardada no seu próprio navegador.</li>
        <li>Se você aceitar cookies de anúncios: identificadores usados pelo Google para exibir e medir anúncios (veja a seção 5).</li>
      </ul>
      <h3>Se você cria uma conta</h3>
      <ul>
        <li>E-mail, nome de exibição, nome de usuário e foto de perfil. Se entrar com Google, Discord ou Twitch, recebemos esses dados da plataforma escolhida, nunca a sua senha.</li>
        <li>O que você publica: comentários, curtidas, imagens enviadas e, para redatores, as matérias.</li>
      </ul>

      <h2>3. Para que usamos</h2>
      <ul>
        <li><strong>Manter sua conta e a comunidade funcionando</strong> (login, curtidas, comentários, perfil). Base legal: execução do serviço que você pediu.</li>
        <li><strong>Segurança e prevenção de abuso</strong>, como moderar comentários e bloquear spam. Base legal: legítimo interesse e cumprimento de obrigação legal (o Marco Civil da Internet exige guardar registros de acesso por 6 meses).</li>
        <li><strong>Exibir anúncios</strong> que pagam os custos do site. Base legal: seu consentimento, que você pode retirar a qualquer momento.</li>
      </ul>
      <p>Não vendemos seus dados e não enviamos newsletter sem você pedir.</p>

      <h2>4. Com quem compartilhamos</h2>
      <ul>
        <li><strong>Supabase</strong>: banco de dados e login, com servidores em São Paulo.</li>
        <li><strong>Vercel</strong>: hospedagem do site.</li>
        <li><strong>Google, Discord ou Twitch</strong>: só se você escolher entrar com uma dessas contas.</li>
        <li><strong>Google AdSense</strong>: só se você aceitar cookies de anúncios.</li>
        <li>Autoridades, quando houver ordem judicial ou obrigação legal.</li>
      </ul>
      <p>
        Alguns desses fornecedores podem processar dados fora do Brasil. Nesses casos, usamos empresas que
        oferecem garantias de proteção compatíveis com a LGPD.
      </p>

      <h2 id="cookies">5. Cookies e anúncios</h2>
      <ul>
        <li><strong>Essenciais</strong> (sempre ativos): mantêm você logado e guardam sua escolha de cookies. Sem eles, o site não funciona.</li>
        <li><strong>Anúncios</strong> (só com sua permissão): o Google e seus parceiros usam cookies para mostrar anúncios, inclusive com base em visitas anteriores a este e a outros sites, e para medir os resultados.</li>
      </ul>
      <p>
        Saiba como o Google usa esses dados em{" "}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
          policies.google.com/technologies/partner-sites
        </a>{" "}
        e desative anúncios personalizados em{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.
      </p>
      <p>
        Você pode mudar sua escolha quando quiser:{" "}
        <CookiePreferencesButton className="text-acid hover:underline" />.
      </p>

      <h2>6. Por quanto tempo guardamos</h2>
      <ul>
        <li>Dados da conta e o que você publicou: enquanto a conta existir.</li>
        <li>Registros de acesso: 6 meses, como exige o Marco Civil da Internet.</li>
        <li>Ao excluir a conta, apagamos perfil, comentários e curtidas, salvo o que a lei obrigar a guardar.</li>
      </ul>

      <h2>7. Seus direitos</h2>
      <p>Pela LGPD (art. 18), você pode a qualquer momento:</p>
      <ul>
        <li>confirmar se tratamos seus dados e pedir uma cópia;</li>
        <li>corrigir dados incompletos ou errados (boa parte dá para fazer na sua <Link href="/perfil">página de perfil</Link>);</li>
        <li>pedir a exclusão da conta e dos dados;</li>
        <li>retirar o consentimento para anúncios;</li>
        <li>saber com quem compartilhamos seus dados;</li>
        <li>reclamar na Autoridade Nacional de Proteção de Dados (ANPD).</li>
      </ul>
      <p>Para qualquer pedido, escreva para {mail}. Respondemos em até 15 dias.</p>

      <h2>8. Crianças e adolescentes</h2>
      <p>
        O Buff or Die é feito para o público gamer em geral. Menores de 12 anos não devem criar conta. Adolescentes
        devem usar a comunidade com o acompanhamento dos pais ou responsáveis.
      </p>

      <h2>9. Segurança</h2>
      <p>
        Usamos conexão criptografada (HTTPS), login sem senha guardada por nós e regras no banco de dados que impedem
        alguém de ler ou alterar o que não é seu. Nenhum sistema é 100% invulnerável; se houver um incidente que
        afete você, avisaremos.
      </p>

      <h2>10. Mudanças nesta política</h2>
      <p>
        Quando esta política mudar, a data no topo será atualizada. Mudanças importantes serão avisadas no site.
      </p>
    </LegalPage>
  );
}

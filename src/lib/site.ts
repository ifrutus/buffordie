// Dados institucionais usados nas páginas Sobre, Contato e Privacidade.
// Para trocar sem mexer no código, defina as variáveis na Vercel (Settings → Environment Variables).

export const site = {
  name: "Buff or Die",
  url: "https://www.buffordie.com.br",
  // Caixa de e-mail criada na HostGator (o plano inclui contas de e-mail grátis).
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contato@buffordie.com.br",
  // Quem responde pelos dados (LGPD). Se tiver CNPJ, preencha; se vazio, a linha some da política.
  controllerName: process.env.NEXT_PUBLIC_CONTROLLER_NAME || "Buff or Die",
  controllerDocument: process.env.NEXT_PUBLIC_CONTROLLER_DOCUMENT || "",
  policyUpdatedAt: "21 de outubro de 2026",
};

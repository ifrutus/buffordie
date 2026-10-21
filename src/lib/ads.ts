// Configuração do Google AdSense.
//
// Tudo fica DESLIGADO até a variável NEXT_PUBLIC_ADSENSE_CLIENT ser definida na Vercel
// com o ID do editor (formato ca-pub-1234567890123456). Sem ela, nenhum script do Google
// carrega e os espaços de anúncio não aparecem.
//
// Os IDs de bloco (slots) são criados no painel do AdSense em Anúncios → Por bloco de anúncios.

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";

export const ADSENSE_CLIENT = client;
export const adsEnabled = /^ca-pub-\d{10,20}$/.test(client);

// Mostra caixas tracejadas no lugar dos anúncios (no `npm run dev` ou com NEXT_PUBLIC_ADS_PREVIEW=1),
// para ver o layout antes de o AdSense aprovar o site.
export const adsPreview =
  process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ADS_PREVIEW === "1";

export type AdPlacement = "artigo" | "lateral" | "home" | "secao";

export const adSlots: Record<AdPlacement, string> = {
  artigo: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTIGO ?? "",
  lateral: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LATERAL ?? "",
  home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME ?? "",
  secao: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SECAO ?? "",
};

/** Linha do ads.txt (o "pub-..." é o ID do editor sem o prefixo "ca-"). */
export function adsTxtLine() {
  return `google.com, ${client.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0`;
}

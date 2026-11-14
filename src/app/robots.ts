import type { MetadataRoute } from "next";

// As páginas individuais do Radar (/radar/<id>) são resumos de matérias de terceiros, já marcadas como noindex.
// Bloquear o rastreamento evita que robôs gerem milhares de páginas em cache (ISR) e estourem o plano da Vercel.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/radar/", "/redacao", "/perfil", "/auth/", "/busca"] }],
    host: "https://www.buffordie.com.br",
  };
}

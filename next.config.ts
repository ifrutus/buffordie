import type { NextConfig } from "next";
import { legacyPageRedirects, legacyPosts } from "./src/lib/legado";

const nextConfig: NextConfig = {
  // Endereços do site antigo (Weebly) → páginas novas, para não perder links e Google.
  async redirects() {
    return [
      ...legacyPosts.map((p) => ({ source: p.path, destination: `/noticias/${p.slug}`, permanent: true })),
      ...Object.entries(legacyPageRedirects).map(([source, destination]) => ({ source, destination, permanent: true })),
      { source: "/:page([\\w.-]+\\.html)", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;

import type { Metadata } from "next";
import "@fontsource/chakra-petch/500.css";
import "@fontsource/chakra-petch/600.css";
import "@fontsource/chakra-petch/700.css";
import "@fontsource-variable/inter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.buffordie.com.br"),
  title: {
    default: "Buff or Die — O hub de games do Brasil",
    template: "%s | Buff or Die",
  },
  description:
    "Notícias, reviews, gameplays e e-sports. O hub de games do Brasil, feito por quem joga.",
  openGraph: {
    siteName: "Buff or Die",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

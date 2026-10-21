import { adsEnabled, adsTxtLine } from "@/lib/ads";

// buffordie.com.br/ads.txt — o AdSense exige este arquivo para pagar pelos anúncios.
// É gerado a partir de NEXT_PUBLIC_ADSENSE_CLIENT, então não precisa editar nada aqui.
export function GET() {
  const body = adsEnabled ? `${adsTxtLine()}\n` : "# Buff or Die: anúncios ainda não ativados.\n";
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}

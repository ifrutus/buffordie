"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, adSlots, adsEnabled, adsPreview, type AdPlacement } from "@/lib/ads";
import { useConsent } from "@/lib/consent";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const sizes: Record<AdPlacement, string> = {
  artigo: "min-h-[250px]",
  lateral: "min-h-[250px]",
  home: "min-h-[120px]",
  secao: "min-h-[120px]",
};

/**
 * Espaço de anúncio. Não aparece se:
 * - o AdSense ainda não foi configurado (sem NEXT_PUBLIC_ADSENSE_CLIENT ou sem o slot), ou
 * - o visitante não aceitou cookies de anúncio.
 * No modo de pré-visualização mostra uma caixa tracejada no lugar.
 */
export function AdSlot({ placement, className = "" }: { placement: AdPlacement; className?: string }) {
  const consent = useConsent();
  const slot = adSlots[placement];
  const ready = adsEnabled && !!slot && consent?.ads === true;
  const pushed = useRef(false);

  useEffect(() => {
    if (!ready || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // bloqueador de anúncios ou script ainda indisponível: deixa o espaço vazio
    }
  }, [ready]);

  if (!ready) {
    if (!adsPreview) return null;
    return (
      <div
        className={`grid place-items-center rounded-2xl border-2 border-dashed border-line text-xs uppercase tracking-widest text-zinc-600 ${sizes[placement]} ${className}`}
      >
        Anúncio · {placement}
      </div>
    );
  }

  return (
    <aside aria-label="Publicidade" className={className}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-zinc-600">Publicidade</p>
      <ins
        className={`adsbygoogle block ${sizes[placement]}`}
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={placement === "lateral" ? "rectangle" : "auto"}
        data-full-width-responsive="true"
      />
    </aside>
  );
}

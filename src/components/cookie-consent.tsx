"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { ADSENSE_CLIENT, adsEnabled } from "@/lib/ads";
import { CONSENT_OPEN_EVENT, saveConsent, useConsent } from "@/lib/consent";

// Banner de cookies + carregamento do AdSense.
// O script do Google só entra na página DEPOIS de o visitante aceitar anúncios.
export function CookieConsent() {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  const choose = (ads: boolean) => {
    saveConsent(ads);
    setReopened(false);
  };

  const show = consent === null || reopened;

  return (
    <>
      {adsEnabled && consent?.ads && (
        <Script
          id="adsense"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}

      {show && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Preferências de cookies"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-panel/95 backdrop-blur"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center">
            <p className="flex-1 text-sm text-zinc-300">
              🍪 Usamos cookies essenciais para o login funcionar e, se você permitir, cookies do Google para
              mostrar anúncios que mantêm o Buff or Die no ar.{" "}
              <Link href="/privacidade#cookies" className="text-acid hover:underline">
                Saiba mais
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => choose(false)}
                className="rounded-md border border-line px-4 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-white"
              >
                Só essenciais
              </button>
              <button
                type="button"
                onClick={() => choose(true)}
                className="rounded-md bg-acid px-4 py-2 text-sm font-semibold text-ink hover:brightness-110"
              >
                Aceitar todos
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className={className}
    >
      Preferências de cookies
    </button>
  );
}

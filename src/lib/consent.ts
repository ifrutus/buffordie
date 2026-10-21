"use client";

import { useSyncExternalStore } from "react";

// Consentimento de cookies (LGPD). Guardado só no navegador do visitante.
// Cookies essenciais (login) funcionam sempre; anúncios do Google só carregam com `ads: true`.

export type Consent = { ads: boolean; at: string; v: 1 };

const KEY = "bod-consent";
const CHANGE = "bod-consent-change";
const OPEN = "bod-consent-open";

function read(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    return parsed?.v === 1 && typeof parsed.ads === "boolean" ? parsed : null;
  } catch {
    return null;
  }
}

let cache: Consent | null | undefined;

function snapshot() {
  if (cache === undefined) cache = read();
  return cache;
}

function subscribe(cb: () => void) {
  const onChange = () => {
    cache = read();
    cb();
  };
  window.addEventListener(CHANGE, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** `undefined` no servidor/antes de hidratar; `null` se o visitante ainda não escolheu. */
export function useConsent(): Consent | null | undefined {
  return useSyncExternalStore(subscribe, snapshot, () => undefined);
}

export function saveConsent(ads: boolean) {
  const value: Consent = { ads, at: new Date().toISOString(), v: 1 };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // navegação privada sem storage: vale só para esta visita
  }
  cache = value;
  window.dispatchEvent(new Event(CHANGE));
}

/** Reabre o banner (link "Preferências de cookies" no rodapé). */
export function openConsentPreferences() {
  window.dispatchEvent(new Event(OPEN));
}

export const CONSENT_OPEN_EVENT = OPEN;

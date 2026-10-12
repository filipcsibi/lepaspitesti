"use client";

import { useSyncExternalStore } from "react";

export type ConsentChoice = {
  /** Anonymous usage statistics (Google Analytics). */
  analytics: boolean;
  /** Advertising measurement (Meta Pixel, Google Ads). */
  marketing: boolean;
};
export type ConsentState = ConsentChoice & { decidedAt: string };

const STORAGE_KEY = "lepas-cookie-consent";
const EVENT = "lepas-consent-change";
export const OPEN_SETTINGS_EVENT = "lepas-open-cookie-settings";

function read(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Partial<ConsentState>;
    // Consent saved before the marketing category existed never covered it.
    return { analytics: !!stored.analytics, marketing: !!stored.marketing, decidedAt: stored.decidedAt ?? "" };
  } catch {
    return null;
  }
}

let cache: { raw: string | null; value: ConsentState | null } = { raw: null, value: null };

function snapshot(): ConsentState | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {}
  if (raw !== cache.raw) cache = { raw, value: read() };
  return cache.value;
}

export function saveConsent(choice: ConsentChoice) {
  const state: ConsentState = { ...choice, decidedAt: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Current consent. `undefined` on the server, `null` when the visitor has not decided yet.
 * Gate scripts on it: `consent?.analytics === true`, `consent?.marketing === true`.
 */
export function useCookieConsent(): ConsentState | null | undefined {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener(EVENT, cb);
      window.addEventListener("storage", cb);
      return () => {
        window.removeEventListener(EVENT, cb);
        window.removeEventListener("storage", cb);
      };
    },
    snapshot,
    () => undefined,
  );
}

import { attributionParams } from "../config";

const ATTRIBUTION_KEY = "lepas-attribution";

/** Ad parameters from the landing URL, kept for the session so they survive navigation. Browser only. */
export function readAttribution(): Record<string, string> {
  let stored: Record<string, string> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) ?? "{}");
  } catch {}
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Record<string, string> = {};
  for (const key of attributionParams) {
    const value = params.get(key);
    if (value) fromUrl[key] = value;
  }
  const merged = Object.keys(fromUrl).length > 0 ? fromUrl : stored;
  try {
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(merged));
  } catch {}
  return merged;
}

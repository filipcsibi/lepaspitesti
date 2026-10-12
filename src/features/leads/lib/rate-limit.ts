import { headers } from "next/headers";

/**
 * Flood protection for the lead forms, on top of the honeypot and the minimum fill time.
 *
 * Counters live in the memory of the running server instance, so this stops a script hammering the form
 * rather than a distributed attack — for that, add a rate-limit rule in the Vercel Firewall.
 */
const WINDOW_MS = 10 * 60 * 1000;
/** Submissions accepted from one address within the window. */
const MAX_PER_ADDRESS = 5;

const byAddress = new Map<string, number[]>();
const recentPhones = new Map<string, number>();

function prune(now: number) {
  for (const [key, times] of byAddress) {
    const fresh = times.filter((t) => now - t < WINDOW_MS);
    if (fresh.length > 0) byAddress.set(key, fresh);
    else byAddress.delete(key);
  }
  for (const [phone, time] of recentPhones) {
    if (now - time >= WINDOW_MS) recentPhones.delete(phone);
  }
}

/** True when this visitor has already sent too many requests in the last few minutes. */
export async function isFlooding(): Promise<boolean> {
  const forwarded = (await headers()).get("x-forwarded-for");
  const address = forwarded?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  prune(now);
  const times = byAddress.get(address) ?? [];
  if (times.length >= MAX_PER_ADDRESS) return true;
  byAddress.set(address, [...times, now]);
  return false;
}

/** True when a request with this key was already delivered a moment ago (double click, resubmission). */
export function isDuplicate(key: string): boolean {
  const last = recentPhones.get(key);
  return !!last && Date.now() - last < WINDOW_MS;
}

/** Remembers a delivered request. Only delivered ones count: a failed attempt can be sent again. */
export function rememberDelivered(key: string) {
  recentPhones.set(key, Date.now());
}

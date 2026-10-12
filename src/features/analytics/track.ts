"use client";

/**
 * Ad & analytics IDs — set them in Vercel → Settings → Environment Variables.
 * Nothing loads for an ID that is not set.
 *
 *   NEXT_PUBLIC_META_PIXEL_ID          Meta (Facebook/Instagram) Pixel ID
 *   NEXT_PUBLIC_GA_ID                  Google Analytics 4, e.g. "G-XXXXXXX"
 *   NEXT_PUBLIC_GOOGLE_ADS_ID          Google Ads, e.g. "AW-123456789"
 *   NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL  conversion label of the "lead" conversion action
 */
export const trackingIds = {
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  ga: process.env.NEXT_PUBLIC_GA_ID,
  googleAds: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  googleAdsLeadLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
};

type Tracker = (...args: unknown[]) => void;
declare global {
  interface Window {
    fbq?: Tracker;
    gtag?: Tracker;
    dataLayer?: unknown[];
  }
}

const PENDING_LEAD_KEY = "lepas-pending-lead";

/** Called by the form right before redirecting to the thank-you page. */
export function markLeadSubmitted(model: string) {
  try {
    sessionStorage.setItem(PENDING_LEAD_KEY, model);
  } catch {}
}

/**
 * Fires the "Lead" conversion once per real submission (thank-you page).
 * Reloading or opening the thank-you URL directly does not count again.
 * Returns true once the pending lead has been consumed.
 */
export function trackPendingLead(): boolean {
  let model: string | null = null;
  try {
    model = sessionStorage.getItem(PENDING_LEAD_KEY);
  } catch {}
  if (!model) return true;

  const needsMeta = !!trackingIds.metaPixel;
  const needsGoogle = !!(trackingIds.ga || trackingIds.googleAds);
  // Scripts load only after consent; wait until whichever are configured are ready.
  if ((needsMeta && !window.fbq) || (needsGoogle && !window.gtag)) return false;

  window.fbq?.("track", "Lead", { content_name: model, content_category: "test_drive" });
  window.gtag?.("event", "generate_lead", { item_name: model, lead_type: "test_drive" });
  if (trackingIds.googleAds && trackingIds.googleAdsLeadLabel) {
    window.gtag?.("event", "conversion", { send_to: `${trackingIds.googleAds}/${trackingIds.googleAdsLeadLabel}` });
  }
  try {
    sessionStorage.removeItem(PENDING_LEAD_KEY);
  } catch {}
  return true;
}

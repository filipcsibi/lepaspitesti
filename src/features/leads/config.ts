/**
 * Leads: what the site's forms (test drive / offer, contact) collect and where it is sent.
 * Delivery channels are configured with environment variables — see `lib/lead-delivery.ts`.
 */

export type LeadModelSlug = "lepas-l8" | "lepas-l6-phev" | "lepas-l6-bev" | "lepas-l4";

/**
 * Models a visitor can ask about.
 * `note` adds a label next to the name: "preorder" (can be ordered, not yet driven) or "comingSoon".
 * `crmModel` is the model name SalesPartner expects (without the brand or the drivetrain).
 */
export const leadModels: { slug: LeadModelSlug; name: string; crmModel: string; note?: "preorder" | "comingSoon" }[] = [
  { slug: "lepas-l8", name: "LEPAS L8", crmModel: "L8" },
  { slug: "lepas-l6-phev", name: "LEPAS L6 PHEV", crmModel: "L6", note: "preorder" },
  { slug: "lepas-l6-bev", name: "LEPAS L6 BEV", crmModel: "L6", note: "comingSoon" },
  { slug: "lepas-l4", name: "LEPAS L4", crmModel: "L4", note: "comingSoon" },
];

/** "When would you like to come?" — one-tap lead qualifier. */
export const timeframes = ["asap", "week", "month", "research"] as const;
export type Timeframe = (typeof timeframes)[number];

/** Ad attribution parameters captured from the landing URL and stored with the lead. */
export const attributionParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "ttclid",
] as const;

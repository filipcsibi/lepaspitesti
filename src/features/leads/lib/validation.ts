import { attributionParams, leadModels, timeframes, type LeadModelSlug, type Timeframe } from "../config";

export type LeadField = "name" | "phone" | "email" | "consent";

export type LeadSource = "test-drive" | "contact";

export type Lead = {
  /** Which form the lead came from. */
  source: LeadSource;
  name: string;
  /** Normalised to +40XXXXXXXXX when it is a Romanian number. */
  phone: string;
  email: string;
  model: LeadModelSlug;
  timeframe?: Timeframe;
  /** Free text from the contact form. */
  message?: string;
  tradeIn: boolean;
  locale: string;
  /** Page the form was submitted from. */
  page: string;
  attribution: Record<string, string>;
  submittedAt: string;
};

/**
 * Accepts Romanian numbers written as 07xx…, +407xx…, 00407xx… (mobile or landline)
 * and other international numbers in +<country> format. Returns E.164 or null.
 */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/[\s().\-/]/g, "");
  const ro = digits.match(/^(?:\+40|0040|0)([237]\d{8})$/);
  if (ro) return `+40${ro[1]}`;
  if (/^\+[1-9]\d{7,14}$/.test(digits)) return digits;
  return null;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validates the submitted form. Returns the lead or the list of invalid fields. */
export function parseLead(form: FormData, source: LeadSource): { lead: Lead } | { errors: LeadField[] } {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const errors: LeadField[] = [];

  const name = text("name").replace(/\s+/g, " ");
  if (name.length < 3 || name.length > 80 || !/\p{L}/u.test(name)) errors.push("name");

  const phone = normalizePhone(text("phone"));
  if (!phone) errors.push("phone");

  const email = text("email").toLowerCase();
  // The CRM refuses a lead without an e-mail address.
  if (!EMAIL.test(email) || email.length > 120) errors.push("email");

  if (form.get("consent") !== "on") errors.push("consent");

  if (errors.length > 0 || !phone) return { errors };

  // Every lead is about a model (the CRM needs one); an unknown value falls back to the first.
  const model = leadModels.find((m) => m.slug === text("model"))?.slug ?? leadModels[0].slug;
  const message = text("message").replace(/\s+/g, " ").slice(0, 1000);
  const timeframe = timeframes.find((t) => t === text("timeframe"));
  const attribution: Record<string, string> = {};
  for (const key of attributionParams) {
    const value = text(key).slice(0, 200);
    if (value) attribution[key] = value;
  }

  return {
    lead: {
      source,
      name,
      phone,
      email,
      model,
      timeframe,
      message: message || undefined,
      tradeIn: form.get("tradeIn") === "on",
      locale: text("locale") || "ro",
      page: text("page").slice(0, 300),
      attribution,
      submittedAt: new Date().toISOString(),
    },
  };
}

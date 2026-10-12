"use server";

import { deliverLead } from "./lib/lead-delivery";
import { isDuplicate, isFlooding, rememberDelivered } from "./lib/rate-limit";
import { parseLead, type LeadField, type LeadSource } from "./lib/validation";

export type LeadFormState =
  | { status: "idle" }
  | { status: "invalid"; fields: LeadField[] }
  | { status: "error" }
  | { status: "success"; model: string };

/** Bots fill hidden fields and submit instantly; people do neither. */
const MIN_FILL_TIME_MS = 2500;

async function submit(form: FormData, source: LeadSource): Promise<LeadFormState> {
  const honeypot = String(form.get("company") ?? "");
  const startedAt = Number(form.get("startedAt"));
  const tooFast = Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_TIME_MS;
  if (honeypot || tooFast) {
    // Pretend it worked so bots don't adapt; nothing is delivered.
    return { status: "success", model: String(form.get("model") ?? "") };
  }

  const parsed = parseLead(form, source);
  if ("errors" in parsed) return { status: "invalid", fields: parsed.errors };

  // Too many requests from one address: ask them to call instead of filling the CRM.
  if (await isFlooding()) return { status: "error" };
  // The same person sending the same request again already has a lead: nothing more to deliver.
  const key = `${source}:${parsed.lead.phone}`;
  if (isDuplicate(key)) return { status: "success", model: parsed.lead.model };

  const { ok } = await deliverLead(parsed.lead);
  if (!ok) return { status: "error" };
  rememberDelivered(key);
  return { status: "success", model: parsed.lead.model };
}

/** Test-drive / offer form on the landing pages. */
export async function submitTestDriveRequest(_prev: LeadFormState, form: FormData): Promise<LeadFormState> {
  return submit(form, "test-drive");
}

/** Contact form on `/contact`. */
export async function submitContactRequest(_prev: LeadFormState, form: FormData): Promise<LeadFormState> {
  return submit(form, "contact");
}

import { leadModels } from "../config";
import { salesPartner } from "../crm";
import type { Lead } from "./validation";

type Credentials = { url: string; apiKey: string; apiSecret: string };

const sourceLabels: Record<Lead["source"], string> = {
  "test-drive": "Test drive / ofertă",
  contact: "Formular de contact",
};

const timeframeLabels: Record<string, string> = {
  asap: "cât mai curând",
  week: "săptămâna aceasta",
  month: "luna aceasta",
  research: "doar se informează",
};

/** "Ion Popescu" → first_name "Ion", name "Popescu" (the CRM stores them separately). */
function splitName(full: string) {
  const [first, ...rest] = full.split(/\s+/);
  return { first_name: first, name: rest.length > 0 ? rest.join(" ") : first };
}

/** Everything the CRM has no field for goes in the comment, so the consultant sees it. */
function buildComment(lead: Lead) {
  const model = leadModels.find((m) => m.slug === lead.model);
  const parts = [sourceLabels[lead.source]];
  if (model) parts.push(model.name);
  if (lead.timeframe) parts.push(`Când: ${timeframeLabels[lead.timeframe]}`);
  if (lead.tradeIn) parts.push("Are mașină de dat la schimb");
  if (lead.message) parts.push(`Mesaj: ${lead.message}`);
  if (lead.page) parts.push(`Pagină: ${lead.page}`);
  const attribution = Object.entries(lead.attribution)
    .map(([key, value]) => `${key}=${value}`)
    .join(", ");
  if (attribution) parts.push(attribution);
  return parts.join(" | ");
}

function buildPayload(lead: Lead, intentionToBuy: string) {
  return {
    email: lead.email,
    phone: lead.phone,
    ...splitName(lead.name),
    brand: salesPartner.brand,
    model: leadModels.find((m) => m.slug === lead.model)?.crmModel ?? "",
    channel: salesPartner.channel,
    vehicle_used_status: salesPartner.vehicleUsedStatus,
    comment: buildComment(lead),
    site: salesPartner.site,
    vehicle_type: salesPartner.vehicleType,
    intention_to_buy: intentionToBuy,
    dealer_work_place_code: salesPartner.dealerWorkPlaceCode,
  };
}

async function post(payload: object, { url, apiKey, apiSecret }: Credentials) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-Key": apiKey, "X-API-Secret": apiSecret },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  if (response.status === 200) return { ok: true as const };
  const body = await response.json().catch(() => null);
  return { ok: false as const, status: response.status, message: String(body?.message ?? "") };
}

/** Creates the lead in SalesPartner. Throws when the CRM does not accept it. */
export async function sendToSalesPartner(lead: Lead, credentials: Credentials) {
  const { intentionToBuy } = salesPartner;
  const intention = lead.timeframe ? intentionToBuy[lead.timeframe] : intentionToBuy.default;

  let result = await post(buildPayload(lead, intention), credentials);
  // A validation error on a mapped value must not cost the lead: send it again with the known-good default.
  if (
    !result.ok &&
    result.status === 400 &&
    intention !== intentionToBuy.default &&
    /intention/i.test(result.message)
  ) {
    console.warn(`[leads] SalesPartner rejected intention_to_buy "${intention}": ${result.message}`);
    result = await post(buildPayload(lead, intentionToBuy.default), credentials);
  }
  if (!result.ok) throw new Error(`SalesPartner responded ${result.status}: ${result.message}`);
}

import { Resend } from "resend";
import { leadModels } from "../config";
import { sendToSalesPartner } from "./salespartner";
import type { Lead } from "./validation";

/**
 * Sends a lead to the dealership. Channels (any combination), configured with env vars:
 *
 *   SalesPartner CRM (the lead is created directly in the CRM)
 *     CRM_WEBHOOK_URL_LEPAS   lead endpoint of the lepas-ims SalesPartner instance
 *     CRM_API_KEY_LEPAS       sent as X-API-Key
 *     CRM_API_SECRET_LEPAS    sent as X-API-Secret
 *
 *   E-mail (Resend, via the Vercel Marketplace integration)
 *     RESEND_API_KEY     set automatically by the integration
 *     LEAD_EMAIL_TO      where leads go, e.g. "vanzari@exemplu.ro" (comma-separated for several)
 *     LEAD_EMAIL_FROM    verified sender, e.g. "LEPAS Pitești <leads@lepaspitesti.ro>"
 *
 *   Webhook (CRM, Google Sheets, Zapier, Make…)
 *     LEAD_WEBHOOK_URL   receives the lead as a JSON POST
 *
 * A lead counts as delivered when at least one channel succeeds.
 */
export async function deliverLead(lead: Lead): Promise<{ ok: boolean }> {
  const channels: Promise<void>[] = [];
  const { RESEND_API_KEY, LEAD_EMAIL_TO, LEAD_EMAIL_FROM, LEAD_WEBHOOK_URL } = process.env;
  const { CRM_WEBHOOK_URL_LEPAS, CRM_API_KEY_LEPAS, CRM_API_SECRET_LEPAS } = process.env;

  if (CRM_WEBHOOK_URL_LEPAS && CRM_API_KEY_LEPAS && CRM_API_SECRET_LEPAS) {
    channels.push(
      sendToSalesPartner(lead, {
        url: CRM_WEBHOOK_URL_LEPAS,
        apiKey: CRM_API_KEY_LEPAS,
        apiSecret: CRM_API_SECRET_LEPAS,
      }),
    );
  }
  if (RESEND_API_KEY && LEAD_EMAIL_TO && LEAD_EMAIL_FROM) {
    channels.push(sendEmail(lead, RESEND_API_KEY, LEAD_EMAIL_FROM, LEAD_EMAIL_TO));
  }
  if (LEAD_WEBHOOK_URL) {
    channels.push(postWebhook(lead, LEAD_WEBHOOK_URL));
  }

  if (channels.length === 0) {
    // Local development without credentials: show the lead in the terminal.
    if (process.env.NODE_ENV !== "production") {
      console.info("[leads] lead (no delivery channel configured):", lead);
      return { ok: true };
    }
    console.error("[leads] No lead delivery channel configured — lead NOT delivered.");
    return { ok: false };
  }

  const results = await Promise.allSettled(channels);
  for (const r of results) {
    if (r.status === "rejected") console.error("[leads] delivery channel failed:", r.reason);
  }
  return { ok: results.some((r) => r.status === "fulfilled") };
}

const timeframeLabels: Record<string, string> = {
  asap: "Cât mai curând",
  week: "Săptămâna aceasta",
  month: "Luna aceasta",
  research: "Doar se informează",
};

function leadRows(lead: Lead): [string, string][] {
  const model = leadModels.find((m) => m.slug === lead.model)?.name ?? lead.model;
  const rows: [string, string][] = [
    ["Formular", lead.source === "contact" ? "Contact" : "Test drive / ofertă"],
    ["Nume", lead.name],
    ["Telefon", lead.phone],
    ["E-mail", lead.email],
    ["Model", model],
    ["Când vrea să vină", lead.timeframe ? timeframeLabels[lead.timeframe] : "nespecificat"],
    ["Mașină la schimb", lead.tradeIn ? "DA" : "nu"],
    ["Mesaj", lead.message ?? "—"],
    ["Limbă", lead.locale],
    ["Pagină", lead.page || "—"],
  ];
  for (const [key, value] of Object.entries(lead.attribution)) rows.push([key, value]);
  rows.push(["Trimis la", new Date(lead.submittedAt).toLocaleString("ro-RO", { timeZone: "Europe/Bucharest" })]);
  return rows;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function sendEmail(lead: Lead, apiKey: string, from: string, to: string) {
  const rows = leadRows(lead);
  const model = rows[4][1];
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: to.split(",").map((s) => s.trim()),
    replyTo: lead.email,
    subject: `Lead ${model} – ${lead.name}${lead.timeframe === "asap" ? " (cât mai curând)" : ""}`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    html: `<h2 style="font-family:sans-serif">Cerere nouă – ${escapeHtml(model)}</h2>
<p style="font-family:sans-serif"><a href="tel:${escapeHtml(lead.phone)}" style="font-size:20px">${escapeHtml(lead.phone)}</a></p>
<table style="font-family:sans-serif;border-collapse:collapse">${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 16px 6px 0;color:#666">${escapeHtml(k)}</td><td style="padding:6px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
      )
      .join("")}</table>`,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

async function postWebhook(lead: Lead, url: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

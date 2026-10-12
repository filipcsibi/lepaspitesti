import type { Timeframe } from "./config";

/**
 * SalesPartner (CRM) — the fixed values sent with every lead from this site.
 * Server only: imported by the delivery code, never by the forms.
 * The endpoint and keys come from the environment: CRM_WEBHOOK_URL_LEPAS, CRM_API_KEY_LEPAS, CRM_API_SECRET_LEPAS.
 */
export const salesPartner = {
  brand: "LEPAS",
  channel: "WEBSITE",
  site: "lepaspitesti.ro",
  vehicleUsedStatus: "NOU",
  vehicleType: "AUTOTURISM",
  /** Dealer location code of LEPAS Pitești (Paneuro) in lepas-ims. */
  dealerWorkPlaceCode: "D-0010-01",
  /**
   * "Intention to buy", from the visitor's answer to "When would you like to come?".
   * `default` is used when there is no answer (contact form, or the question was skipped) and is the
   * value already accepted by the CRM for the Meta lead forms; if the CRM rejects another value,
   * the lead is sent again with `default`.
   */
  intentionToBuy: {
    asap: "1M",
    week: "1M",
    month: "1M",
    research: "6M",
    default: "3M",
  } satisfies Record<Timeframe | "default", string>,
};

"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { startTransition, useActionState, useEffect, useState, type FormEvent } from "react";
import { markLeadSubmitted } from "@/features/analytics";
import { Link, useRouter } from "@/i18n/navigation";
import { traseu } from "@/shared/ui/traseu";
import {
  leadModels,
  readAttribution,
  submitTestDriveRequest,
  timeframes,
  type LeadField,
  type LeadFormState,
} from "@/features/leads";
import type { TestDriveModelSlug } from "../config";
import styles from "./LeadForm.module.css";

type Props = {
  /** Model the page is about; preselected in the form. */
  model: TestDriveModelSlug;
  /** Let the visitor pick another model (general test-drive page). */
  showModelSelect?: boolean;
  /** Per-landing wording: a test drive for one model, a pre-order offer for another. */
  title: string;
  subtitle: string;
  submitLabel: string;
};

/**
 * Test-drive lead form. Kept deliberately short: name + phone are the only required fields;
 * the timeframe chips and trade-in checkbox qualify the lead with one tap each.
 */
export function LeadForm({ model, showModelSelect, title, subtitle, submitLabel }: Props) {
  const t = useTranslations("testDrive.form");
  const locale = useLocale();
  const router = useRouter();
  const [state, action, pending] = useActionState<LeadFormState, FormData>(submitTestDriveRequest, { status: "idle" });
  const [client, setClient] = useState<{ startedAt: number; page: string; attribution: Record<string, string> } | null>(
    null,
  );

  const [selectedModel, setSelectedModel] = useState<string>(model);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only values (clock, URL, sessionStorage)
    setClient({ startedAt: Date.now(), page: window.location.pathname, attribution: readAttribution() });
    // A model page can send the visitor here with its model already chosen (`?model=lepas-l6-bev`).
    const requested = new URLSearchParams(window.location.search).get("model");
    if (leadModels.some((m) => m.slug === requested)) setSelectedModel(requested!);
  }, []);

  // Submitting through `action={…}` would clear the fields when validation fails; this keeps what was typed.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  };

  useEffect(() => {
    if (state.status !== "success") return;
    markLeadSubmitted(state.model);
    router.push("/test-drive/thanks");
  }, [state, router]);

  const invalid = (field: LeadField) => state.status === "invalid" && state.fields.includes(field);
  const fieldError = (field: LeadField) =>
    invalid(field) ? (
      <p className={styles.error} id={`lead-${field}-error`} role="alert">
        {t(`errors.${field}`)}
      </p>
    ) : null;

  return (
    <form id="formular" action={action} onSubmit={onSubmit} className={clsx(traseu.surface, styles.form)} noValidate>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>

      <label className={styles.field}>
        <span className={styles.label}>{t("name")}</span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          required
          aria-invalid={invalid("name") || undefined}
          aria-describedby={invalid("name") ? "lead-name-error" : undefined}
        />
        {fieldError("name")}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>{t("phone")}</span>
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={t("phonePlaceholder")}
          required
          aria-invalid={invalid("phone") || undefined}
          aria-describedby={invalid("phone") ? "lead-phone-error" : undefined}
        />
        {fieldError("phone")}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>{t("email")}</span>
        <input
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          required
          aria-invalid={invalid("email") || undefined}
          aria-describedby={invalid("email") ? "lead-email-error" : undefined}
        />
        {fieldError("email")}
      </label>

      {showModelSelect ? (
        <label className={styles.field}>
          <span className={styles.label}>{t("model")}</span>
          <select name="model" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
            {leadModels.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name}
                {m.note ? ` – ${t(m.note)}` : ""}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <input type="hidden" name="model" value={model} />
      )}

      <fieldset className={styles.chips}>
        <legend className={styles.label}>
          {t("timeframe")} <em>({t("optional")})</em>
        </legend>
        <div className={styles.chipRow}>
          {timeframes.map((value) => (
            <label key={value} className={styles.chip}>
              <input type="radio" name="timeframe" value={value} />
              <span>{t(`timeframes.${value}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className={styles.check}>
        <input type="checkbox" name="tradeIn" />
        <span>{t("tradeIn")}</span>
      </label>

      <label className={styles.check}>
        <input
          type="checkbox"
          name="consent"
          required
          aria-invalid={invalid("consent") || undefined}
          aria-describedby={invalid("consent") ? "lead-consent-error" : undefined}
        />
        <span>
          {t.rich("consent", {
            privacy: (chunks) => (
              <Link href="/privacy" target="_blank" className={styles.link}>
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>
      {fieldError("consent")}

      {/* Anti-spam: hidden from people, irresistible to bots. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="startedAt" value={client?.startedAt ?? ""} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="page" value={client?.page ?? ""} />
      {client &&
        Object.entries(client.attribution).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}

      {state.status === "error" && (
        <p className={styles.formError} role="alert">
          {t("errors.generic")}
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? t("submitting") : submitLabel}
      </button>
      <p className={styles.reassurance}>{t("reassurance")}</p>
    </form>
  );
}

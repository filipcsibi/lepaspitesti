"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { startTransition, useActionState, useEffect, useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import { traseu } from "@/shared/ui/traseu";
import { submitContactRequest, type LeadFormState } from "../actions";
import { leadModels } from "../config";
import { readAttribution } from "../lib/attribution";
import type { LeadField } from "../lib/validation";
import styles from "./ContactForm.module.css";

/** Contact form: name, phone and a model are required; e-mail and the message are optional. */
export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [state, action, pending] = useActionState<LeadFormState, FormData>(submitContactRequest, { status: "idle" });
  const [client, setClient] = useState<{ startedAt: number; page: string; attribution: Record<string, string> } | null>(
    null,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only values (clock, URL, sessionStorage)
    setClient({ startedAt: Date.now(), page: window.location.pathname, attribution: readAttribution() });
  }, []);

  // Submitting through `action={…}` would clear the fields when validation fails; this keeps what was typed.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  };

  const invalid = (field: LeadField) => state.status === "invalid" && state.fields.includes(field);
  const fieldError = (field: LeadField) =>
    invalid(field) ? (
      <p className={styles.error} id={`contact-${field}-error`} role="alert">
        {t(`errors.${field}`)}
      </p>
    ) : null;

  if (state.status === "success") {
    return (
      <div className={clsx(traseu.surface, styles.form, styles.done)} role="status">
        <h2 className={styles.title}>{t("successTitle")}</h2>
        <p className={styles.subtitle}>{t("successText")}</p>
      </div>
    );
  }

  return (
    <form action={action} onSubmit={onSubmit} className={clsx(traseu.surface, styles.form)} noValidate>
      <h2 className={styles.title}>{t("title")}</h2>
      <p className={styles.subtitle}>{t("subtitle")}</p>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>{t("name")}</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            required
            aria-invalid={invalid("name") || undefined}
            aria-describedby={invalid("name") ? "contact-name-error" : undefined}
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
            aria-describedby={invalid("phone") ? "contact-phone-error" : undefined}
          />
          {fieldError("phone")}
        </label>
      </div>

      <div className={styles.row}>
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
            aria-describedby={invalid("email") ? "contact-email-error" : undefined}
          />
          {fieldError("email")}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("model")}</span>
          <select name="model" defaultValue={leadModels[0].slug}>
            {leadModels.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>
          {t("message")} <em>({t("optional")})</em>
        </span>
        <textarea name="message" rows={4} maxLength={1000} placeholder={t("messagePlaceholder")} />
      </label>

      <label className={styles.check}>
        <input
          type="checkbox"
          name="consent"
          required
          aria-invalid={invalid("consent") || undefined}
          aria-describedby={invalid("consent") ? "contact-consent-error" : undefined}
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
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

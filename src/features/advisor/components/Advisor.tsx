"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useState, type CSSProperties } from "react";
import { traseu, TraseuButton, TraseuTabs } from "@/shared/ui/traseu";
import { Reveal } from "@/shared/ui/motion";
import { advisorInputs as inputs, consumption } from "../config";
import { calculate, type Variant } from "../lib/calculate";
import styles from "./Advisor.module.css";

const accents: Record<Variant | "petrol", string> = { phev: "#eb9201", bev: "#00a985", petrol: "#969392" };
const modelSlug: Record<Variant, string> = { phev: "lepas-l6-phev", bev: "lepas-l6-bev" };

type Props = {
  /** The page the advisor sits on — its own version is not offered as a link. */
  current?: Variant;
};

/** "PHEV sau BEV?" — a few questions, a recommendation and the monthly running cost of each version. */
export function Advisor({ current }: Props) {
  const t = useTranslations("advisor");
  const locale = useLocale();
  const [dailyKm, setDailyKm] = useState<number>(inputs.dailyKm.initial);
  const [longTrips, setLongTrips] = useState<number>(inputs.longTrips.initial);
  const [homeCharging, setHomeCharging] = useState(true);
  const [homePrice, setHomePrice] = useState<number>(inputs.homeElectricity.initial);
  const [publicPrice, setPublicPrice] = useState<number>(inputs.publicElectricity.initial);
  const [fuelPrice, setFuelPrice] = useState<number>(inputs.fuel.initial);

  const electricity = homeCharging
    ? { ...inputs.homeElectricity, value: homePrice, set: setHomePrice, label: t("inputs.homeElectricity") }
    : { ...inputs.publicElectricity, value: publicPrice, set: setPublicPrice, label: t("inputs.publicElectricity") };

  const result = calculate({ dailyKm, longTrips, homeCharging, electricityPrice: electricity.value, fuelPrice });
  const lei = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const price = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const max = Math.max(result.monthly.phev, result.monthly.bev, result.monthly.petrol, 1);
  const accent = accents[result.recommended];
  const yearlySaving = (result.monthly.petrol - result.monthly[result.recommended]) * 12;

  const rows: { id: Variant | "petrol"; label: string; value: number }[] = [
    { id: "bev", label: t("rows.bev"), value: result.monthly.bev },
    { id: "phev", label: t("rows.phev"), value: result.monthly.phev },
    { id: "petrol", label: t("rows.petrol"), value: result.monthly.petrol },
  ];

  const slider = (
    id: string,
    label: string,
    display: string,
    range: { min: number; max: number; step: number },
    value: number,
    set: (v: number) => void,
  ) => (
    <label className={styles.field} htmlFor={`advisor-${id}`}>
      <span className={styles.fieldHead}>
        <span>{label}</span>
        <output className={styles.fieldValue}>{display}</output>
      </span>
      <input
        id={`advisor-${id}`}
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        style={{ "--fill": `${((value - range.min) / (range.max - range.min)) * 100}%` } as CSSProperties}
      />
    </label>
  );

  return (
    <section className={styles.section} style={{ "--accent": accent, "--traseu-accent": accent } as CSSProperties}>
      <header className={styles.header}>
        <Reveal as="p" className={styles.eyebrow}>
          {t("eyebrow")}
        </Reveal>
        <Reveal as="h2" className={styles.title} delay={0.05}>
          {t("title")}
        </Reveal>
        <Reveal as="p" className={styles.text} delay={0.1}>
          {t("text")}
        </Reveal>
      </header>

      <div className={styles.grid}>
        <div className={clsx(traseu.surface, styles.card, styles.inputs)}>
          {slider("daily", t("inputs.dailyKm"), `${dailyKm} km`, inputs.dailyKm, dailyKm, setDailyKm)}
          {slider(
            "trips",
            t("inputs.longTrips"),
            t("inputs.longTripsValue", { count: longTrips }),
            inputs.longTrips,
            longTrips,
            setLongTrips,
          )}
          <div className={styles.field}>
            <span className={styles.fieldHead}>
              <span>{t("inputs.homeCharging")}</span>
            </span>
            <TraseuTabs
              label={t("inputs.homeCharging")}
              className={styles.toggle}
              value={homeCharging ? "yes" : "no"}
              onChange={(v) => setHomeCharging(v === "yes")}
              options={[
                { value: "yes", label: t("inputs.yes") },
                { value: "no", label: t("inputs.no") },
              ]}
            />
          </div>
          {slider(
            "electricity",
            electricity.label,
            `${price.format(electricity.value)} lei/kWh`,
            electricity,
            electricity.value,
            electricity.set,
          )}
          {slider("fuel", t("inputs.fuel"), `${price.format(fuelPrice)} lei/l`, inputs.fuel, fuelPrice, setFuelPrice)}
        </div>

        <div className={clsx(traseu.surface, styles.card, styles.result)} aria-live="polite">
          <p className={styles.resultLabel}>{t("result.label")}</p>
          <p className={styles.resultName}>
            LEPAS L6 <strong>{result.recommended.toUpperCase()}</strong>
          </p>
          <p className={styles.resultReason}>
            {t(`reasons.${result.reason}`, {
              dailyKm,
              times: Math.max(1, Math.floor(consumption.bev.rangeKm / dailyKm)),
              share: Math.round(result.phevElectricShare * 100),
            })}
          </p>

          <ul className={styles.bars}>
            {rows.map((row) => (
              <li
                key={row.id}
                className={clsx(styles.bar, row.id === result.recommended && styles.barActive)}
                style={{ "--bar": accents[row.id], "--w": `${(row.value / max) * 100}%` } as CSSProperties}
              >
                <span className={styles.barLabel}>{row.label}</span>
                <span className={styles.barTrack}>
                  <span className={styles.barFill} />
                </span>
                <span className={styles.barValue}>
                  {lei.format(row.value)} <small>{t("result.perMonth")}</small>
                </span>
              </li>
            ))}
          </ul>

          {yearlySaving > 0 && (
            <p className={styles.saving}>{t("result.saving", { amount: lei.format(yearlySaving) })}</p>
          )}

          <div className={styles.actions}>
            {result.recommended !== current && (
              <TraseuButton
                href={{ pathname: "/models/[slug]", params: { slug: modelSlug[result.recommended] } }}
                tint={accent}
              >
                {t("result.discover", { variant: result.recommended.toUpperCase() })}
              </TraseuButton>
            )}
            <TraseuButton href="/test-drive">{t("result.offer")}</TraseuButton>
          </div>
        </div>
      </div>

      <p className={styles.footnote}>{t("footnote")}</p>
    </section>
  );
}

"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useId, useMemo, useState, type CSSProperties } from "react";
import { TraseuTabs } from "@/shared/ui/traseu";
import { Reveal } from "@/shared/ui/motion";
import { destinations, origin, rangeModes, roadFactor, type RangeModeId } from "../config";
import { mapSize, outlinePath, project } from "../lib/projection";
import styles from "./RangeMap.module.css";

type Props = {
  /** Which versions can be picked (default: all). One mode hides the picker. */
  modes?: RangeModeId[];
  initialMode?: RangeModeId;
};

type Trip = "oneWay" | "roundTrip";

const [originX, originY] = project(origin.lon, origin.lat);
const cities = destinations.map((d) => {
  const [x, y] = project(d.lon, d.lat);
  return { ...d, x, y };
});

/** Interactive map of Romania: how far each LEPAS L6 version gets from Pitești without stopping. */
export function RangeMap({ modes, initialMode }: Props) {
  const t = useTranslations("rangeMap");
  const locale = useLocale();
  const clipId = useId();
  const glowId = useId();
  const available = useMemo(() => rangeModes.filter((m) => !modes || modes.includes(m.id)), [modes]);
  const [modeId, setModeId] = useState<RangeModeId>(initialMode ?? available[0].id);
  const [trip, setTrip] = useState<Trip>("oneWay");
  const [focused, setFocused] = useState<string | null>(null);

  const mode = available.find((m) => m.id === modeId) ?? available[0];
  const reachKm = trip === "roundTrip" ? mode.rangeKm / 2 : mode.rangeKm;
  const reachable = cities.filter((c) => c.roadKm <= reachKm);
  const number = new Intl.NumberFormat(locale);

  return (
    <section
      className={styles.section}
      style={{ "--accent": mode.accent, "--traseu-accent": mode.accent } as CSSProperties}
    >
      <div className={styles.copy}>
        <Reveal as="p" className={styles.eyebrow}>
          {t("eyebrow")}
        </Reveal>
        <Reveal as="h2" className={styles.title} delay={0.05}>
          {t("title")}
        </Reveal>
        <Reveal as="p" className={styles.text} delay={0.1}>
          {t("text")}
        </Reveal>

        <div className={styles.controls}>
          {available.length > 1 && (
            <TraseuTabs
              label={t("modeLabel")}
              className={styles.tabs}
              value={mode.id}
              onChange={setModeId}
              options={available.map((m) => ({ value: m.id, label: t(`modes.${m.labelKey}`) }))}
            />
          )}
          <TraseuTabs
            label={t("tripLabel")}
            className={clsx(styles.tabs, styles.tripTabs)}
            value={trip}
            onChange={setTrip}
            options={[
              { value: "oneWay", label: t("oneWay") },
              { value: "roundTrip", label: t("roundTrip") },
            ]}
          />
        </div>

        <div className={styles.readout} aria-live="polite">
          <p className={styles.range}>
            <span key={`${mode.id}-${trip}`} className={styles.rangeValue}>
              {number.format(Math.round(reachKm))}
            </span>
            <span className={styles.rangeUnit}>km</span>
          </p>
          <p className={styles.rangeCaption}>
            {t(`hints.${mode.labelKey}`)}
            {trip === "roundTrip" && <> · {t("roundTripHint")}</>}
          </p>
          <p className={styles.summary}>
            {reachable.length === cities.length
              ? t("allReachable")
              : t("summary", { count: reachable.length, total: cities.length })}
          </p>
        </div>

        <ul className={styles.cities}>
          {cities.map((c) => {
            const ok = c.roadKm <= reachKm;
            return (
              <li key={c.name}>
                <button
                  type="button"
                  className={clsx(styles.city, ok && styles.cityOk, focused === c.name && styles.cityFocused)}
                  onPointerEnter={() => setFocused(c.name)}
                  onPointerLeave={() => setFocused(null)}
                  onFocus={() => setFocused(c.name)}
                  onBlur={() => setFocused(null)}
                  aria-label={`${c.name}, ${c.roadKm} km – ${ok ? t("reachable") : t("notReachable")}`}
                >
                  <span className={styles.cityDot} aria-hidden="true" />
                  {c.name}
                  <small>{c.roadKm} km</small>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.mapWrap}>
        <svg
          className={styles.map}
          viewBox={`0 0 ${mapSize.width} ${mapSize.height}`}
          role="img"
          aria-label={t("mapLabel")}
        >
          <defs>
            <clipPath id={clipId}>
              <path d={outlinePath} />
            </clipPath>
            <radialGradient id={glowId}>
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
              <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.1" />
            </radialGradient>
          </defs>

          <path d={outlinePath} className={styles.country} />

          {/* The part of the country within range. */}
          <g clipPath={`url(#${clipId})`}>
            <circle
              cx={originX}
              cy={originY}
              className={styles.reach}
              fill={`url(#${glowId})`}
              style={{ r: reachKm / roadFactor } as CSSProperties}
            />
          </g>
          <circle
            cx={originX}
            cy={originY}
            className={styles.ring}
            style={{ r: reachKm / roadFactor } as CSSProperties}
          />

          {cities.map((c) => {
            const ok = c.roadKm <= reachKm;
            return (
              <line
                key={c.name}
                x1={originX}
                y1={originY}
                x2={c.x}
                y2={c.y}
                className={clsx(styles.route, ok && styles.routeOk, focused === c.name && styles.routeFocused)}
              />
            );
          })}

          {cities.map((c) => {
            const ok = c.roadKm <= reachKm;
            const side = c.label ?? "right";
            const dx = side === "left" ? -11 : side === "right" ? 11 : 0;
            const dy = side === "top" ? -12 : side === "bottom" ? 22 : 5;
            return (
              <g
                key={c.name}
                className={clsx(styles.place, ok && styles.placeOk, focused === c.name && styles.placeFocused)}
                onPointerEnter={() => setFocused(c.name)}
                onPointerLeave={() => setFocused(null)}
              >
                <circle cx={c.x} cy={c.y} r={16} className={styles.hit} />
                <circle cx={c.x} cy={c.y} r={5} className={styles.dot} />
                <text
                  x={c.x + dx}
                  y={c.y + dy}
                  textAnchor={side === "left" ? "end" : side === "right" ? "start" : "middle"}
                  className={styles.placeName}
                >
                  {c.name}
                </text>
              </g>
            );
          })}

          <g className={styles.origin}>
            <circle cx={originX} cy={originY} r={9} className={styles.originPulse} />
            <circle cx={originX} cy={originY} r={7} className={styles.originDot} />
            <text x={originX + 14} y={originY + 22} className={styles.originName}>
              {origin.name}
            </text>
          </g>
        </svg>
        <p className={styles.footnote}>
          {t("footnote")}
          {available.some((m) => m.id === "l6-bev") && <> {t("footnoteBev")}</>}
        </p>
      </div>
    </section>
  );
}

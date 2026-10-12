/**
 * "PHEV or BEV?" advisor: running-cost calculator + recommendation for the two LEPAS L6 versions.
 * Texts are in `messages/<locale>/advisor.json`.
 */

/** Slider limits and starting values. Prices are in lei and can be changed by the visitor. */
export const advisorInputs = {
  dailyKm: { min: 10, max: 250, step: 5, initial: 40 },
  /** Trips longer than ~300 km, per month. */
  longTrips: { min: 0, max: 8, step: 1, initial: 1 },
  /** lei / kWh at home. */
  homeElectricity: { min: 0.6, max: 2.5, step: 0.05, initial: 1.3 },
  /** lei / kWh at public chargers — used when there is no charging at home. */
  publicElectricity: { min: 1.2, max: 4, step: 0.05, initial: 2.4 },
  /** lei / litre of petrol. */
  fuel: { min: 6, max: 11, step: 0.1, initial: 7.8 },
} as const;

export const daysPerMonth = 30;

export const consumption = {
  /** Official WLTP figures, EU type approval (L6 PHEV Essence / Elegance). */
  phev: { electricKwhPer100: 14.8, depletedLitresPer100: 5.9, electricRangeKm: 92, totalRangeKm: 1058 },
  /**
   * The BEV's consumption is not yet published for Romania.
   * Estimate: 65 kWh battery ÷ 449 km WLTP range. Replace with the homologated value when available.
   */
  bev: { kwhPer100: 14.5, rangeKm: 449 },
  /** Reference for the comparison: a typical petrol SUV of the same size (assumption, not a LEPAS figure). */
  petrolSuv: { litresPer100: 7.5 },
};

/** From this many long trips a month, the PHEV's 1,058 km range wins over planning charging stops. */
export const frequentLongTrips = 3;

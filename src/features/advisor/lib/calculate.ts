import { consumption, daysPerMonth, frequentLongTrips } from "../config";

export type AdvisorInput = {
  dailyKm: number;
  longTrips: number;
  homeCharging: boolean;
  /** lei / kWh — home tariff, or public charging when there is no charging at home. */
  electricityPrice: number;
  /** lei / litre */
  fuelPrice: number;
};

export type Variant = "phev" | "bev";
export type Reason = "noHomeCharging" | "longTrips" | "dailyBeyondRange" | "allElectric";

export type AdvisorResult = {
  /** lei / month for everyday driving. */
  monthly: { phev: number; bev: number; petrol: number };
  /** Share of everyday km the PHEV drives on electricity (0–1). */
  phevElectricShare: number;
  recommended: Variant;
  reason: Reason;
};

export function calculate(input: AdvisorInput): AdvisorResult {
  const { phev, bev, petrolSuv } = consumption;
  const { dailyKm, electricityPrice, fuelPrice } = input;

  // Without a socket at home, the PHEV is assumed to run as a self-charging hybrid.
  const electricKm = input.homeCharging ? Math.min(dailyKm, phev.electricRangeKm) : 0;
  const phevDaily =
    (electricKm * phev.electricKwhPer100 * electricityPrice +
      (dailyKm - electricKm) * phev.depletedLitresPer100 * fuelPrice) /
    100;
  const bevDaily = (dailyKm * bev.kwhPer100 * electricityPrice) / 100;
  const petrolDaily = (dailyKm * petrolSuv.litresPer100 * fuelPrice) / 100;

  let recommended: Variant = "bev";
  let reason: Reason = "allElectric";
  if (!input.homeCharging) {
    recommended = "phev";
    reason = "noHomeCharging";
  } else if (input.longTrips >= frequentLongTrips) {
    recommended = "phev";
    reason = "longTrips";
  } else if (dailyKm > bev.rangeKm * 0.5) {
    recommended = "phev";
    reason = "dailyBeyondRange";
  }

  return {
    monthly: {
      phev: phevDaily * daysPerMonth,
      bev: bevDaily * daysPerMonth,
      petrol: petrolDaily * daysPerMonth,
    },
    phevElectricShare: dailyKm > 0 ? electricKm / dailyKm : 0,
    recommended,
    reason,
  };
}

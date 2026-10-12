"use client";

import { RangeMap } from "@/features/range-map";
import type { RangeMapSection } from "../../types";

export function RangeMapBlock({ section }: { section: RangeMapSection }) {
  return <RangeMap modes={section.modes} />;
}

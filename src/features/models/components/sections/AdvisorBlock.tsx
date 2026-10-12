"use client";

import { Advisor } from "@/features/advisor";
import { useModel } from "../../lib/model-context";
import type { AdvisorSection } from "../../types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- sections share one signature
export function AdvisorBlock(_props: { section: AdvisorSection }) {
  const { variant } = useModel();
  return <Advisor current={variant} />;
}

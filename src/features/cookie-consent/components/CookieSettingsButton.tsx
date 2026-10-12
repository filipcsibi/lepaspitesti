"use client";

import { TraseuButton } from "@/shared/ui/traseu";
import { OPEN_SETTINGS_EVENT } from "../lib/consent";

/** Re-opens the cookie preference centre (e.g. from the Cookies Policy page). */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <TraseuButton tint="#111" onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}>
      {label}
    </TraseuButton>
  );
}

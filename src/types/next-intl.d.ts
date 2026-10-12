import type { routing } from "@/i18n/routing";
import type messages from "../../messages/ro";

// Romanian is the source of truth: keys missing in English are type errors.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

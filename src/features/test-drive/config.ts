/**
 * Test-drive landing pages (the destination for ads).
 * Text is in `messages/<locale>/testDrive.json`; prices, figures and media are here.
 */
import type { LeadModelSlug } from "@/features/leads";

const l8 = (file: string) => `/media/models/l8/${file}`;
const l6 = (file: string) => `/media/models/l6/${file}`;

export type TestDriveModelSlug = LeadModelSlug;

export type TestDriveLanding = {
  slug: TestDriveModelSlug;
  /** Namespace in `testDrive.models` — all the page's texts, figures and FAQ live there. */
  messagesKey: "lepasL8" | "lepasL6";
  name: string;
  /** Full model page to link to ("see all details"), when one exists. */
  modelPageSlug?: string;
  hero: { src: string; mobileSrc: string };
  /** Where the car sits in the desktop hero photo (CSS `object-position`), so the form doesn't cover it. */
  heroFocus?: string;
  /** Prices in EUR incl. VAT. Set `launch` to null when the offer ends — only the list price is shown then. */
  price: { list: number; launch: number | null; currency: "EUR" };
  /** One photo per reason, in the order of `reasons` in the messages. Leave empty for text-only cards. */
  reasonImages: string[];
  gallery: string[];
};

export const testDriveLandings: TestDriveLanding[] = [
  {
    slug: "lepas-l8",
    messagesKey: "lepasL8",
    name: "LEPAS L8",
    modelPageSlug: "lepas-l8",
    hero: { src: l8("1764062236211696.jpg"), mobileSrc: l8("1764062245625429.jpg") },
    // Official Romanian launch (Oct 2026): list 45,500 €, launch offer 42,500 €.
    price: { list: 45500, launch: 42500, currency: "EUR" },
    reasonImages: [l8("1764068719079884.jpg"), l8("1764065821004875.jpg"), l8("power.jpg"), l8("1764068360345216.jpg")],
    gallery: [
      l8("1764068759724511.jpg"),
      l8("1764068773164286.jpg"),
      l8("1764068784917412.jpg"),
      l8("1764068669314939.jpg"),
      l8("1764068684827364.jpg"),
    ],
  },
  {
    // Pre-order page: the L6 can be ordered at the launch price but is not yet available to drive.
    slug: "lepas-l6-phev",
    messagesKey: "lepasL6",
    name: "LEPAS L6 PHEV",
    modelPageSlug: "lepas-l6-phev",
    hero: { src: l6("banner.webp"), mobileSrc: l6("banner_mb.webp") },
    heroFocus: "20% 60%",
    // Official Romanian pre-order offer (6 Oct – 30 Nov 2026): list 39,990 €, launch 35,990 € (Elegance).
    price: { list: 39990, launch: 35990, currency: "EUR" },
    reasonImages: [],
    gallery: [
      l6("gallery/exterior-1.webp"),
      l6("gallery/exterior-3.webp"),
      l6("interior/dashboard.webp"),
      l6("gallery/exterior-8.webp"),
    ],
  },
];

/** The landing shown at `/test-drive` (no model in the URL). */
export const defaultLanding = testDriveLandings[0];

export function getLanding(slug: string) {
  return testDriveLandings.find((l) => l.slug === slug);
}

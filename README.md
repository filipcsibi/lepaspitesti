# lepaspitesti.ro

Official LEPAS website for Pitești — rebuilt from the LEPAS International source (jQuery + GSAP + SSI) in
**Next.js 16 + TypeScript**, with **Romanian as the main language** and English at `/en`.

What sets it apart:

- **Range map** — "Cât de departe ajungi din Pitești?": an interactive map of Romania showing how far each
  LEPAS L6 version gets from Pitești without stopping (`src/features/range-map`).
- **PHEV or BEV advisor** — a short calculator that recommends a version and shows the monthly energy cost
  (`src/features/advisor`).
- **LEPAS L6 PHEV and LEPAS L6 BEV are separate pages**, each with its own colour, figures and call-to-action, linked
  by a PHEV | BEV switch.
- **Traseu** — the UI material: flat graphite plates with two cut corners, marked like waypoints, whose edge is
  traced by a route line on hover and focus (`src/shared/ui/traseu`). The showroom's motorway exit, "A1 · km 107",
  signs the home page.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (all pages are pre-rendered)
npm run lint
```

## Editing content (no code needed)

| What                                                 | Where                                                                             |
| ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| Any visible text (buttons, menus, …)                 | `messages/ro/*.json` and `messages/en/*.json` (one file per page/area)            |
| Legal pages                                          | `content/legal/<legal\|privacy\|cookies>/<locale>.md`                             |
| Images                                               | `public/media/<feature>/…`                                                        |
| Videos                                               | Vercel Blob — see "Videos" below                                                  |
| Which images/videos a page uses                      | `src/features/<feature>/content.ts` (or `data/` for models)                       |
| Menu & footer links                                  | `src/config/navigation.ts`                                                        |
| Showroom address, phone, e-mail, hours, social links | `src/config/site.ts` (shown on `/contact`, in the footer and on test-drive pages) |

- **Romanian is the source of truth.** If a key exists in `ro` but not in `en`, TypeScript reports it (`npx tsc --noEmit`).
- **Links to site pages inside Markdown:** write `[text](page:/cookies)` — it resolves to the right URL per language.
- **Adding a car model:** copy `src/features/models/data/lepas-l4.ts`, list it in `data/index.ts`, add its texts under
  `models.<key>` in `messages/*/models.json` and a menu entry in `src/config/navigation.ts`. A model page is just a list
  of sections (`hero`, `videoIntro`, `exterior`, `fullscreenSlider`, `colorShowcase`, `cardCarousel`, `power`, `film`,
  `gallery`, `interiorImage`) — reorder or remove them freely.

## Deploy

The repository is connected to the Vercel project `lepaspitesti`; every page is pre-rendered. Set the environment
variables listed under "Where leads go" before sending traffic to the test-drive pages.

## Videos

Videos are served from `public/media/…`, next to the images, and are committed to the repository.

To add or replace a video, put the file in `public/media/<feature>/…` and reference that path
(`/media/home/intro.mp4`) in the content file.

**Encoding.** Every video was re-encoded from its original master with H.264 (`-crf 20 -preset slow`,
`-movflags +faststart`, no audio track on muted background clips), and kept only when smaller than the master —
masters that were already tightly encoded are used untouched. Keep new videos under 100 MB (GitHub's file limit).

**Optional: Vercel Blob.** `mediaUrl()` in `src/shared/lib/media.ts` swaps a path for a Blob URL when it is listed in
`src/config/media-manifest.json` (empty by default). To host videos on Blob instead, put them in `media-source/media/…`
(git-ignored), run `node --env-file=.env.local scripts/upload-videos.mjs` and commit the manifest. Mind the Blob data
transfer included in the Vercel plan (10 GB a month on Hobby, against 100 GB for files in `public/`).

## LEPAS L6: two pages

| Page          | URL                     | Data                                        | Texts (`messages/*/models.json`) |
| ------------- | ----------------------- | ------------------------------------------- | -------------------------------- |
| LEPAS L6 PHEV | `/modele/lepas-l6-phev` | `src/features/models/data/lepas-l6-phev.ts` | `lepasL6Phev`                    |
| LEPAS L6 BEV  | `/modele/lepas-l6-bev`  | `src/features/models/data/lepas-l6-bev.ts`  | `lepasL6Bev`                     |

Photos, colours and the interior sections shared by both are in `data/lepas-l6-shared.ts`.

**The BEV figures are provisional.** The importer has not published the Romanian homologation data or the price yet;
the page shows the figures announced for European markets and says so in its footnote. When the local specification
arrives, update the numbers in `lepas-l6-bev.ts`, `src/features/range-map/config.ts` (range) and
`src/features/advisor/config.ts` (consumption), then the footnotes in the messages.

**Range map** — versions, ranges, the list of cities and their road distances are in
`src/features/range-map/config.ts`; texts in `messages/*/rangeMap.json`. Use `<RangeMap modes={[…]} />` anywhere.

**Advisor** — consumption figures, default prices (lei) and slider limits are in `src/features/advisor/config.ts`;
texts in `messages/*/advisor.json`. The default energy and fuel prices are indicative: check them before launch.

## Test-drive landing pages (ad funnel)

Ads point to one page per model: `/test-drive/lepas-l8` (test drive) and `/test-drive/lepas-l6-phev` (pre-order
offer — the L6 is not yet available to drive). `/test-drive` is the general version (the L8 page, with a model picker
in the form); `/test-drive?model=lepas-l6-bev` opens it with that model already chosen. After a successful request the visitor lands on `/test-drive/multumim`, which is where the
"Lead" conversion is counted. These pages have no site menu on purpose — the only thing to do is fill in the form.

| What                                             | Where                                                                                     |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Texts, figures, FAQ, form labels, steps          | `messages/<locale>/testDrive.json`                                                        |
| Price, launch offer, photos                      | `src/features/test-drive/config.ts`                                                       |
| Showroom address, phone, opening hours, map link | `src/config/site.ts` → `showroom` (empty = not shown)                                     |
| Form fields & validation                         | `src/features/test-drive/components/LeadForm.tsx`, `src/features/leads/lib/validation.ts` |

When the launch offer ends, set `price.launch` to `null` in `config.ts` — the page then shows only the list price.

**Where leads go** — set in Vercel → Settings → Environment Variables. At least one channel is required in
production; without one the form shows an error instead of silently losing the lead.

| Variable                | Purpose                                                                          |
| ----------------------- | -------------------------------------------------------------------------------- |
| `CRM_WEBHOOK_URL_LEPAS` | SalesPartner lead endpoint (lepas-ims) — the lead is created directly in the CRM |
| `CRM_API_KEY_LEPAS`     | SalesPartner API key (sent as `X-API-Key`)                                       |
| `CRM_API_SECRET_LEPAS`  | SalesPartner API secret (sent as `X-API-Secret`)                                 |
| `RESEND_API_KEY`        | E-mail delivery (added by the Resend integration from the Vercel Marketplace)    |
| `LEAD_EMAIL_TO`         | Who receives the leads (comma-separated for several addresses)                   |
| `LEAD_EMAIL_FROM`       | Verified sender, e.g. `LEPAS Pitești <leads@lepaspitesti.ro>`                    |
| `LEAD_WEBHOOK_URL`      | Optional: also POST every lead as JSON to Google Sheets / Zapier / Make          |

These are read only on the server (none starts with `NEXT_PUBLIC_`), so they never reach the browser.

Both forms — test drive / offer and the contact form on `/contact` — go through `src/features/leads`. The fixed
values sent to SalesPartner (channel, site, dealer code, vehicle status and the "intention to buy" mapped from
"When would you like to come?") are in `src/features/leads/crm.ts`. Keeping the e-mail channel next to the CRM is
recommended: if the CRM is down or rejects a lead, the lead still arrives.

**Spam protection:** a hidden honeypot field, a minimum fill time, at most 5 requests per address in 10 minutes and
no second delivery for the same phone number within 10 minutes. For a real attack, add a rate-limit rule for the form
pages in the Vercel Firewall.

Each lead carries the model, when they want to come, trade-in interest, the page it came from and the ad parameters
(`utm_*`, `fbclid`, `gclid`, `ttclid`).

**Ad tracking** — loaded only when the ID is set and the visitor accepted the matching cookie category:
`NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL`.

## URLs

| Page                      | Romanian (default)                                           | English                                                    |
| ------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| Home                      | `/`                                                          | `/en`                                                      |
| Model                     | `/modele/lepas-l8`                                           | `/en/models/lepas-l8`                                      |
| Brand introduction        | `/despre/introducere`                                        | `/en/about/introduction`                                   |
| Brand values              | `/despre/valorile-brandului`                                 | `/en/about/brand-values`                                   |
| Legal / privacy / cookies | `/termeni-legali`, `/confidentialitate`, `/politica-cookies` | `/en/legal`, `/en/privacy-statement`, `/en/cookies-policy` |

Localized paths are configured in `src/i18n/routing.ts` (next-intl).

## Architecture

```
src/
  app/[locale]/…          thin route files (metadata + render a feature)
  features/               one folder per business feature
    header/ footer/ cookie-consent/ analytics/
    home/ models/ about/ contact/ legal/ not-found/ test-drive/ leads/
    range-map/ advisor/
      components/         UI for that feature (CSS Modules next to each component)
      content.ts | data/  media & configuration for the feature
      lib/                feature logic (e.g. lead delivery)
      index.ts            public API — import features only through this
  shared/
    ui/traseu/            Traseu surface, TraseuButton, TraseuIconButton, TraseuTabs
    ui/media/             ResponsiveImage (art-directed next/image), ResponsiveVideo
    ui/motion/            PinOnScroll (GSAP ScrollTrigger), Reveal (plain wrapper: text is not animated in)
    ui/slider-dots/ ui/markdown/ ui/scroll-to-top/
    lib/                  gsap setup, SEO helpers, Markdown/image helpers
    providers/            Lenis smooth scroll (synced with ScrollTrigger)
    styles/globals.css    brand tokens (colours from the 2025 brand guide), rem scale, reset
  config/                 site + navigation config
  i18n/                   next-intl routing / request / navigation
messages/<locale>/        translations (JSON)
content/                  Markdown content (legal pages)
public/media/             images & videos, grouped per feature
```

**Sizing:** as on the original site, `1rem` = 100px on a 1920px-wide screen (and on a 750px mobile design), so values
can be copied straight from the design files (48px → `0.48rem`).

**Traseu:** `traseu.surface` (from `@/shared/ui/traseu`) gives any element the site's material — a flat graphite
plate with the top-right and bottom-left corners cut and marked in the route colour; on `traseu.interactive` elements
the route line is traced around the whole edge on hover and keyboard focus (pure CSS, same on touch screens). Tune per
element with `--traseu-accent`, `--traseu-tint`, `--traseu-base`, `--traseu-blur` and `--traseu-cut` (`--traseu-cut-tr`
/ `--traseu-cut-bl` for one corner, `0px` = square). Filled buttons outside a surface use `clip-path: var(--cut-sm)`.
The site accent is `--color-accent` (Freedom Blue) in `globals.css`; model pages set their own (`accent` in the model's
data file): orange for PHEV, green for BEV.

**Before going live:** add the dealer's social
accounts and opening hours in `src/config/site.ts`, and confirm the road distances in `src/features/range-map/config.ts`.

**Stack:** Next.js 16 (App Router, Turbopack), React 19, next-intl 4, GSAP 3 + ScrollTrigger, Lenis, Swiper 14,
CSS Modules, Source Sans 3 (the Latin companion of the brand font Source Han Sans, with Romanian diacritics).

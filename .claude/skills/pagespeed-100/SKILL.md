---
name: pagespeed-100
description: Keep the site at 100/100/100/100 in PageSpeed Insights (mobile and desktop). Use when a score drops, when checking a page before shipping, when a PageSpeed/Lighthouse report shows NO_LCP or a metric in orange, or when adding a hero, an image, a font or a script that could cost the perfect score.
metadata:
  author: diputnam
  version: "1.0"
---

Goal: every page of https://diputnam-ten.vercel.app/ (and diputnam.com once DNS is live) scores 100 in Performance, Accessibility, Best Practices and SEO on PageSpeed Insights, mobile and desktop. Reached on Sep 18 2026; this skill records how it was reached and how not to lose it.

## 1. Measure the right thing

- **PageSpeed Insights in the browser is the judge** (https://pagespeed.web.dev/, Mobile tab). The anonymous PSI API burns its daily quota in a few calls — do not rely on it; ask the user to run PSI and read the screenshot.
- Local approximation, from the repo root:
  ```
  node .claude/skills/pagespeed-100/scripts/lighthouse.mjs https://diputnam-ten.vercel.app/ 3 mobile
  ```
  Same Lighthouse and throttling (Moto G Power, slow 4G RTT 150 ms / 1.6 Mbps, CPU ×4, Lantern simulation) as PSI. Always run 3×: this headless setup is bimodal — about half the runs report an *observed* FCP/LCP of ~1.45 s with `render ≈ 1100 ms` in the breakdown (score 98–99, SI 2.7 s) while the others give ~0.45 s (score 100), and a Playwright load with the same throttling is always ~0.6 s. That pattern is the local environment, not the site: judge by the best run and by the LCP breakdown, and let PSI settle it.
- Measure the **deployed** URL. The local `dist/` is usually built with `SANITY_LOCAL_DATASET` (image URLs 404) and never uses the `/cdn/images` proxy (`VERCEL` unset), so its numbers are meaningless for Performance. `dist/` is fine for Accessibility/SEO checks (`npm run test:seo`, `npm run test:mobile`).
- Interior pages and `/en/` count too; when in doubt run the script on `/eredita/`, `/eredita/<slug>/`, `/putnam/`, `/unete/`, `/contacto/`, `/noticias/`.

## 2. What the score is made of

Performance (weights): LCP 25 %, TBT 30 %, CLS 25 %, FCP 10 %, Speed Index 10 %. On this site TBT (~0–100 ms), CLS (0) and SI are safe; **LCP is the only metric that has ever cost points**. For 100 the simulated mobile LCP must stay ≈ 1.4 s (score ≥ 0.98 at ≤ 1.8 s; 0.94 at 2.2 s → 98–99).

Simulated LCP ≈ TTFB (~0.25 s) + time until the LCP resource request starts + its download + **element render delay**. Read the breakdown printed by the script and attack the biggest part.

## 3. Chrome rules that bit us (do not rediscover them)

1. **An `<img>` that covers the whole viewport is not an LCP candidate** — Chrome treats it as background. 1 px less (and no `scale()` that re-covers) makes it count. Verified with a synthetic test: 100 % → no entry, 90 % → entry.
2. **Text is recorded at its first paint only, with the rect visible at that moment.** Title lines that first paint inside a `clip-path`/`mask`/`overflow` mask, translated out of view, get an empty rect and never count, even after the mask opens. `opacity: 0` is the exception: Chrome re-records when opacity becomes > 0.
3. **Lantern ignores `<link rel="preconnect">`**: every extra origin on the critical path is charged DNS + TCP + TLS (~0.3–0.45 s simulated). Anything the LCP depends on must be same-origin.
4. **A rule that waits for JavaScript delays the LCP to "script + fonts ready"** — the LCP element must qualify from the first paint with the initial CSS.
5. **`NO_LCP` = there is no candidate at all** (the score cannot be computed and TBT errors too). Diagnose with:
   ```
   node .claude/skills/pagespeed-100/scripts/lcp-candidates.mjs https://diputnam-ten.vercel.app/ [".css{to test}"]
   ```
   It lists every candidate Chrome accepted (mobile and desktop); the optional CSS is injected before first paint so a fix can be tested against the live site without deploying.

## 4. Invariants in this repo — keep them when editing nearby code

| Where | What | Why |
|---|---|---|
| `src/styles/global.css`, mobile block (`@media (max-width: 767px)`) | `.panel-media { height: calc(100% - 1px); transform: none; }` — **outside** `.is-slider` | Home hero image is the mobile LCP (rules 1 and 4). The 1 px shows the stage's `#0d1116` under the dark shade: invisible. |
| `vercel.json` `rewrites` + `src/lib/images.ts` `viaProxy()` | CMS images served as `/cdn/images/*` when `process.env.VERCEL === '1'`; `ogUrl()` stays absolute | Rule 3. The proxy negotiates AVIF/WebP (`Vary: Accept`) and keeps Sanity's one-year cache. Bots need absolute `og:image`. |
| `src/components/SiteHead.astro` | `preconnect` to `cdn.sanity.io` only when not proxied; `preload` of DM Sans; `theme-color` light + dark | Unused preconnect is flagged; the font preload keeps FCP text from waiting. |
| `src/views/home.astro` | First scene `loading="eager" fetchpriority="high"`, second `eager`, rest `lazy`; `sizes="100vw"` | LCP image discoverable in HTML at High priority; the others do not compete. |
| `astro.config.mjs` | `build.inlineStylesheets: 'always'` | No render-blocking CSS request. |
| `src/styles/global.css` `@font-face` | `font-display: swap`, latin subset, `unicode-range` | Text paints immediately; no invisible-text period. |
| Motion scripts (`motion.ts`, `mobile-motion.ts`, `header-scroll.ts`) | No per-frame JS on mobile; `npm run test:perf` budget | TBT ≈ 0. `header-scroll.ts` already carries a scroll listener that `test:perf` flags on interior pages — a known, accepted exception; do not add more. |
| Arrows (`src/components/Arrow.astro`) | Inline SVG, never `→`/`↗` characters | Not a score item, but iOS drew them as emoji. |
| Contrast and names | Text on photos/greens ≥ 4.5:1; brand link `aria-label` equals its visible text; every `<img>` has `alt` (empty for decorative); one `h1` per page | Accessibility 100 (`npm run test:mobile` and `test:seo` cover most of it). |
| `tests/seo-audit.mjs` (runs on `postbuild`) | Titles, descriptions, canonical, hreflang, Open Graph, JSON-LD, robots, sitemap, llms.txt, immutable `/_astro/*` cache | SEO 100 and Best Practices 100. |

## 5. Checklist before shipping a change that touches a hero, image, font, script or layout

1. Build and run `npm run test:mobile && npm run test:perf && npm run test:seo` (perf: only the pre-existing `header-scroll` scroll-listener failures are acceptable).
2. Deploy (push to `main`), wait for Vercel, then `scripts/lighthouse.mjs <url> 3 mobile` on every page touched. Expect ≥ 99 in each run and LCP ≤ 1.5 s in the best run.
3. If a page is new or a hero changed: `scripts/lcp-candidates.mjs <url>` — the LCP must be the hero image or a hero title, not the header logo (`STRONG "Putnam"`, 2.5 k px²) and never `NONE`.
4. Ask the user to run PSI mobile + desktop on the touched pages and confirm 100s.

## 6. When a score drops — triage order

- **NO_LCP / LCP > 1.8 s on mobile** → `lcp-candidates.mjs`. No candidate: check rules 1–2 (full-viewport image? masked title?). Candidate but late: read the breakdown — `load delay` ⇒ image not in HTML / lazy / cross-origin (rule 3); `load duration` ⇒ too many bytes (target ≤ 30 KB for the mobile hero, `q` 70–75, AVIF via `auto=format`); `render delay` ⇒ something (JS, fonts, a class added by script) gates the element (rule 4).
- **FCP > 1.2 s** → render-blocking request (external CSS/script in `<head>`), font without `swap`, or TTFB (Vercel edge should be ~70 ms; a cold Sanity fetch is not on the critical path because the site is static).
- **TBT > 150 ms** → new JS on the main thread at load: move it after `load`, defer, or drop the library (no motion libraries on mobile; Lenis/GSAP are desktop-only and lazy).
- **CLS > 0** → an image without `width`/`height`, a font swap without matching metrics, or content injected above the fold.
- **Accessibility < 100** → run PSI's list: usually contrast, a missing `alt`, a link without text, or a `<summary>`/button without an accessible name.
- **Best Practices < 100** → console errors (check with Playwright `page.on('console')`), a third-party iframe not deferred (`MapEmbed` loads Google Maps only near the viewport — keep it that way), missing `Cache-Control`.
- **SEO < 100** → `npm run test:seo` should already fail; fix what it names.

Record any new rule or exception you discover here, in §3 or §4, so the next agent does not spend the afternoon rediscovering it.

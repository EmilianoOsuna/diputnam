# Mobile 60fps validation notes

## Matrix

Routes: `/`, `/eredita/`, `/putnam/`.

Target viewports: 320×800 (low-end profile), 390×844 (mid-range profile), and 768×1024 (desktop/tablet comparison), with normal and `prefers-reduced-motion: reduce` runs. Repeat normal runs with CPU throttling enabled in DevTools.

## Static validation

- `npm run build`: passed; all three routes generated.
- Scroll-driven Lenis updates are coalesced to one `requestAnimationFrame` callback before `ScrollTrigger.update()`.
- The home scroll cue is coalesced to one visual update per frame.
- `will-change: transform` is scoped to motion-ready horizontal tracks and CTA marks.
- Home scene geometry now uses a cached viewport height and Lenis scene/cue work is coalesced into one visual rAF.
- The existing mobile fallbacks remain active below their breakpoints, and page styles retain `overflow-x: clip` where applicable.
- Putnam now prioritizes the hero image, contains its paint area, uses Lenis' native RAF instead of a duplicate GSAP ticker RAF, and refreshes ScrollTrigger only after hero image load or a viewport resize.
- `tests/putnam-performance.mjs` records animation frames, dropped-frame intervals, long tasks, hero visibility, and horizontal overflow during a mobile Putnam refresh/scroll run.
- The second Putnam pass removes Lenis, GSAP, and ScrollTrigger execution from viewports up to 767 px and from reduced-motion sessions. Those libraries are dynamically imported only on desktop, so mobile does not download or parse their 136 KB of generated JavaScript chunks.
- Mobile process state uses `IntersectionObserver`; rail progress uses one passive scroll listener coalesced through `requestAnimationFrame` with geometry cached until resize.
- The hero requests a responsive 640/960/1280 px source; process images are responsive, lazy-loaded, asynchronously decoded, and low priority.
- Full-frame image filters and transforms are removed on mobile, below-the-fold sections use `content-visibility: auto`, and rail progress now animates with compositor-friendly `scaleX` instead of width.

## Blocked measurements

`npm run test:sweep` and `node tests/putnam-performance.mjs` could not launch because the Playwright Chromium executable is not installed in the environment. FPS/frame pacing, long tasks, layout, paint area, layer memory, and visual scroll alignment therefore still require a browser-enabled run.

`npm test` is not configured in `package.json`; the configured `npm run test:sweep` command is the available functional browser check.

The system gesture-bar indicator (“café”) is outside the site and excluded from scope.

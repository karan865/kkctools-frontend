# 05 — Deployment, Launch & Maintenance Guide

## 1. Honest Expectation & Reality
Technical SEO, fast pages, useful tools, and good content give the site a fair chance. Nobody can guarantee rankings. Rankings depend on content quality, competition, backlinks, and time.

---

## 2. Deployment Setup

The site is a **pure static export** (`next.config.ts`: `output: 'export'`, `trailingSlash: true`). `npm run build` writes everything to `out/`. No server runtime is needed.

### Cloudflare (current target, 2026-11-14)
Served as **Workers Static Assets** from `out/`, configured in `wrangler.jsonc`:
- `assets.directory: "./out"`
- `html_handling: "auto-trailing-slash"`
- `not_found_handling: "404-page"` (serves `out/404.html`)
- Security and cache headers come from `public/_headers` (copied into `out/`).

Dashboard → Workers & Pages → `kkctools-frontend` → Settings → Build:
- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`

Do **not** use OpenNext / `@opennextjs/cloudflare`. It needs `output: 'standalone'`, which breaks the static-export rule and is not an allowed dependency. The first Cloudflare deploy failed for exactly this reason (`.next/standalone/.next/server/pages-manifest.json` not found); having `wrangler.jsonc` in the repo stops Cloudflare's auto-setup from adding OpenNext again.

Local check before pushing: `npm run build && npx wrangler deploy --dry-run` (verified 2026-11-14: 522 files read from `out/`).

### Netlify (previous host)
`netlify.toml`: build `npm run build`, publish `out`, HUD disabled. Keep until the domain is moved to Cloudflare, then remove the Netlify site and `netlify.toml`. `TODO(owner)`: confirm the cut-over date.

### Environment variables
- `NEXT_PUBLIC_SITE_URL`: production domain (`https://www.kkctools.com`).
- `NEXT_PUBLIC_ADS_ENABLED`: `false` until AdSense approval.

---

## 3. Post-Launch Steps

1. Point the domain DNS at Cloudflare and attach the custom domain to the Worker.
2. Verify the domain in Google Search Console and Bing Webmaster Tools.
3. Submit `https://www.kkctools.com/sitemap.xml`.
4. Request indexing for Home, `/tools/`, and the main tool pages.
5. Run PageSpeed Insights on live URLs; save results in `docs/evidence/`.
6. Confirm the `_headers` (CSP, HSTS) are served by Cloudflare on the live site. *(Checked 2026-11-15: CSP, HSTS and the other headers are served.)*
6a. **Turn off Cloudflare Web Analytics** (`TODO(owner)`): Dashboard → Workers & Pages → `kkctools-frontend` → Metrics / Settings → Web Analytics → disable (also check the zone under Analytics & Logs → Web Analytics). Cloudflare injects `static.cloudflareinsights.com/beacon.min.js` into every page; our CSP blocks it, which shows a console error (Lighthouse "Best Practices"), and it would break the "no third-party scripts until Phase 7" rule. An external AdSense-readiness scanner mistook this beacon for Google Analytics.
6b. Redeploy after every merge. On 2026-11-15 the live site was still an older build (home page said "Search 24 tools"; the newest 5 tools, Disclaimer and Site Map were missing).
7. After indexing and steady traffic, apply to Google AdSense; then set up a certified CMP for EEA/UK and add `ads.txt`.
   - Cookie banner: not needed today, because the site sets no cookies and loads no third-party scripts (theme choice is `localStorage` only). When ads are switched on, use Google's own certified consent message (AdSense → Privacy & messaging), not a custom banner.
   - Before applying: Disclaimer (`/disclaimer/`), HTML site map (`/site-map/`), Privacy, Terms, About and Contact pages are all live in the build and linked from the footer.

# 05 — Deployment, Launch & Maintenance Guide

## 1. Honest Expectation & Reality
Technical SEO, fast pages, useful tools, and good content give the site a fair chance. Nobody can guarantee rankings. Rankings depend on content quality, competition, backlinks, and time. The main keyword has KD 10 with 7 dedicated tool pages ranking, so our tool must be genuinely cleaner, faster, and more practical.

---

## 2. Deployment Setup

### Netlify Deployment
1. Connect GitHub repository to Netlify.
2. Build Settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
   - **Node.js version:** Set to `.nvmrc` (`22` or `20.9+`)
3. Environment variables:
   - `NEXT_PUBLIC_SITE_URL`: Set to production custom apex domain (e.g. `https://yourdomain.com`).
   - `NEXT_PUBLIC_ADS_ENABLED`: `false` (until approved).

---

## 3. Post-Launch Steps

1. Verify domain property in Google Search Console.
2. Submit `https://yourdomain.com/sitemap.xml`.
3. Request indexing for Home, main tool, and active genre pages.
4. Run PageSpeed Insights on live URLs and save results in `docs/evidence/`.
5. After organic indexing and steady traffic (few weeks), submit site to Google AdSense.
6. Post-AdSense approval: configure certified CMP for EEA/UK and place `ads.txt`.


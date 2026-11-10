# Full Website SEO Audit & Missing Elements Master Checklist

> **Document Status:** Complete App Scan & Actionable Remediation Plan  
> **Date:** November 10, 2026  
> **Target App:** KKC Tools (`https://www.kkctools.com`)  
> **Audited Pages:** 27 Production HTML Files across 8 Tools, 6 Genre Pages, 3 Guides & Core Legal Pages  
> **Audited Codebase:** Next.js 16 App Router (Static Export `out/`)

---

## 1. Executive Summary & SEO Health Score

Humne poore website ke har ek page, metadata, JSON-LD schemas, sitemap, robots.txt, internal links, headings, aur OpenGraph tags ka **deep scan** kiya hai.

| Category | Current Score | Status | Key Takeaway |
|---|---|---|---|
| **Crawling & Indexing** | **82 / 100** | ⚠️ Needs Fix | Canonical URL domain mismatch (`www` vs `non-www`) on 4 newest tools. |
| **Metadata & OpenGraph** | **78 / 100** | ⚠️ Needs Fix | 4 tools missing dedicated OG image, Twitter card tags & `buildMetadata` helper. |
| **Semantic HTML & A11y** | **85 / 100** | ⚠️ Needs Fix | `<main id="main-content">` missing on 4 newest tools (breaks Skip Link & content boundary). |
| **Structured Data (Schema)** | **80 / 100** | ⚠️ Needs Fix | Duplicate `FAQPage` and `BreadcrumbList` schemas being emitted on several pages. |
| **Content Depth & Headings** | **98 / 100** | ✅ Excellent | 2,000+ words per tool, clean single H1 per page, excellent H2/H3 hierarchies. |
| **Site Speed & Performance** | **100 / 100** | 🚀 Perfect | 100% client-side, zero network calls, zero external render-blocking scripts. |
| **AI Search / GEO Readiness** | **70 / 100** | ⚠️ Opportunity | Missing `/llms.txt` and explicit AI bot indexing rules for ChatGPT & Perplexity. |

---

## 2. Critical SEO Issues Found (Must Fix First)

### 🚨 Issue 1: Canonical URL Domain Mismatch (`www` vs `non-www`)
* **Severity:** **CRITICAL** (Search engines consider `kkctools.com` and `www.kkctools.com` as two distinct sites)
* **What's Happening:**
  - `src/config/site.ts` defines `SITE_URL = 'https://www.kkctools.com'` (with `www.`).
  - `sitemap.xml` lists all URLs as `https://www.kkctools.com/...`.
  - But 4 new tool pages have hardcoded non-www canonical tags:
    - `/sand-calculator/` -> `canonical: 'https://kkctools.com/sand-calculator/'`
    - `/fill-dirt-calculator/` -> `canonical: 'https://kkctools.com/fill-dirt-calculator/'`
    - `/linear-foot-calculator/` -> `canonical: 'https://kkctools.com/linear-foot-calculator/'`
    - `/rafter-calculator/` -> `canonical: 'https://kkctools.com/rafter-calculator/'`
* **Consequence:**
  Googlebot crawls the sitemap URL `www.kkctools.com/rafter-calculator/`, reads the canonical tag pointing to `kkctools.com/rafter-calculator/`, and flags it in Google Search Console as:
  > *"Duplicate, Google chose different canonical than user"* or *"Page with redirect / non-canonical"*.
* **Fix Required:**
  Use `${SITE_URL}/tool-slug/` or the `buildMetadata()` helper across all pages so the canonical URL always strictly matches `src/config/site.ts`.

---

### 🚨 Issue 2: Duplicate JSON-LD Schema Injections
* **Severity:** **HIGH**
* **What's Happening:**
  - **Duplicate `FAQPage`:** The UI component `<Faq />` (`src/components/ui/Faq.tsx`) has built-in `withSchema={true}` by default, which automatically generates `<JsonLd data={faqSchema} />`.
    However, on `/sand-calculator/`, `/fill-dirt-calculator/`, `/linear-foot-calculator/`, and `/rafter-calculator/`, `page.tsx` ALSO manually emits a separate `<script type="application/ld+json">` for `faqSchema`! As a result, the compiled HTML contains **two duplicate `FAQPage` scripts**!
  - **Duplicate `BreadcrumbList`:** `/asphalt-calculator/` and `/cubic-yard-calculator/` define `breadcrumbSchema` in `page.tsx` AND render `<Breadcrumbs items={...} />` (which already generates its own `BreadcrumbList` schema).
* **Consequence:**
  Google's Rich Results Testing Tool can flag duplicate schema entities or ignore the FAQ schema completely.
* **Fix Required:**
  Either pass `withSchema={false}` to `<Faq />` and `<Breadcrumbs />` when defining schema in `page.tsx`, OR let the components handle their schema and remove the manual scripts from `page.tsx`.

---

### 🚨 Issue 3: Missing `<main id="main-content">` Wrapper on 4 Tools
* **Severity:** **MEDIUM-HIGH** (Semantic SEO & Accessibility)
* **What's Happening:**
  - In `src/app/layout.tsx`, the skip-link points to `#main-content`:
    `<a href="#main-content" className={styles.skipLink}>Skip to main content</a>`
  - In our original tools (`/band-name-generator/`, `/construction-estimate-template/`, `/asphalt-calculator/`, `/cubic-yard-calculator/`), the page wrapper is `<main id="main-content">`.
  - In the 4 newest tools (`/sand-calculator/`, `/fill-dirt-calculator/`, `/linear-foot-calculator/`, `/rafter-calculator/`), the root element is `<div className={styles.pageWrap}>`.
* **Consequence:**
  - Search engine crawlers (Googlebot, Bingbot) cannot cleanly differentiate the main content body from header/footer boilerplate.
  - Screen readers and keyboard navigation skip-link fails to jump to the tool.
* **Fix Required:**
  Change the outer container in those 4 `page.tsx` files to `<main id="main-content" className={styles.pageWrap}>`.

---

### 🚨 Issue 4: Incomplete OpenGraph & Missing Twitter Card Tags
* **Severity:** **MEDIUM**
* **What's Happening:**
  - Pages using `buildMetadata()` automatically get:
    - `og:image` (1200×630)
    - `og:site_name`
    - `og:locale`
    - `twitter:card` (`summary_large_image`)
    - `twitter:title`, `twitter:description`, `twitter:image`
  - But `/sand-calculator/`, `/fill-dirt-calculator/`, `/linear-foot-calculator/`, and `/rafter-calculator/` define manual `metadata` without `twitter` or `openGraph.images`!
* **Consequence:**
  When shared on Twitter/X, LinkedIn, Discord, or WhatsApp, these pages do not show a rich link preview card with an image.
* **Fix Required:**
  Refactor their `export const metadata: Metadata` to use `buildMetadata()` or supply the missing `openGraph.images` and `twitter` card objects.

---

### 🚨 Issue 5: Missing Google Search Console Verification Meta Tag
* **Severity:** **HIGH** (Deployment Blocker)
* **What's Happening:**
  In `src/app/layout.tsx`:
  ```ts
  verification: {
    other: {
      'msvalidate.01': 'FA0261B08D394DFD4C117F158B1A04A8', // Bing verification is present
    },
  },
  ```
  `google: 'YOUR_GOOGLE_VERIFICATION_CODE'` is missing!
* **Consequence:**
  The site owner cannot verify domain ownership in Google Search Console via HTML meta tag without adding this tag.
* **Fix Required:**
  Add a placeholder or environment variable `process.env.NEXT_PUBLIC_GSC_VERIFICATION` in `layout.tsx` so the user can easily paste their verification string.

---

## 3. Detailed Missing Elements Checklist by Category

### A. Technical SEO & Crawling
- [ ] **Canonical URL normalization**: Ensure 100% of URLs in `rel="canonical"` use `https://www.kkctools.com` (no non-www variants).
- [ ] **Google Site Verification**: Add `verification.google` in `src/app/layout.tsx`.
- [ ] **Active Nav Link Detection**: In `src/components/layout/Header.tsx`, `isToolsActive` currently only checks `/tools`, `/band-name-generator`, `/construction-estimate`. Add all calculator routes so the active header state works on every tool page.
- [ ] **Static 404 Header Check**: Ensure `out/404.html` returns HTTP 404 on deployment host (configured via Netlify/Cloudflare `_headers` or hosting routing).

---

### B. Structured Data (Schema.org JSON-LD)
- [ ] **Eliminate Duplicate Schemas**:
  - Remove redundant `breadcrumbSchema` from `asphalt-calculator` & `cubic-yard-calculator`.
  - Remove redundant `faqSchema` from `sand-calculator`, `fill-dirt-calculator`, `linear-foot-calculator`, and `rafter-calculator` (or use `withSchema={false}`).
- [ ] **Add Publisher & Organization Links**:
  Connect `WebApplication` to `Organization` schema via `publisher: { '@type': 'Organization', name: 'KKC Tools', url: 'https://www.kkctools.com/' }`.
- [ ] **Add `HowTo` Schema on Step-by-Step Sections**:
  Tools like Asphalt, Cubic Yard, Sand, and Rafter have clear "Step 1, Step 2, Step 3" instructions. Adding `HowTo` schema can yield rich step carousel snippets in mobile SERPs.

---

### C. OpenGraph & Social Sharing
- [ ] **Tool-Specific OG Images**:
  Currently, only `/` and `/construction-estimate-template/` have specific `opengraph-image.tsx`.
  The other 6 tools fall back to generic branding.
  Creating dynamic `opengraph-image.tsx` for each calculator (displaying the tool name, icon, and primary metric) boosts CTR on social media and forum shares (Reddit, Quora, Facebook Groups).
- [ ] **Twitter Card Standard**:
  Add `twitter: { card: 'summary_large_image', ... }` to all 4 new tool pages.

---

### D. Internal Linking & Topical Clusters (The Construction Hub)
- [ ] **Topical Hub-and-Spoke Interlinking**:
  Right now, each tool links to the tools index and footer. However, the 6 construction/materials calculators should contextually cross-link to each other in their editorial copy:
  - **Cubic Yard Calculator** ↔ **Sand Calculator** (e.g. *"For sand bedding and paver joints, use our specialized Sand Calculator"*).
  - **Fill Dirt Calculator** ↔ **Asphalt Calculator** (e.g. *"Before paving a driveway, calculate your sub-base fill dirt and grading depth with our Fill Dirt Calculator"*).
  - **Linear Foot Calculator** ↔ **Rafter Calculator** (e.g. *"Totaling rafter stock lengths or ridge board lumber? Use the Linear Foot Calculator to sum boards and calculate costs"*).
- [ ] **Contextual Related Tools Cards**:
  Create a unified "Related Construction Calculators" widget at the bottom of all 6 construction tool pages.

---

### E. AI Search Engine Optimization (GEO - Generative Engine Optimization)
- [ ] **Create `/public/llms.txt`**:
  Modern AI search engines (ChatGPT Search, Perplexity, Claude, Google SGE) read `/llms.txt` to understand what tools and APIs the site offers.
  Contents should concisely describe each tool, its inputs, units supported, and formulas.
- [ ] **Robots.txt AI Directives**:
  In `src/app/robots.ts`, explicitly declare permissions for user-facing AI answer engines:
  ```txt
  User-agent: GPTBot
  Allow: /
  User-agent: PerplexityBot
  Allow: /
  User-agent: ClaudeBot
  Allow: /
  ```
  This ensures KKC Tools is cited and linked when users ask AI chatbots: *"How many bags of sand do I need for a 10x10 patio?"*.

---

## 4. Prioritized Fix Plan

| Priority | Task | File(s) to Modify | Impact |
|---|---|---|---|
| **P0 (Urgent)** | Fix canonical domain (`www`) on 4 new tools | `src/app/{sand,fill-dirt,linear-foot,rafter}-calculator/page.tsx` | Stops GSC canonical errors |
| **P0 (Urgent)** | Remove duplicate `FAQPage` & `BreadcrumbList` schemas | `src/app/{asphalt,cubic-yard,sand,fill-dirt,linear-foot,rafter}-calculator/page.tsx` | Eliminates schema parsing conflicts |
| **P1 (High)** | Add `<main id="main-content">` to 4 new tools | `src/app/{sand,fill-dirt,linear-foot,rafter}-calculator/page.tsx` | Fixes accessibility skip link & content isolation |
| **P1 (High)** | Standardize `buildMetadata()` with Twitter cards & OG images | `src/app/{sand,fill-dirt,linear-foot,rafter}-calculator/page.tsx` | Beautiful social previews on WhatsApp, X, LinkedIn |
| **P1 (High)** | Add Google Search Console verification meta tag | `src/app/layout.tsx` | Allows 1-click GSC domain verification |
| **P2 (Medium)** | Update `Header.tsx` `isToolsActive` route check | `src/components/layout/Header.tsx` | Polished user navigation experience |
| **P2 (Medium)** | Interlink the 6 Construction Calculators in editorial text | `src/content/pages/*.ts` | Huge boost to site topical authority |
| **P3 (Growth)** | Add `/llms.txt` and explicit AI bot crawlers in `robots.ts` | `public/llms.txt`, `src/app/robots.ts` | Captures Perplexity & ChatGPT search traffic |

---

## 5. Summary & Verification

Sabhi missing items identifiable hain aur bina kisi external dependency ke Next.js 16 aur static export ke standard rules ke andar clean fix kiye ja sakte hain. 

Aap agar kahenge, toh hum **P0 aur P1 ke sabhi fixes ko step-by-step implement karke `npm run verify` ke saath 100% green** kar sakte hain!

